const { ErrorHandler } = require('../helpers');
const { DepartmentService } = require('../services');

async function getAllDepartments(req, res) {
  try {
    const departments = await DepartmentService.getAllDepartments();

    return res.json(departments);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getDepartment(req, res) {
  try {
    const departmentID = parseFloat(req.params.departmentID);

    const department = await DepartmentService.getDepartment(departmentID);

    return res.json(department);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getDoctors(req, res) {
  try {
    const departmentID = parseFloat(req.params.departmentID);

    const doctors = await DepartmentService.getDoctors(departmentID);

    return res.json(doctors);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  getAllDepartments,
  getDepartment,
  getDoctors
};
