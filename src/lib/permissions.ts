/** Permission codes from the API (apps/accounts/permissions.py). Used only to shape the UI. */
export const PERMS = {
  tenantManage: "tenant.manage",
  usersManage: "users.manage",
  orgManage: "org.manage",
  employeesView: "employees.view",
  employeesManage: "employees.manage",
  compensationView: "compensation.view",
  compensationManage: "compensation.manage",
  auditView: "audit.view",
  leaveManage: "leave.manage",
  documentsManage: "documents.manage",
  payrollManage: "payroll.manage",
  payrollApprove: "payroll.approve",
  attendanceManage: "attendance.manage",
  performanceManage: "performance.manage",
  expensesManage: "expenses.manage",
} as const;
