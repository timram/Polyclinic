const knex = require('../knex');
const { JWT, CheckSchedule } = require('../helpers');

async function createAndReturnAccountID(account, trx) {
  try {
    const [id] = await trx('account')
      .returning('id')
      .insert({
        fname: account.fname,
        lname: account.lname,
        email: account.email,
        password: account.password,
        phone: account.phone,
        role: account.role
      });

    return id;
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Such user already exists');
      error.status = 400;
      throw error;
    }

    throw err;
  }
}

function throwNotValidCredentials() {
  const error = new Error('Wrong email or password');
  error.status = 404;
  throw error;
}

async function registerPatient(patient) {
  const patientID = await knex.transaction(async (trx) => {
    const accountID = await createAndReturnAccountID(patient, trx);

    await trx('patient').insert({
      account_id: accountID,
      passport: patient.passport
    });

    return accountID;
  });

  return {
    token: JWT.generate({ id: patientID }),
    id: patientID,
    role: 'patient'
  };
}

async function registerDoctor(doctor) {
  const doctorID = await knex.transaction(async (trx) => {
    CheckSchedule.checkNewSchedule(doctor.schedule);

    const accountID = await createAndReturnAccountID(doctor, trx);

    await trx('doctor').insert({
      account_id: accountID,
      admission_duration: doctor.admissionDuration,
      schedule: JSON.stringify(doctor.schedule),
      department_id: doctor.departmentID
    });

    return accountID;
  });

  return {
    token: JWT.generate({ id: doctorID }),
    id: doctorID,
    role: 'doctor'
  };
}

async function loginPatient({ email, password }) {
  const [account] = await knex('account')
    .where({
      email,
      password,
      role: 'patient'
    });

  if (!account) {
    throwNotValidCredentials();
  }

  return {
    token: JWT.generate({ id: account.id }),
    id: account.id,
    role: 'patient'
  };
}

async function loginDoctor({ email, password }) {
  const [account] = await knex('account')
    .where({
      email,
      password,
      role: 'doctor'
    });

  if (!account) {
    throwNotValidCredentials();
  }

  return {
    token: JWT.generate({ id: account.id }),
    id: account.id,
    role: 'doctor'
  };
}

module.exports = {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor
};
