const knex = require('../knex');
const { JWT } = require('../helpers');

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

async function registerPatient(patient) {
  const patientID = await knex.transaction(async (trx) => {
    const accountID = await createAndReturnAccountID(patient, trx);

    return trx('patient').insert({
      account_id: accountID,
      passport: patient.passport
    });
  });

  return JWT.generate({ id: patientID });
}

async function registerDoctor(doctor) {

}

async function loginPatient({email, password}) {

}

async function loginDoctor({ email, password }) {

}

module.exports = {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor
};
