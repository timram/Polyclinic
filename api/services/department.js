const knex = require('../knex');

function throwThereIsNotDepartmentError() {
  const error = new Error('There is not department with such id');
  error.status = 404;
  throw error;
}

async function getAllDepartments() {
  const departments = await knex('department')
    .select('id', 'name');

  return departments;
}

async function getDepartment(departmentID) {
  const [department] = await knex('department')
    .select('id', 'name')
    .where('id', departmentID);

  if (!department) {
    throwThereIsNotDepartmentError();
  }

  return department;
}

async function getDoctors(departmentID) {
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
    .innerJoin('department', 'department.id', 'doctor.department_id')
    .where('department.id', departmentID);
}

module.exports = {
  getAllDepartments,
  getDepartment,
  getDoctors
};
