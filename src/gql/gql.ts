/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ArchiveEmployeeDocument,
    "\n  query Employee($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      dateOfBirth\n      gender\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name }\n      jobTitle { id name }\n      grade { id name }\n      manager { id fullName }\n      directReports { id fullName jobTitle { name } }\n      compensation { amount currency frequency effectiveDate }\n      compensationHistory { id amount currency frequency effectiveDate reason }\n      employmentHistory {\n        id\n        effectiveDate\n        changeType\n        reason\n        jobTitle { name }\n        department { name }\n        grade { name }\n        manager { fullName }\n      }\n    }\n  }\n": typeof types.EmployeeDocument,
    "\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.HireEmployeeDocument,
    "\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n": typeof types.EmployeesDocument,
    "\n  query LeaveApprovals($everyone: Boolean!) {\n    leaveApprovals(everyone: $everyone) {\n      id startDate endDate halfDay days reason status createdAt canDecide decideAsOverride\n      employee { id fullName }\n      leaveType { id name color }\n      waitingFor { id fullName }\n      approvals { level status note overridden actedBy actedAt approver { id fullName } }\n    }\n    myDelegations { id startDate endDate delegator { id fullName } delegate { id fullName } }\n  }\n": typeof types.LeaveApprovalsDocument,
    "\n  mutation DecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": typeof types.DecideLeaveDocument,
    "\n  query DelegatePeople {\n    employees(filter: { statuses: [ACTIVE, PROBATION] }, first: 100) { nodes { id fullName } }\n  }\n": typeof types.DelegatePeopleDocument,
    "\n  mutation DelegateApprovals($input: DelegateInput!) {\n    delegateApprovals(input: $input) { delegation { id } errors { field message } }\n  }\n": typeof types.DelegateApprovalsDocument,
    "\n  mutation RevokeDelegation($id: ID!) {\n    revokeDelegation(id: $id) { delegation { id } errors { field message } }\n  }\n": typeof types.RevokeDelegationDocument,
    "\n  query LeaveCalendar($start: Date!, $end: Date!, $departmentId: ID) {\n    leaveCalendar(start: $start, end: $end, departmentId: $departmentId) {\n      absences {\n        requestId startDate endDate halfDay status\n        employee { id fullName }\n        leaveType { id name color }\n      }\n      holidays { id name date location { name } }\n    }\n  }\n": typeof types.LeaveCalendarDocument,
    "\n  query CalendarDepartments {\n    departments { id name isActive }\n  }\n": typeof types.CalendarDepartmentsDocument,
    "\n  query UpcomingHolidays($year: Int!, $next: Int!) {\n    thisYear: publicHolidays(year: $year) { id name date location { name } }\n    nextYear: publicHolidays(year: $next) { id name date location { name } }\n  }\n": typeof types.UpcomingHolidaysDocument,
    "\n  query LeaveSetup($year: Int!) {\n    leaveTypes(includeInactive: true) { id name code color isPaid tracksBalance allowHalfDays approvalLevels isActive }\n    leavePolicies {\n      id name daysPerYear accrual proRata startsOn carryOverMax carryOverExpiryMonths employmentType isActive\n      leaveType { id name color }\n      legalEntity { id name }\n      location { id name }\n      grade { id name }\n      tenureRules { years extraDays }\n    }\n    publicHolidays(year: $year) { id name date location { id name } }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    grades { id name isActive }\n  }\n": typeof types.LeaveSetupDocument,
    "\n  mutation SaveLeaveType($input: SaveLeaveTypeInput!) {\n    saveLeaveType(input: $input) { leaveType { id } errors { field message } }\n  }\n": typeof types.SaveLeaveTypeDocument,
    "\n  mutation SaveLeavePolicy($input: SaveLeavePolicyInput!) {\n    saveLeavePolicy(input: $input) { policy { id } errors { field message } }\n  }\n": typeof types.SaveLeavePolicyDocument,
    "\n  mutation SavePublicHoliday($input: SavePublicHolidayInput!) {\n    savePublicHoliday(input: $input) { holiday { id } errors { field message } }\n  }\n": typeof types.SavePublicHolidayDocument,
    "\n  mutation DeletePublicHoliday($id: ID!) {\n    deletePublicHoliday(id: $id)\n  }\n": typeof types.DeletePublicHolidayDocument,
    "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": typeof types.OrganizationDocument,
    "\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n": typeof types.SaveLegalEntityDocument,
    "\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n": typeof types.SaveLocationDocument,
    "\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n": typeof types.SaveDepartmentDocument,
    "\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n": typeof types.SaveJobTitleDocument,
    "\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n": typeof types.SaveGradeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n": typeof types.WaitingApprovalsDocument,
    "\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.UpdateEmployeeDocument,
    "\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": typeof types.JobOptionsDocument,
    "\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeJobDocument,
    "\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeCompensationDocument,
    "\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeStatusDocument,
    "\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n": typeof types.EmployeeLeaveDocument,
    "\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": typeof types.CancelLeaveDocument,
    "\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n": typeof types.LeaveQuoteDocument,
    "\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": typeof types.RequestLeaveDocument,
    "\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n": typeof types.AdjustLeaveBalanceDocument,
    "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n    }\n    tenant { name slug primaryColor country currency }\n  }\n": typeof types.MeDocument,
};
const documents: Documents = {
    "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ArchiveEmployeeDocument,
    "\n  query Employee($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      dateOfBirth\n      gender\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name }\n      jobTitle { id name }\n      grade { id name }\n      manager { id fullName }\n      directReports { id fullName jobTitle { name } }\n      compensation { amount currency frequency effectiveDate }\n      compensationHistory { id amount currency frequency effectiveDate reason }\n      employmentHistory {\n        id\n        effectiveDate\n        changeType\n        reason\n        jobTitle { name }\n        department { name }\n        grade { name }\n        manager { fullName }\n      }\n    }\n  }\n": types.EmployeeDocument,
    "\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.HireEmployeeDocument,
    "\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n": types.EmployeesDocument,
    "\n  query LeaveApprovals($everyone: Boolean!) {\n    leaveApprovals(everyone: $everyone) {\n      id startDate endDate halfDay days reason status createdAt canDecide decideAsOverride\n      employee { id fullName }\n      leaveType { id name color }\n      waitingFor { id fullName }\n      approvals { level status note overridden actedBy actedAt approver { id fullName } }\n    }\n    myDelegations { id startDate endDate delegator { id fullName } delegate { id fullName } }\n  }\n": types.LeaveApprovalsDocument,
    "\n  mutation DecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": types.DecideLeaveDocument,
    "\n  query DelegatePeople {\n    employees(filter: { statuses: [ACTIVE, PROBATION] }, first: 100) { nodes { id fullName } }\n  }\n": types.DelegatePeopleDocument,
    "\n  mutation DelegateApprovals($input: DelegateInput!) {\n    delegateApprovals(input: $input) { delegation { id } errors { field message } }\n  }\n": types.DelegateApprovalsDocument,
    "\n  mutation RevokeDelegation($id: ID!) {\n    revokeDelegation(id: $id) { delegation { id } errors { field message } }\n  }\n": types.RevokeDelegationDocument,
    "\n  query LeaveCalendar($start: Date!, $end: Date!, $departmentId: ID) {\n    leaveCalendar(start: $start, end: $end, departmentId: $departmentId) {\n      absences {\n        requestId startDate endDate halfDay status\n        employee { id fullName }\n        leaveType { id name color }\n      }\n      holidays { id name date location { name } }\n    }\n  }\n": types.LeaveCalendarDocument,
    "\n  query CalendarDepartments {\n    departments { id name isActive }\n  }\n": types.CalendarDepartmentsDocument,
    "\n  query UpcomingHolidays($year: Int!, $next: Int!) {\n    thisYear: publicHolidays(year: $year) { id name date location { name } }\n    nextYear: publicHolidays(year: $next) { id name date location { name } }\n  }\n": types.UpcomingHolidaysDocument,
    "\n  query LeaveSetup($year: Int!) {\n    leaveTypes(includeInactive: true) { id name code color isPaid tracksBalance allowHalfDays approvalLevels isActive }\n    leavePolicies {\n      id name daysPerYear accrual proRata startsOn carryOverMax carryOverExpiryMonths employmentType isActive\n      leaveType { id name color }\n      legalEntity { id name }\n      location { id name }\n      grade { id name }\n      tenureRules { years extraDays }\n    }\n    publicHolidays(year: $year) { id name date location { id name } }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    grades { id name isActive }\n  }\n": types.LeaveSetupDocument,
    "\n  mutation SaveLeaveType($input: SaveLeaveTypeInput!) {\n    saveLeaveType(input: $input) { leaveType { id } errors { field message } }\n  }\n": types.SaveLeaveTypeDocument,
    "\n  mutation SaveLeavePolicy($input: SaveLeavePolicyInput!) {\n    saveLeavePolicy(input: $input) { policy { id } errors { field message } }\n  }\n": types.SaveLeavePolicyDocument,
    "\n  mutation SavePublicHoliday($input: SavePublicHolidayInput!) {\n    savePublicHoliday(input: $input) { holiday { id } errors { field message } }\n  }\n": types.SavePublicHolidayDocument,
    "\n  mutation DeletePublicHoliday($id: ID!) {\n    deletePublicHoliday(id: $id)\n  }\n": types.DeletePublicHolidayDocument,
    "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": types.OrganizationDocument,
    "\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n": types.SaveLegalEntityDocument,
    "\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n": types.SaveLocationDocument,
    "\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n": types.SaveDepartmentDocument,
    "\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n": types.SaveJobTitleDocument,
    "\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n": types.SaveGradeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n": types.WaitingApprovalsDocument,
    "\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.UpdateEmployeeDocument,
    "\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": types.JobOptionsDocument,
    "\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeJobDocument,
    "\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeCompensationDocument,
    "\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeStatusDocument,
    "\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n": types.EmployeeLeaveDocument,
    "\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": types.CancelLeaveDocument,
    "\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n": types.LeaveQuoteDocument,
    "\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": types.RequestLeaveDocument,
    "\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n": types.AdjustLeaveBalanceDocument,
    "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n    }\n    tenant { name slug primaryColor country currency }\n  }\n": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Employee($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      dateOfBirth\n      gender\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name }\n      jobTitle { id name }\n      grade { id name }\n      manager { id fullName }\n      directReports { id fullName jobTitle { name } }\n      compensation { amount currency frequency effectiveDate }\n      compensationHistory { id amount currency frequency effectiveDate reason }\n      employmentHistory {\n        id\n        effectiveDate\n        changeType\n        reason\n        jobTitle { name }\n        department { name }\n        grade { name }\n        manager { fullName }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Employee($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      dateOfBirth\n      gender\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name }\n      jobTitle { id name }\n      grade { id name }\n      manager { id fullName }\n      directReports { id fullName jobTitle { name } }\n      compensation { amount currency frequency effectiveDate }\n      compensationHistory { id amount currency frequency effectiveDate reason }\n      employmentHistory {\n        id\n        effectiveDate\n        changeType\n        reason\n        jobTitle { name }\n        department { name }\n        grade { name }\n        manager { fullName }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n"): (typeof documents)["\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LeaveApprovals($everyone: Boolean!) {\n    leaveApprovals(everyone: $everyone) {\n      id startDate endDate halfDay days reason status createdAt canDecide decideAsOverride\n      employee { id fullName }\n      leaveType { id name color }\n      waitingFor { id fullName }\n      approvals { level status note overridden actedBy actedAt approver { id fullName } }\n    }\n    myDelegations { id startDate endDate delegator { id fullName } delegate { id fullName } }\n  }\n"): (typeof documents)["\n  query LeaveApprovals($everyone: Boolean!) {\n    leaveApprovals(everyone: $everyone) {\n      id startDate endDate halfDay days reason status createdAt canDecide decideAsOverride\n      employee { id fullName }\n      leaveType { id name color }\n      waitingFor { id fullName }\n      approvals { level status note overridden actedBy actedAt approver { id fullName } }\n    }\n    myDelegations { id startDate endDate delegator { id fullName } delegate { id fullName } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation DecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DelegatePeople {\n    employees(filter: { statuses: [ACTIVE, PROBATION] }, first: 100) { nodes { id fullName } }\n  }\n"): (typeof documents)["\n  query DelegatePeople {\n    employees(filter: { statuses: [ACTIVE, PROBATION] }, first: 100) { nodes { id fullName } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DelegateApprovals($input: DelegateInput!) {\n    delegateApprovals(input: $input) { delegation { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation DelegateApprovals($input: DelegateInput!) {\n    delegateApprovals(input: $input) { delegation { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeDelegation($id: ID!) {\n    revokeDelegation(id: $id) { delegation { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation RevokeDelegation($id: ID!) {\n    revokeDelegation(id: $id) { delegation { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LeaveCalendar($start: Date!, $end: Date!, $departmentId: ID) {\n    leaveCalendar(start: $start, end: $end, departmentId: $departmentId) {\n      absences {\n        requestId startDate endDate halfDay status\n        employee { id fullName }\n        leaveType { id name color }\n      }\n      holidays { id name date location { name } }\n    }\n  }\n"): (typeof documents)["\n  query LeaveCalendar($start: Date!, $end: Date!, $departmentId: ID) {\n    leaveCalendar(start: $start, end: $end, departmentId: $departmentId) {\n      absences {\n        requestId startDate endDate halfDay status\n        employee { id fullName }\n        leaveType { id name color }\n      }\n      holidays { id name date location { name } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CalendarDepartments {\n    departments { id name isActive }\n  }\n"): (typeof documents)["\n  query CalendarDepartments {\n    departments { id name isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UpcomingHolidays($year: Int!, $next: Int!) {\n    thisYear: publicHolidays(year: $year) { id name date location { name } }\n    nextYear: publicHolidays(year: $next) { id name date location { name } }\n  }\n"): (typeof documents)["\n  query UpcomingHolidays($year: Int!, $next: Int!) {\n    thisYear: publicHolidays(year: $year) { id name date location { name } }\n    nextYear: publicHolidays(year: $next) { id name date location { name } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LeaveSetup($year: Int!) {\n    leaveTypes(includeInactive: true) { id name code color isPaid tracksBalance allowHalfDays approvalLevels isActive }\n    leavePolicies {\n      id name daysPerYear accrual proRata startsOn carryOverMax carryOverExpiryMonths employmentType isActive\n      leaveType { id name color }\n      legalEntity { id name }\n      location { id name }\n      grade { id name }\n      tenureRules { years extraDays }\n    }\n    publicHolidays(year: $year) { id name date location { id name } }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    grades { id name isActive }\n  }\n"): (typeof documents)["\n  query LeaveSetup($year: Int!) {\n    leaveTypes(includeInactive: true) { id name code color isPaid tracksBalance allowHalfDays approvalLevels isActive }\n    leavePolicies {\n      id name daysPerYear accrual proRata startsOn carryOverMax carryOverExpiryMonths employmentType isActive\n      leaveType { id name color }\n      legalEntity { id name }\n      location { id name }\n      grade { id name }\n      tenureRules { years extraDays }\n    }\n    publicHolidays(year: $year) { id name date location { id name } }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    grades { id name isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLeaveType($input: SaveLeaveTypeInput!) {\n    saveLeaveType(input: $input) { leaveType { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLeaveType($input: SaveLeaveTypeInput!) {\n    saveLeaveType(input: $input) { leaveType { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLeavePolicy($input: SaveLeavePolicyInput!) {\n    saveLeavePolicy(input: $input) { policy { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLeavePolicy($input: SaveLeavePolicyInput!) {\n    saveLeavePolicy(input: $input) { policy { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SavePublicHoliday($input: SavePublicHolidayInput!) {\n    savePublicHoliday(input: $input) { holiday { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SavePublicHoliday($input: SavePublicHolidayInput!) {\n    savePublicHoliday(input: $input) { holiday { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePublicHoliday($id: ID!) {\n    deletePublicHoliday(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeletePublicHoliday($id: ID!) {\n    deletePublicHoliday(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"): (typeof documents)["\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n"): (typeof documents)["\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"): (typeof documents)["\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n"): (typeof documents)["\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n    }\n    tenant { name slug primaryColor country currency }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n    }\n    tenant { name slug primaryColor country currency }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;