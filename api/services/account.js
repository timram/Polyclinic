const knex = require('../knex');
const { checkSchedule } = require('../helpers');

function throwAccountNotExists() {
  const error = new Error('account with such ID does not extists');
  error.status = 400;
  throw error;
}

async function getAccount(accountID) {
  const [account] = await knex('account')
    .select('id', 'fname', 'lname', 'email', 'phone')
    .where('id', accountID);

  if (!account) {
    throwAccountNotExists();
  }

  return account;
}

async function updateAccount({ account, trx }) {
  try {
    return trx('account')
      .update({
        fname: account.fname,
        lname: account.lname,
        email: account.email,
        phone: account.phone,
      })
      .where('id', account.accountID);
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Such user already exists');
      error.status = 400;
      throw error;
    }

    throw err;
  }
}

async function getAllPatients() {
  return knex('account')
    .select(
      'account.fname',
      'account.lname',
      'account.email',
      'account.phone',
      'patient.passport'
    )
    .innerJoin('patient', 'patient.account_id', 'account.id');
}

async function getAllDoctors() {
  return knex('account')
    .select(
      'account.fname',
      'account.lname',
      'account.email',
      'account.phone',
      'doctor.schedule',
      'doctor.admission_duration as admissionDuration',
      'department.name as departmentName'
    )
    .innerJoin('doctor', 'doctor.account_id', 'account.id')
    .innerJoin('department', 'department.id', 'doctor.department_id');
}

async function getPatient(accountID) {
  const account = await getAccount(accountID);

  const [patient] = await knex('patient')
    .select('passport')
    .where('account_id', account.id);

  if (!patient) {
    throwAccountNotExists();
  }

  return Object.assign({}, account, patient);
}

async function getDoctor(accountID) {
  const account = await getAccount(accountID);
  
  const [doctor] = await knex('doctor')
    .select(
      'doctor.schedule',
      'doctor.admission_duration as admissionDuration',
      'department.name as departmentName'
    )
    .innerJoin('department', 'department.id', 'doctor.department_id')
    .where('doctor.account_id', account.id);

  if (!doctor) {
    throwAccountNotExists();
  }

  return Object.assign({}, account, doctor);
}

async function updatePatient(patient) {
  await knex.transaction(async (trx) => {
    await updateAccount({ account: patient, trx });

    return trx('patient')
      .update({
        passport: patient.passport
      })
      .where('account_id', patient.accountID);
  });

  return getPatient(patient.accountID);
}

async function updateDoctor(doctor) {
  await knex.transaction(async (trx) => {
    checkSchedule(doctor.schedule);

    await updateAccount({ account: doctor, trx });

    return trx('doctor')
      .update({
        admission_duration: doctor.admissionDuration,
        schedule: JSON.stringify(doctor.schedule),
        department_id: doctor.departmentID
      })
      .where('account_id', doctor.accountID);
  });

  return getDoctor(doctor.accountID);
}


module.exports = {
  getPatient,
  getDoctor,
  updatePatient,
  updateDoctor,
  getAllDoctors,
  getAllPatients
};
