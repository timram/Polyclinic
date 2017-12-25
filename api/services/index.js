const PingService = require('./ping');
const AuthService = require('./authorization');
const DepartmentService = require('./department');
const AccountService = require('./account');
const AppointmentService = require('./appointment');
const AnalysisService = require('./analysis');
const DiseaseHistoryService = require('./disease_history');

module.exports = {
  PingService,
  AuthService,
  DepartmentService,
  AccountService,
  AppointmentService,
  AnalysisService,
  DiseaseHistoryService
};
