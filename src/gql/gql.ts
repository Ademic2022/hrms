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
    "\n  mutation ChangePassword($current: String!, $new: String!) {\n    changePassword(current: $current, new: $new) { ok errors { field message } }\n  }\n": typeof types.ChangePasswordDocument,
    "\n  mutation StartMfaSetup { startMfaSetup { secret uri qrSvg } }\n": typeof types.StartMfaSetupDocument,
    "\n  mutation ConfirmMfaSetup($code: String!) {\n    confirmMfaSetup(code: $code) { codes errors { field message } }\n  }\n": typeof types.ConfirmMfaSetupDocument,
    "\n  mutation DisableMfa($password: String!) {\n    disableMfa(password: $password) { ok errors { field message } }\n  }\n": typeof types.DisableMfaDocument,
    "\n  mutation NewRecoveryCodes($code: String!) {\n    newRecoveryCodes(code: $code) { codes errors { field message } }\n  }\n": typeof types.NewRecoveryCodesDocument,
    "\n  query OrgChart {\n    orgChart { id fullName jobTitle departmentId department location workEmail managerId directReportCount }\n  }\n": typeof types.OrgChartDocument,
    "\n  query DocumentsAdmin($within: Int!) {\n    expiringDocuments(withinDays: $within) {\n      id title expiresOn\n      employee { id fullName }\n      category { id name }\n    }\n    documentCategories(includeInactive: true) { id name employeeCanView managerCanView requiresExpiry isActive }\n  }\n": typeof types.DocumentsAdminDocument,
    "\n  mutation SaveDocumentCategory($input: SaveDocumentCategoryInput!) {\n    saveDocumentCategory(input: $input) { category { id } errors { field message } }\n  }\n": typeof types.SaveDocumentCategoryDocument,
    "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) { employee { id } errors { field message } }\n  }\n": typeof types.ArchiveEmployeeDocument,
    "\n  mutation SendEmployeePasswordReset($employeeId: ID!) {\n    sendEmployeePasswordReset(employeeId: $employeeId)\n  }\n": typeof types.SendEmployeePasswordResetDocument,
    "\n  query EmployeeAccess($id: ID!) {\n    employee(id: $id) { id access { email roles isActive invitePending } }\n  }\n": typeof types.EmployeeAccessDocument,
    "\n  mutation RemoveEmployeePhoto($employeeId: ID!) {\n    removeEmployeePhoto(employeeId: $employeeId)\n  }\n": typeof types.RemoveEmployeePhotoDocument,
    "\n  query CustomFieldsAdmin {\n    customFields(includeInactive: true) { id name key fieldType choices helpText hrOnly position isActive }\n  }\n": typeof types.CustomFieldsAdminDocument,
    "\n  mutation SaveCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id } errors { field message } }\n  }\n": typeof types.SaveCustomFieldDocument,
    "\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.HireEmployeeDocument,
    "\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n": typeof types.EmployeesDocument,
    "\n  query PendingChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide lines { field label current requested } }\n  }\n": typeof types.PendingChangesDocument,
    "\n  mutation DecideChangeRequest($id: ID!, $approve: Boolean!, $note: String) {\n    decideChangeRequest(id: $id, approve: $approve, note: $note) { request { id status } errors { field message } }\n  }\n": typeof types.DecideChangeRequestDocument,
    "\n  query HomeExpiring {\n    expiringDocuments(withinDays: 30) { id }\n  }\n": typeof types.HomeExpiringDocument,
    "\n  query HomeMyPhoto($id: ID!) {\n    employee(id: $id) { id photoUrl }\n  }\n": typeof types.HomeMyPhotoDocument,
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
    "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name description isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": typeof types.OrganizationDocument,
    "\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n": typeof types.SaveLegalEntityDocument,
    "\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n": typeof types.SaveLocationDocument,
    "\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n": typeof types.SaveDepartmentDocument,
    "\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n": typeof types.SaveJobTitleDocument,
    "\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n": typeof types.SaveGradeDocument,
    "\n  query RunReport($key: String!, $params: ReportParams) {\n    runReport(key: $key, params: $params) {\n      title chart note start end rows\n      columns { key label kind }\n      summary { label value }\n    }\n  }\n": typeof types.RunReportDocument,
    "\n  query ReportFilterOptions {\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n  }\n": typeof types.ReportFilterOptionsDocument,
    "\n  query BenefitPlansSetup {\n    benefitPlans(includeInactive: true) {\n      id name kind provider description employeeRate employerRate basis statutory isActive enrolledCount\n    }\n  }\n": typeof types.BenefitPlansSetupDocument,
    "\n  mutation SaveBenefitPlan($input: SaveBenefitPlanInput!) {\n    saveBenefitPlan(input: $input) { plan { id } errors { field message } }\n  }\n": typeof types.SaveBenefitPlanDocument,
    "\n  query TaskTemplates {\n    taskTemplates { id kind title description category assignee dueOffset isActive }\n  }\n": typeof types.TaskTemplatesDocument,
    "\n  mutation SaveTaskTemplate($input: SaveTaskTemplateInput!) {\n    saveTaskTemplate(input: $input) { template { id } errors { field message } }\n  }\n": typeof types.SaveTaskTemplateDocument,
    "\n  query CompanySettings {\n    companySettings {\n      name country currency timezone primaryColor logoUrl requireAdminMfa sessionTimeoutMinutes ipAllowlist yourIp\n    }\n  }\n": typeof types.CompanySettingsDocument,
    "\n  mutation UpdateCompanySettings($input: CompanySettingsInput!) {\n    updateCompanySettings(input: $input) { settings { name } errors { field message } }\n  }\n": typeof types.UpdateCompanySettingsDocument,
    "\n  mutation RemoveCompanyLogo { removeCompanyLogo }\n": typeof types.RemoveCompanyLogoDocument,
    "\n  query UsersAdmin {\n    members {\n      id email firstName lastName fullName isActive invitePending lastLogin\n      roles { code name scope }\n      employee { id name }\n      legalEntities { id name }\n      locations { id name }\n      departments { id name }\n    }\n    roles { id code name scope permissions }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n    employees(first: 100, filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE, CANDIDATE] }) { nodes { id fullName } }\n  }\n": typeof types.UsersAdminDocument,
    "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) { member { id } errors { field message } }\n  }\n": typeof types.InviteMemberDocument,
    "\n  mutation UpdateMember($input: UpdateMemberInput!) {\n    updateMember(input: $input) { member { id } errors { field message } }\n  }\n": typeof types.UpdateMemberDocument,
    "\n  mutation CorrectInvite($input: CorrectInviteInput!) {\n    correctInvite(input: $input) { member { id } errors { field message } }\n  }\n": typeof types.CorrectInviteDocument,
    "\n  mutation CancelInvite($id: ID!) {\n    cancelInvite(id: $id) { errors { field message } }\n  }\n": typeof types.CancelInviteDocument,
    "\n  mutation ResendInvite($id: ID!) {\n    resendInvite(id: $id)\n  }\n": typeof types.ResendInviteDocument,
    "\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(email: $email)\n  }\n": typeof types.RequestPasswordResetDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      mfaRequired\n      me { permissions }\n      errors { field message }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation VerifyMfa($code: String!) {\n    verifyMfa(code: $code) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n": typeof types.VerifyMfaDocument,
    "\n  query PasswordLink($uid: String!, $token: String!) {\n    passwordLink(uid: $uid, token: $token)\n  }\n": typeof types.PasswordLinkDocument,
    "\n  mutation SetPassword($input: SetPasswordInput!) {\n    setPassword(input: $input) { ok errors { field message } }\n  }\n": typeof types.SetPasswordDocument,
    "\n  mutation RedeemWelcome($token: String!) {\n    redeemWelcome(token: $token) { me { mfaSetupRequired } errors { message } }\n  }\n": typeof types.RedeemWelcomeDocument,
    "\n  query SlugCheck($slug: String!) {\n    slugCheck(slug: $slug)\n  }\n": typeof types.SlugCheckDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) { url errors { field message } }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n": typeof types.WaitingApprovalsDocument,
    "\n  query ChangesWaiting {\n    pendingChangeRequests { id }\n  }\n": typeof types.ChangesWaitingDocument,
    "\n  query NotificationList($first: Int!, $after: String) {\n    unreadNotificationCount\n    notifications(first: $first, after: $after) {\n      nodes { id kind title body link read createdAt }\n      pageInfo { hasNextPage endCursor }\n    }\n  }\n": typeof types.NotificationListDocument,
    "\n  query UnreadNotificationCount {\n    unreadNotificationCount\n  }\n": typeof types.UnreadNotificationCountDocument,
    "\n  mutation MarkNotificationsRead($ids: [ID!]) {\n    markNotificationsRead(ids: $ids)\n  }\n": typeof types.MarkNotificationsReadDocument,
    "\n  mutation EmailMyCompanies($email: String!) {\n    emailMyCompanies(email: $email)\n  }\n": typeof types.EmailMyCompaniesDocument,
    "\n  query EmployeeDocuments($employeeId: ID!) {\n    employeeDocuments(employeeId: $employeeId) {\n      id title originalName contentType size expiresOn notes uploadedBy createdAt\n      category { id name requiresExpiry employeeCanView managerCanView }\n    }\n  }\n": typeof types.EmployeeDocumentsDocument,
    "\n  query DocumentCategoryOptions {\n    documentCategories { id name requiresExpiry employeeCanView managerCanView isActive }\n  }\n": typeof types.DocumentCategoryOptionsDocument,
    "\n  mutation DocumentDownloadUrl($id: ID!) {\n    documentDownloadUrl(id: $id)\n  }\n": typeof types.DocumentDownloadUrlDocument,
    "\n  mutation UpdateDocument($input: UpdateDocumentInput!) {\n    updateDocument(input: $input) { document { id } errors { field message } }\n  }\n": typeof types.UpdateDocumentDocument,
    "\n  mutation RemoveDocument($id: ID!) {\n    removeDocument(id: $id)\n  }\n": typeof types.RemoveDocumentDocument,
    "\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.UpdateEmployeeDocument,
    "\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": typeof types.JobOptionsDocument,
    "\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeJobDocument,
    "\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeCompensationDocument,
    "\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": typeof types.ChangeEmployeeStatusDocument,
    "\n  mutation SaveEmergencyContact($input: EmergencyContactInput!) {\n    saveEmergencyContact(input: $input) { contact { id } errors { field message } }\n  }\n": typeof types.SaveEmergencyContactDocument,
    "\n  mutation DeleteEmergencyContact($id: ID!) {\n    deleteEmergencyContact(id: $id)\n  }\n": typeof types.DeleteEmergencyContactDocument,
    "\n  mutation RevealPrivateDetails($employeeId: ID!) {\n    revealPrivateDetails(employeeId: $employeeId) { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n  }\n": typeof types.RevealPrivateDetailsDocument,
    "\n  mutation SavePrivateDetails($input: PrivateDetailsInput!) {\n    savePrivateDetails(input: $input) { details { masked } errors { field message } }\n  }\n": typeof types.SavePrivateDetailsDocument,
    "\n  mutation SetEmployeeCustomValues($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n": typeof types.SetEmployeeCustomValuesDocument,
    "\n  query MyChangeRequests {\n    myChangeRequests { id status note createdAt decidedAt decidedBy lines { field label current requested } }\n  }\n": typeof types.MyChangeRequestsDocument,
    "\n  mutation UpdateMyDetails($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n": typeof types.UpdateMyDetailsDocument,
    "\n  mutation CancelChangeRequest($id: ID!) {\n    cancelChangeRequest(id: $id) { request { id status } errors { field message } }\n  }\n": typeof types.CancelChangeRequestDocument,
    "\n  query HomeData {\n    home {\n      celebrations { kind date years person { id fullName jobTitle photoUrl } }\n      newHires { hireDate person { id fullName jobTitle photoUrl } }\n      myStuff { trainings certifications certificationsExpiring benefits openTasks }\n      directReports { notes outToday person { id fullName jobTitle photoUrl } }\n      insights {\n        headcount { month value }\n        leavers { month value }\n        turnoverRate\n        byLocation { label value }\n        pendingUrgent pendingOther withoutPayRaise\n        onboarding { inProgress withOverdue startingSoon }\n      }\n    }\n    announcements(limit: 10) { id title body authorName publishedAt pinned }\n    companyLinks { id group label url }\n    homeLayout { key hidden }\n  }\n": typeof types.HomeDataDocument,
    "\n  query HomeApprovals {\n    leaveApprovals { id startDate endDate days createdAt canDecide employee { id fullName } leaveType { name color } }\n  }\n": typeof types.HomeApprovalsDocument,
    "\n  query HomeChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide }\n  }\n": typeof types.HomeChangesDocument,
    "\n  mutation HomeDecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) { request { id status } errors { field message } }\n  }\n": typeof types.HomeDecideLeaveDocument,
    "\n  mutation SaveAnnouncement($input: AnnouncementInput!) {\n    saveAnnouncement(input: $input) { announcement { id } errors { field message } }\n  }\n": typeof types.SaveAnnouncementDocument,
    "\n  mutation DeleteAnnouncement($id: ID!) {\n    deleteAnnouncement(id: $id)\n  }\n": typeof types.DeleteAnnouncementDocument,
    "\n  query HomeWhosOut($day: Date!) {\n    leaveCalendar(start: $day, end: $day) { absences { requestId status employee { id fullName } leaveType { name } } }\n  }\n": typeof types.HomeWhosOutDocument,
    "\n  mutation SaveCompanyLinks($links: [CompanyLinkInput!]!) {\n    saveCompanyLinks(links: $links) { links { id } errors { field message } }\n  }\n": typeof types.SaveCompanyLinksDocument,
    "\n  query HomeTimeOffUsed($leaveTypeId: ID!) {\n    timeOffUsed(leaveTypeId: $leaveTypeId) { month value }\n  }\n": typeof types.HomeTimeOffUsedDocument,
    "\n  query HomeLeaveTypes {\n    leaveTypes { id name }\n  }\n": typeof types.HomeLeaveTypesDocument,
    "\n  mutation SaveHomeLayout($widgets: JSON!) {\n    saveHomeLayout(widgets: $widgets) { key hidden }\n  }\n": typeof types.SaveHomeLayoutDocument,
    "\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n": typeof types.EmployeeLeaveDocument,
    "\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": typeof types.CancelLeaveDocument,
    "\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n": typeof types.LeaveQuoteDocument,
    "\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": typeof types.RequestLeaveDocument,
    "\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n": typeof types.AdjustLeaveBalanceDocument,
    "\n  query EmployeeBenefits($employeeId: ID!) {\n    employeeBenefits(employeeId: $employeeId) {\n      id status startDate endDate memberNumber coverage dependants note\n      plan { id name kind provider employeeRate employerRate basis statutory }\n    }\n    benefitPlans { id name kind provider employeeRate employerRate basis statutory isActive }\n  }\n": typeof types.EmployeeBenefitsDocument,
    "\n  mutation SaveBenefitEnrollment($input: SaveEnrollmentInput!) {\n    saveBenefitEnrollment(input: $input) { enrollment { id } errors { field message } }\n  }\n": typeof types.SaveBenefitEnrollmentDocument,
    "\n  mutation DeleteBenefitEnrollment($id: ID!) {\n    deleteBenefitEnrollment(id: $id)\n  }\n": typeof types.DeleteBenefitEnrollmentDocument,
    "\n  mutation SetBonusTarget($input: BonusTargetInput!) {\n    setBonusTarget(input: $input) { employee { id } errors { field message } }\n  }\n": typeof types.SetBonusTargetDocument,
    "\n  mutation AddEmployeeNote($employeeId: ID!, $body: String!) {\n    addEmployeeNote(employeeId: $employeeId, body: $body) { note { id } errors { field message } }\n  }\n": typeof types.AddEmployeeNoteDocument,
    "\n  mutation DeleteEmployeeNote($id: ID!) {\n    deleteEmployeeNote(id: $id)\n  }\n": typeof types.DeleteEmployeeNoteDocument,
    "\n  query EmployeeChecklist($employeeId: ID!, $kind: ChecklistKind!) {\n    checklist(employeeId: $employeeId, kind: $kind) {\n      startDate\n      tasks { id title description category assignee dueDate completedAt completedByName canComplete }\n    }\n  }\n": typeof types.EmployeeChecklistDocument,
    "\n  mutation StartChecklist($employeeId: ID!, $kind: ChecklistKind!, $startDate: Date) {\n    startChecklist(employeeId: $employeeId, kind: $kind, startDate: $startDate) { tasks { id } errors { field message } }\n  }\n": typeof types.StartChecklistDocument,
    "\n  mutation SetTaskDone($id: ID!, $done: Boolean!) {\n    setTaskDone(id: $id, done: $done) { task { id completedAt } errors { field message } }\n  }\n": typeof types.SetTaskDoneDocument,
    "\n  mutation AddEmployeeTask($input: AddTaskInput!) {\n    addEmployeeTask(input: $input) { task { id } errors { field message } }\n  }\n": typeof types.AddEmployeeTaskDocument,
    "\n  mutation DeleteEmployeeTask($id: ID!) {\n    deleteEmployeeTask(id: $id)\n  }\n": typeof types.DeleteEmployeeTaskDocument,
    "\n  mutation SaveLayoutCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id key name } errors { field message } }\n  }\n": typeof types.SaveLayoutCustomFieldDocument,
    "\n  mutation SaveLayoutCustomTable($input: SaveCustomTableInput!) {\n    saveCustomTable(input: $input) { table { id key name } errors { field message } }\n  }\n": typeof types.SaveLayoutCustomTableDocument,
    "\n  mutation UpdateEmployeeFields($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) { employee { id } errors { field message } }\n  }\n": typeof types.UpdateEmployeeFieldsDocument,
    "\n  mutation UpdateMyFields($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n": typeof types.UpdateMyFieldsDocument,
    "\n  mutation SetCustomFields($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n": typeof types.SetCustomFieldsDocument,
    "\n  query LeaveHistory($employeeId: ID, $leaveTypeId: ID!, $year: Int) {\n    leaveHistory(employeeId: $employeeId, leaveTypeId: $leaveTypeId, year: $year) {\n      years\n      rows { id date kind description detail used earned balance }\n    }\n  }\n": typeof types.LeaveHistoryDocument,
    "\n  mutation SaveTableRow($input: TableRowInput!) {\n    saveTableRow(input: $input) { row { id } errors { field message } }\n  }\n": typeof types.SaveTableRowDocument,
    "\n  mutation DeleteTableRow($id: ID!) {\n    deleteTableRow(id: $id)\n  }\n": typeof types.DeleteTableRowDocument,
    "\n  query EmployeeProfile($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      workPhone\n      workPhoneExt\n      dateOfBirth\n      gender\n      maritalStatus\n      personal { nationality linkedinUrl twitter facebook homePhone addressLine1 addressLine2 city state postalCode country }\n      photoUrl\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name city country timezone }\n      jobTitle { id name description }\n      grade { id name }\n      manager { id fullName jobTitle { name } photoUrl }\n      directReports { id fullName jobTitle { name } }\n      emergencyContacts {\n        id name relationship phone workPhone workPhoneExt homePhone email isPrimary\n        addressLine1 addressLine2 city state postalCode country\n      }\n      privateDetails { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n      customValues { value field { id key name fieldType choices helpText hrOnly } }\n      tableRows { id tableKey values createdAt }\n      compensation { amount currency frequency effectiveDate payType paySchedule overtime }\n      compensationHistory { id amount currency frequency effectiveDate reason payType paySchedule overtime comment }\n      bonusTarget { percent amount }\n      statusHistory { id effectiveDate status comment }\n      notes { id body authorName createdAt }\n      employmentHistory {\n        id effectiveDate changeType reason\n        jobTitle { name }\n        department { name }\n        location { name }\n        grade { name }\n        manager { fullName }\n        employmentType\n      }\n    }\n  }\n": typeof types.EmployeeProfileDocument,
    "\n  query ProfileLayout {\n    profileLayout {\n      tabs {\n        key name builtin\n        sections { key title icon items { id kind key label fields } }\n      }\n      library { id kind key label fields }\n    }\n    customTables(includeInactive: true) { id key name hrOnly pay standard isActive columns { key name type choices } }\n    customFields(includeInactive: true) { id key }\n  }\n": typeof types.ProfileLayoutDocument,
    "\n  mutation SaveProfileLayout($config: JSON!) {\n    saveProfileLayout(config: $config) { layout { tabs { key } } errors { field message } }\n  }\n": typeof types.SaveProfileLayoutDocument,
    "\n  query ReportCatalog {\n    reportCatalog { key title description usesRange groupings }\n  }\n": typeof types.ReportCatalogDocument,
    "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n      mfaEnabled mfaSetupRequired recoveryCodesLeft\n    }\n    tenant { name slug primaryColor country currency logoUrl }\n  }\n": typeof types.MeDocument,
};
const documents: Documents = {
    "\n  mutation ChangePassword($current: String!, $new: String!) {\n    changePassword(current: $current, new: $new) { ok errors { field message } }\n  }\n": types.ChangePasswordDocument,
    "\n  mutation StartMfaSetup { startMfaSetup { secret uri qrSvg } }\n": types.StartMfaSetupDocument,
    "\n  mutation ConfirmMfaSetup($code: String!) {\n    confirmMfaSetup(code: $code) { codes errors { field message } }\n  }\n": types.ConfirmMfaSetupDocument,
    "\n  mutation DisableMfa($password: String!) {\n    disableMfa(password: $password) { ok errors { field message } }\n  }\n": types.DisableMfaDocument,
    "\n  mutation NewRecoveryCodes($code: String!) {\n    newRecoveryCodes(code: $code) { codes errors { field message } }\n  }\n": types.NewRecoveryCodesDocument,
    "\n  query OrgChart {\n    orgChart { id fullName jobTitle departmentId department location workEmail managerId directReportCount }\n  }\n": types.OrgChartDocument,
    "\n  query DocumentsAdmin($within: Int!) {\n    expiringDocuments(withinDays: $within) {\n      id title expiresOn\n      employee { id fullName }\n      category { id name }\n    }\n    documentCategories(includeInactive: true) { id name employeeCanView managerCanView requiresExpiry isActive }\n  }\n": types.DocumentsAdminDocument,
    "\n  mutation SaveDocumentCategory($input: SaveDocumentCategoryInput!) {\n    saveDocumentCategory(input: $input) { category { id } errors { field message } }\n  }\n": types.SaveDocumentCategoryDocument,
    "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) { employee { id } errors { field message } }\n  }\n": types.ArchiveEmployeeDocument,
    "\n  mutation SendEmployeePasswordReset($employeeId: ID!) {\n    sendEmployeePasswordReset(employeeId: $employeeId)\n  }\n": types.SendEmployeePasswordResetDocument,
    "\n  query EmployeeAccess($id: ID!) {\n    employee(id: $id) { id access { email roles isActive invitePending } }\n  }\n": types.EmployeeAccessDocument,
    "\n  mutation RemoveEmployeePhoto($employeeId: ID!) {\n    removeEmployeePhoto(employeeId: $employeeId)\n  }\n": types.RemoveEmployeePhotoDocument,
    "\n  query CustomFieldsAdmin {\n    customFields(includeInactive: true) { id name key fieldType choices helpText hrOnly position isActive }\n  }\n": types.CustomFieldsAdminDocument,
    "\n  mutation SaveCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id } errors { field message } }\n  }\n": types.SaveCustomFieldDocument,
    "\n  mutation HireEmployee($input: HireEmployeeInput!) {\n    hireEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.HireEmployeeDocument,
    "\n  query Employees($filter: EmployeeFilter, $first: Int, $after: String) {\n    employees(filter: $filter, first: $first, after: $after) {\n      totalCount\n      pageInfo { hasNextPage endCursor }\n      nodes {\n        id\n        employeeNumber\n        fullName\n        status\n        hireDate\n        jobTitle { name }\n        department { name }\n        location { name }\n      }\n    }\n    departments { id name }\n  }\n": types.EmployeesDocument,
    "\n  query PendingChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide lines { field label current requested } }\n  }\n": types.PendingChangesDocument,
    "\n  mutation DecideChangeRequest($id: ID!, $approve: Boolean!, $note: String) {\n    decideChangeRequest(id: $id, approve: $approve, note: $note) { request { id status } errors { field message } }\n  }\n": types.DecideChangeRequestDocument,
    "\n  query HomeExpiring {\n    expiringDocuments(withinDays: 30) { id }\n  }\n": types.HomeExpiringDocument,
    "\n  query HomeMyPhoto($id: ID!) {\n    employee(id: $id) { id photoUrl }\n  }\n": types.HomeMyPhotoDocument,
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
    "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name description isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": types.OrganizationDocument,
    "\n  mutation SaveLegalEntity($input: SaveLegalEntityInput!) {\n    saveLegalEntity(input: $input) { legalEntity { id } errors { field message } }\n  }\n": types.SaveLegalEntityDocument,
    "\n  mutation SaveLocation($input: SaveLocationInput!) {\n    saveLocation(input: $input) { location { id } errors { field message } }\n  }\n": types.SaveLocationDocument,
    "\n  mutation SaveDepartment($input: SaveDepartmentInput!) {\n    saveDepartment(input: $input) { department { id } errors { field message } }\n  }\n": types.SaveDepartmentDocument,
    "\n  mutation SaveJobTitle($input: SaveJobTitleInput!) {\n    saveJobTitle(input: $input) { jobTitle { id } errors { field message } }\n  }\n": types.SaveJobTitleDocument,
    "\n  mutation SaveGrade($input: SaveGradeInput!) {\n    saveGrade(input: $input) { grade { id } errors { field message } }\n  }\n": types.SaveGradeDocument,
    "\n  query RunReport($key: String!, $params: ReportParams) {\n    runReport(key: $key, params: $params) {\n      title chart note start end rows\n      columns { key label kind }\n      summary { label value }\n    }\n  }\n": types.RunReportDocument,
    "\n  query ReportFilterOptions {\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n  }\n": types.ReportFilterOptionsDocument,
    "\n  query BenefitPlansSetup {\n    benefitPlans(includeInactive: true) {\n      id name kind provider description employeeRate employerRate basis statutory isActive enrolledCount\n    }\n  }\n": types.BenefitPlansSetupDocument,
    "\n  mutation SaveBenefitPlan($input: SaveBenefitPlanInput!) {\n    saveBenefitPlan(input: $input) { plan { id } errors { field message } }\n  }\n": types.SaveBenefitPlanDocument,
    "\n  query TaskTemplates {\n    taskTemplates { id kind title description category assignee dueOffset isActive }\n  }\n": types.TaskTemplatesDocument,
    "\n  mutation SaveTaskTemplate($input: SaveTaskTemplateInput!) {\n    saveTaskTemplate(input: $input) { template { id } errors { field message } }\n  }\n": types.SaveTaskTemplateDocument,
    "\n  query CompanySettings {\n    companySettings {\n      name country currency timezone primaryColor logoUrl requireAdminMfa sessionTimeoutMinutes ipAllowlist yourIp\n    }\n  }\n": types.CompanySettingsDocument,
    "\n  mutation UpdateCompanySettings($input: CompanySettingsInput!) {\n    updateCompanySettings(input: $input) { settings { name } errors { field message } }\n  }\n": types.UpdateCompanySettingsDocument,
    "\n  mutation RemoveCompanyLogo { removeCompanyLogo }\n": types.RemoveCompanyLogoDocument,
    "\n  query UsersAdmin {\n    members {\n      id email firstName lastName fullName isActive invitePending lastLogin\n      roles { code name scope }\n      employee { id name }\n      legalEntities { id name }\n      locations { id name }\n      departments { id name }\n    }\n    roles { id code name scope permissions }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n    employees(first: 100, filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE, CANDIDATE] }) { nodes { id fullName } }\n  }\n": types.UsersAdminDocument,
    "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) { member { id } errors { field message } }\n  }\n": types.InviteMemberDocument,
    "\n  mutation UpdateMember($input: UpdateMemberInput!) {\n    updateMember(input: $input) { member { id } errors { field message } }\n  }\n": types.UpdateMemberDocument,
    "\n  mutation CorrectInvite($input: CorrectInviteInput!) {\n    correctInvite(input: $input) { member { id } errors { field message } }\n  }\n": types.CorrectInviteDocument,
    "\n  mutation CancelInvite($id: ID!) {\n    cancelInvite(id: $id) { errors { field message } }\n  }\n": types.CancelInviteDocument,
    "\n  mutation ResendInvite($id: ID!) {\n    resendInvite(id: $id)\n  }\n": types.ResendInviteDocument,
    "\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(email: $email)\n  }\n": types.RequestPasswordResetDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      mfaRequired\n      me { permissions }\n      errors { field message }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation VerifyMfa($code: String!) {\n    verifyMfa(code: $code) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n": types.VerifyMfaDocument,
    "\n  query PasswordLink($uid: String!, $token: String!) {\n    passwordLink(uid: $uid, token: $token)\n  }\n": types.PasswordLinkDocument,
    "\n  mutation SetPassword($input: SetPasswordInput!) {\n    setPassword(input: $input) { ok errors { field message } }\n  }\n": types.SetPasswordDocument,
    "\n  mutation RedeemWelcome($token: String!) {\n    redeemWelcome(token: $token) { me { mfaSetupRequired } errors { message } }\n  }\n": types.RedeemWelcomeDocument,
    "\n  query SlugCheck($slug: String!) {\n    slugCheck(slug: $slug)\n  }\n": types.SlugCheckDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) { url errors { field message } }\n  }\n": types.SignUpDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query WaitingApprovals {\n    leaveApprovals { id }\n  }\n": types.WaitingApprovalsDocument,
    "\n  query ChangesWaiting {\n    pendingChangeRequests { id }\n  }\n": types.ChangesWaitingDocument,
    "\n  query NotificationList($first: Int!, $after: String) {\n    unreadNotificationCount\n    notifications(first: $first, after: $after) {\n      nodes { id kind title body link read createdAt }\n      pageInfo { hasNextPage endCursor }\n    }\n  }\n": types.NotificationListDocument,
    "\n  query UnreadNotificationCount {\n    unreadNotificationCount\n  }\n": types.UnreadNotificationCountDocument,
    "\n  mutation MarkNotificationsRead($ids: [ID!]) {\n    markNotificationsRead(ids: $ids)\n  }\n": types.MarkNotificationsReadDocument,
    "\n  mutation EmailMyCompanies($email: String!) {\n    emailMyCompanies(email: $email)\n  }\n": types.EmailMyCompaniesDocument,
    "\n  query EmployeeDocuments($employeeId: ID!) {\n    employeeDocuments(employeeId: $employeeId) {\n      id title originalName contentType size expiresOn notes uploadedBy createdAt\n      category { id name requiresExpiry employeeCanView managerCanView }\n    }\n  }\n": types.EmployeeDocumentsDocument,
    "\n  query DocumentCategoryOptions {\n    documentCategories { id name requiresExpiry employeeCanView managerCanView isActive }\n  }\n": types.DocumentCategoryOptionsDocument,
    "\n  mutation DocumentDownloadUrl($id: ID!) {\n    documentDownloadUrl(id: $id)\n  }\n": types.DocumentDownloadUrlDocument,
    "\n  mutation UpdateDocument($input: UpdateDocumentInput!) {\n    updateDocument(input: $input) { document { id } errors { field message } }\n  }\n": types.UpdateDocumentDocument,
    "\n  mutation RemoveDocument($id: ID!) {\n    removeDocument(id: $id)\n  }\n": types.RemoveDocumentDocument,
    "\n  mutation UpdateEmployee($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.UpdateEmployeeDocument,
    "\n  query JobOptions {\n    legalEntities { id name isActive }\n    departments { id name isActive legalEntity { id } }\n    locations { id name isActive legalEntity { id } }\n    jobTitles { id name isActive }\n    grades { id name isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n": types.JobOptionsDocument,
    "\n  mutation ChangeEmployeeJob($input: ChangeJobInput!) {\n    changeEmployeeJob(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeJobDocument,
    "\n  mutation ChangeEmployeeCompensation($input: ChangeCompensationInput!) {\n    changeEmployeeCompensation(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeCompensationDocument,
    "\n  mutation ChangeEmployeeStatus($input: ChangeStatusInput!) {\n    changeEmployeeStatus(input: $input) {\n      employee { id }\n      errors { field message }\n    }\n  }\n": types.ChangeEmployeeStatusDocument,
    "\n  mutation SaveEmergencyContact($input: EmergencyContactInput!) {\n    saveEmergencyContact(input: $input) { contact { id } errors { field message } }\n  }\n": types.SaveEmergencyContactDocument,
    "\n  mutation DeleteEmergencyContact($id: ID!) {\n    deleteEmergencyContact(id: $id)\n  }\n": types.DeleteEmergencyContactDocument,
    "\n  mutation RevealPrivateDetails($employeeId: ID!) {\n    revealPrivateDetails(employeeId: $employeeId) { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n  }\n": types.RevealPrivateDetailsDocument,
    "\n  mutation SavePrivateDetails($input: PrivateDetailsInput!) {\n    savePrivateDetails(input: $input) { details { masked } errors { field message } }\n  }\n": types.SavePrivateDetailsDocument,
    "\n  mutation SetEmployeeCustomValues($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n": types.SetEmployeeCustomValuesDocument,
    "\n  query MyChangeRequests {\n    myChangeRequests { id status note createdAt decidedAt decidedBy lines { field label current requested } }\n  }\n": types.MyChangeRequestsDocument,
    "\n  mutation UpdateMyDetails($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n": types.UpdateMyDetailsDocument,
    "\n  mutation CancelChangeRequest($id: ID!) {\n    cancelChangeRequest(id: $id) { request { id status } errors { field message } }\n  }\n": types.CancelChangeRequestDocument,
    "\n  query HomeData {\n    home {\n      celebrations { kind date years person { id fullName jobTitle photoUrl } }\n      newHires { hireDate person { id fullName jobTitle photoUrl } }\n      myStuff { trainings certifications certificationsExpiring benefits openTasks }\n      directReports { notes outToday person { id fullName jobTitle photoUrl } }\n      insights {\n        headcount { month value }\n        leavers { month value }\n        turnoverRate\n        byLocation { label value }\n        pendingUrgent pendingOther withoutPayRaise\n        onboarding { inProgress withOverdue startingSoon }\n      }\n    }\n    announcements(limit: 10) { id title body authorName publishedAt pinned }\n    companyLinks { id group label url }\n    homeLayout { key hidden }\n  }\n": types.HomeDataDocument,
    "\n  query HomeApprovals {\n    leaveApprovals { id startDate endDate days createdAt canDecide employee { id fullName } leaveType { name color } }\n  }\n": types.HomeApprovalsDocument,
    "\n  query HomeChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide }\n  }\n": types.HomeChangesDocument,
    "\n  mutation HomeDecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) { request { id status } errors { field message } }\n  }\n": types.HomeDecideLeaveDocument,
    "\n  mutation SaveAnnouncement($input: AnnouncementInput!) {\n    saveAnnouncement(input: $input) { announcement { id } errors { field message } }\n  }\n": types.SaveAnnouncementDocument,
    "\n  mutation DeleteAnnouncement($id: ID!) {\n    deleteAnnouncement(id: $id)\n  }\n": types.DeleteAnnouncementDocument,
    "\n  query HomeWhosOut($day: Date!) {\n    leaveCalendar(start: $day, end: $day) { absences { requestId status employee { id fullName } leaveType { name } } }\n  }\n": types.HomeWhosOutDocument,
    "\n  mutation SaveCompanyLinks($links: [CompanyLinkInput!]!) {\n    saveCompanyLinks(links: $links) { links { id } errors { field message } }\n  }\n": types.SaveCompanyLinksDocument,
    "\n  query HomeTimeOffUsed($leaveTypeId: ID!) {\n    timeOffUsed(leaveTypeId: $leaveTypeId) { month value }\n  }\n": types.HomeTimeOffUsedDocument,
    "\n  query HomeLeaveTypes {\n    leaveTypes { id name }\n  }\n": types.HomeLeaveTypesDocument,
    "\n  mutation SaveHomeLayout($widgets: JSON!) {\n    saveHomeLayout(widgets: $widgets) { key hidden }\n  }\n": types.SaveHomeLayoutDocument,
    "\n  query EmployeeLeave($employeeId: ID) {\n    employeeLeave(employeeId: $employeeId) {\n      employee { id fullName }\n      balances {\n        leaveType { id name color tracksBalance allowHalfDays isPaid }\n        policyName entitlement balance pending available takenThisYear\n      }\n      requests {\n        id startDate endDate halfDay days reason status createdAt canCancel canDecide\n        leaveType { id name color }\n        approvals { level status note overridden actedBy actedAt approver { id fullName } }\n      }\n      ledger { id date kind amount reason leaveType { name } }\n    }\n  }\n": types.EmployeeLeaveDocument,
    "\n  mutation CancelLeave($id: ID!) {\n    cancelLeave(id: $id) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": types.CancelLeaveDocument,
    "\n  query LeaveQuote($leaveTypeId: ID!, $startDate: Date!, $endDate: Date!, $halfDay: Boolean!, $employeeId: ID) {\n    leaveQuote(leaveTypeId: $leaveTypeId, startDate: $startDate, endDate: $endDate, halfDay: $halfDay, employeeId: $employeeId) {\n      days available availableAfter\n      errors { field message }\n    }\n  }\n": types.LeaveQuoteDocument,
    "\n  mutation RequestLeave($input: RequestLeaveInput!) {\n    requestLeave(input: $input) {\n      request { id status }\n      errors { field message }\n    }\n  }\n": types.RequestLeaveDocument,
    "\n  mutation AdjustLeaveBalance($input: AdjustLeaveInput!) {\n    adjustLeaveBalance(input: $input) {\n      balance { balance }\n      errors { field message }\n    }\n  }\n": types.AdjustLeaveBalanceDocument,
    "\n  query EmployeeBenefits($employeeId: ID!) {\n    employeeBenefits(employeeId: $employeeId) {\n      id status startDate endDate memberNumber coverage dependants note\n      plan { id name kind provider employeeRate employerRate basis statutory }\n    }\n    benefitPlans { id name kind provider employeeRate employerRate basis statutory isActive }\n  }\n": types.EmployeeBenefitsDocument,
    "\n  mutation SaveBenefitEnrollment($input: SaveEnrollmentInput!) {\n    saveBenefitEnrollment(input: $input) { enrollment { id } errors { field message } }\n  }\n": types.SaveBenefitEnrollmentDocument,
    "\n  mutation DeleteBenefitEnrollment($id: ID!) {\n    deleteBenefitEnrollment(id: $id)\n  }\n": types.DeleteBenefitEnrollmentDocument,
    "\n  mutation SetBonusTarget($input: BonusTargetInput!) {\n    setBonusTarget(input: $input) { employee { id } errors { field message } }\n  }\n": types.SetBonusTargetDocument,
    "\n  mutation AddEmployeeNote($employeeId: ID!, $body: String!) {\n    addEmployeeNote(employeeId: $employeeId, body: $body) { note { id } errors { field message } }\n  }\n": types.AddEmployeeNoteDocument,
    "\n  mutation DeleteEmployeeNote($id: ID!) {\n    deleteEmployeeNote(id: $id)\n  }\n": types.DeleteEmployeeNoteDocument,
    "\n  query EmployeeChecklist($employeeId: ID!, $kind: ChecklistKind!) {\n    checklist(employeeId: $employeeId, kind: $kind) {\n      startDate\n      tasks { id title description category assignee dueDate completedAt completedByName canComplete }\n    }\n  }\n": types.EmployeeChecklistDocument,
    "\n  mutation StartChecklist($employeeId: ID!, $kind: ChecklistKind!, $startDate: Date) {\n    startChecklist(employeeId: $employeeId, kind: $kind, startDate: $startDate) { tasks { id } errors { field message } }\n  }\n": types.StartChecklistDocument,
    "\n  mutation SetTaskDone($id: ID!, $done: Boolean!) {\n    setTaskDone(id: $id, done: $done) { task { id completedAt } errors { field message } }\n  }\n": types.SetTaskDoneDocument,
    "\n  mutation AddEmployeeTask($input: AddTaskInput!) {\n    addEmployeeTask(input: $input) { task { id } errors { field message } }\n  }\n": types.AddEmployeeTaskDocument,
    "\n  mutation DeleteEmployeeTask($id: ID!) {\n    deleteEmployeeTask(id: $id)\n  }\n": types.DeleteEmployeeTaskDocument,
    "\n  mutation SaveLayoutCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id key name } errors { field message } }\n  }\n": types.SaveLayoutCustomFieldDocument,
    "\n  mutation SaveLayoutCustomTable($input: SaveCustomTableInput!) {\n    saveCustomTable(input: $input) { table { id key name } errors { field message } }\n  }\n": types.SaveLayoutCustomTableDocument,
    "\n  mutation UpdateEmployeeFields($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) { employee { id } errors { field message } }\n  }\n": types.UpdateEmployeeFieldsDocument,
    "\n  mutation UpdateMyFields($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n": types.UpdateMyFieldsDocument,
    "\n  mutation SetCustomFields($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n": types.SetCustomFieldsDocument,
    "\n  query LeaveHistory($employeeId: ID, $leaveTypeId: ID!, $year: Int) {\n    leaveHistory(employeeId: $employeeId, leaveTypeId: $leaveTypeId, year: $year) {\n      years\n      rows { id date kind description detail used earned balance }\n    }\n  }\n": types.LeaveHistoryDocument,
    "\n  mutation SaveTableRow($input: TableRowInput!) {\n    saveTableRow(input: $input) { row { id } errors { field message } }\n  }\n": types.SaveTableRowDocument,
    "\n  mutation DeleteTableRow($id: ID!) {\n    deleteTableRow(id: $id)\n  }\n": types.DeleteTableRowDocument,
    "\n  query EmployeeProfile($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      workPhone\n      workPhoneExt\n      dateOfBirth\n      gender\n      maritalStatus\n      personal { nationality linkedinUrl twitter facebook homePhone addressLine1 addressLine2 city state postalCode country }\n      photoUrl\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name city country timezone }\n      jobTitle { id name description }\n      grade { id name }\n      manager { id fullName jobTitle { name } photoUrl }\n      directReports { id fullName jobTitle { name } }\n      emergencyContacts {\n        id name relationship phone workPhone workPhoneExt homePhone email isPrimary\n        addressLine1 addressLine2 city state postalCode country\n      }\n      privateDetails { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n      customValues { value field { id key name fieldType choices helpText hrOnly } }\n      tableRows { id tableKey values createdAt }\n      compensation { amount currency frequency effectiveDate payType paySchedule overtime }\n      compensationHistory { id amount currency frequency effectiveDate reason payType paySchedule overtime comment }\n      bonusTarget { percent amount }\n      statusHistory { id effectiveDate status comment }\n      notes { id body authorName createdAt }\n      employmentHistory {\n        id effectiveDate changeType reason\n        jobTitle { name }\n        department { name }\n        location { name }\n        grade { name }\n        manager { fullName }\n        employmentType\n      }\n    }\n  }\n": types.EmployeeProfileDocument,
    "\n  query ProfileLayout {\n    profileLayout {\n      tabs {\n        key name builtin\n        sections { key title icon items { id kind key label fields } }\n      }\n      library { id kind key label fields }\n    }\n    customTables(includeInactive: true) { id key name hrOnly pay standard isActive columns { key name type choices } }\n    customFields(includeInactive: true) { id key }\n  }\n": types.ProfileLayoutDocument,
    "\n  mutation SaveProfileLayout($config: JSON!) {\n    saveProfileLayout(config: $config) { layout { tabs { key } } errors { field message } }\n  }\n": types.SaveProfileLayoutDocument,
    "\n  query ReportCatalog {\n    reportCatalog { key title description usesRange groupings }\n  }\n": types.ReportCatalogDocument,
    "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n      mfaEnabled mfaSetupRequired recoveryCodesLeft\n    }\n    tenant { name slug primaryColor country currency logoUrl }\n  }\n": types.MeDocument,
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
export function graphql(source: "\n  mutation ChangePassword($current: String!, $new: String!) {\n    changePassword(current: $current, new: $new) { ok errors { field message } }\n  }\n"): (typeof documents)["\n  mutation ChangePassword($current: String!, $new: String!) {\n    changePassword(current: $current, new: $new) { ok errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartMfaSetup { startMfaSetup { secret uri qrSvg } }\n"): (typeof documents)["\n  mutation StartMfaSetup { startMfaSetup { secret uri qrSvg } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmMfaSetup($code: String!) {\n    confirmMfaSetup(code: $code) { codes errors { field message } }\n  }\n"): (typeof documents)["\n  mutation ConfirmMfaSetup($code: String!) {\n    confirmMfaSetup(code: $code) { codes errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DisableMfa($password: String!) {\n    disableMfa(password: $password) { ok errors { field message } }\n  }\n"): (typeof documents)["\n  mutation DisableMfa($password: String!) {\n    disableMfa(password: $password) { ok errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation NewRecoveryCodes($code: String!) {\n    newRecoveryCodes(code: $code) { codes errors { field message } }\n  }\n"): (typeof documents)["\n  mutation NewRecoveryCodes($code: String!) {\n    newRecoveryCodes(code: $code) { codes errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrgChart {\n    orgChart { id fullName jobTitle departmentId department location workEmail managerId directReportCount }\n  }\n"): (typeof documents)["\n  query OrgChart {\n    orgChart { id fullName jobTitle departmentId department location workEmail managerId directReportCount }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DocumentsAdmin($within: Int!) {\n    expiringDocuments(withinDays: $within) {\n      id title expiresOn\n      employee { id fullName }\n      category { id name }\n    }\n    documentCategories(includeInactive: true) { id name employeeCanView managerCanView requiresExpiry isActive }\n  }\n"): (typeof documents)["\n  query DocumentsAdmin($within: Int!) {\n    expiringDocuments(withinDays: $within) {\n      id title expiresOn\n      employee { id fullName }\n      category { id name }\n    }\n    documentCategories(includeInactive: true) { id name employeeCanView managerCanView requiresExpiry isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveDocumentCategory($input: SaveDocumentCategoryInput!) {\n    saveDocumentCategory(input: $input) { category { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveDocumentCategory($input: SaveDocumentCategoryInput!) {\n    saveDocumentCategory(input: $input) { category { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) { employee { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation ArchiveEmployee($id: ID!) {\n    archiveEmployee(id: $id) { employee { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendEmployeePasswordReset($employeeId: ID!) {\n    sendEmployeePasswordReset(employeeId: $employeeId)\n  }\n"): (typeof documents)["\n  mutation SendEmployeePasswordReset($employeeId: ID!) {\n    sendEmployeePasswordReset(employeeId: $employeeId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EmployeeAccess($id: ID!) {\n    employee(id: $id) { id access { email roles isActive invitePending } }\n  }\n"): (typeof documents)["\n  query EmployeeAccess($id: ID!) {\n    employee(id: $id) { id access { email roles isActive invitePending } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveEmployeePhoto($employeeId: ID!) {\n    removeEmployeePhoto(employeeId: $employeeId)\n  }\n"): (typeof documents)["\n  mutation RemoveEmployeePhoto($employeeId: ID!) {\n    removeEmployeePhoto(employeeId: $employeeId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomFieldsAdmin {\n    customFields(includeInactive: true) { id name key fieldType choices helpText hrOnly position isActive }\n  }\n"): (typeof documents)["\n  query CustomFieldsAdmin {\n    customFields(includeInactive: true) { id name key fieldType choices helpText hrOnly position isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id } errors { field message } }\n  }\n"];
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
export function graphql(source: "\n  query PendingChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide lines { field label current requested } }\n  }\n"): (typeof documents)["\n  query PendingChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide lines { field label current requested } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DecideChangeRequest($id: ID!, $approve: Boolean!, $note: String) {\n    decideChangeRequest(id: $id, approve: $approve, note: $note) { request { id status } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation DecideChangeRequest($id: ID!, $approve: Boolean!, $note: String) {\n    decideChangeRequest(id: $id, approve: $approve, note: $note) { request { id status } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeExpiring {\n    expiringDocuments(withinDays: 30) { id }\n  }\n"): (typeof documents)["\n  query HomeExpiring {\n    expiringDocuments(withinDays: 30) { id }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeMyPhoto($id: ID!) {\n    employee(id: $id) { id photoUrl }\n  }\n"): (typeof documents)["\n  query HomeMyPhoto($id: ID!) {\n    employee(id: $id) { id photoUrl }\n  }\n"];
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
export function graphql(source: "\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name description isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"): (typeof documents)["\n  query Organization {\n    legalEntities { id name registrationNumber country currency isActive }\n    locations { id name address city country timezone isActive legalEntity { id name } }\n    departments { id name code isActive legalEntity { id name } parent { id name } head { id fullName } }\n    jobTitles { id name description isActive }\n    grades { id name rank isActive }\n    employees(filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE] }, first: 100) { nodes { id fullName } }\n  }\n"];
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
export function graphql(source: "\n  query RunReport($key: String!, $params: ReportParams) {\n    runReport(key: $key, params: $params) {\n      title chart note start end rows\n      columns { key label kind }\n      summary { label value }\n    }\n  }\n"): (typeof documents)["\n  query RunReport($key: String!, $params: ReportParams) {\n    runReport(key: $key, params: $params) {\n      title chart note start end rows\n      columns { key label kind }\n      summary { label value }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ReportFilterOptions {\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n  }\n"): (typeof documents)["\n  query ReportFilterOptions {\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BenefitPlansSetup {\n    benefitPlans(includeInactive: true) {\n      id name kind provider description employeeRate employerRate basis statutory isActive enrolledCount\n    }\n  }\n"): (typeof documents)["\n  query BenefitPlansSetup {\n    benefitPlans(includeInactive: true) {\n      id name kind provider description employeeRate employerRate basis statutory isActive enrolledCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveBenefitPlan($input: SaveBenefitPlanInput!) {\n    saveBenefitPlan(input: $input) { plan { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveBenefitPlan($input: SaveBenefitPlanInput!) {\n    saveBenefitPlan(input: $input) { plan { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TaskTemplates {\n    taskTemplates { id kind title description category assignee dueOffset isActive }\n  }\n"): (typeof documents)["\n  query TaskTemplates {\n    taskTemplates { id kind title description category assignee dueOffset isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveTaskTemplate($input: SaveTaskTemplateInput!) {\n    saveTaskTemplate(input: $input) { template { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveTaskTemplate($input: SaveTaskTemplateInput!) {\n    saveTaskTemplate(input: $input) { template { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanySettings {\n    companySettings {\n      name country currency timezone primaryColor logoUrl requireAdminMfa sessionTimeoutMinutes ipAllowlist yourIp\n    }\n  }\n"): (typeof documents)["\n  query CompanySettings {\n    companySettings {\n      name country currency timezone primaryColor logoUrl requireAdminMfa sessionTimeoutMinutes ipAllowlist yourIp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompanySettings($input: CompanySettingsInput!) {\n    updateCompanySettings(input: $input) { settings { name } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateCompanySettings($input: CompanySettingsInput!) {\n    updateCompanySettings(input: $input) { settings { name } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCompanyLogo { removeCompanyLogo }\n"): (typeof documents)["\n  mutation RemoveCompanyLogo { removeCompanyLogo }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersAdmin {\n    members {\n      id email firstName lastName fullName isActive invitePending lastLogin\n      roles { code name scope }\n      employee { id name }\n      legalEntities { id name }\n      locations { id name }\n      departments { id name }\n    }\n    roles { id code name scope permissions }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n    employees(first: 100, filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE, CANDIDATE] }) { nodes { id fullName } }\n  }\n"): (typeof documents)["\n  query UsersAdmin {\n    members {\n      id email firstName lastName fullName isActive invitePending lastLogin\n      roles { code name scope }\n      employee { id name }\n      legalEntities { id name }\n      locations { id name }\n      departments { id name }\n    }\n    roles { id code name scope permissions }\n    legalEntities { id name isActive }\n    locations { id name isActive }\n    departments { id name isActive }\n    employees(first: 100, filter: { statuses: [ACTIVE, PROBATION, ON_LEAVE, CANDIDATE] }) { nodes { id fullName } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) { member { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation InviteMember($input: InviteMemberInput!) {\n    inviteMember(input: $input) { member { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMember($input: UpdateMemberInput!) {\n    updateMember(input: $input) { member { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateMember($input: UpdateMemberInput!) {\n    updateMember(input: $input) { member { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CorrectInvite($input: CorrectInviteInput!) {\n    correctInvite(input: $input) { member { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation CorrectInvite($input: CorrectInviteInput!) {\n    correctInvite(input: $input) { member { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelInvite($id: ID!) {\n    cancelInvite(id: $id) { errors { field message } }\n  }\n"): (typeof documents)["\n  mutation CancelInvite($id: ID!) {\n    cancelInvite(id: $id) { errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResendInvite($id: ID!) {\n    resendInvite(id: $id)\n  }\n"): (typeof documents)["\n  mutation ResendInvite($id: ID!) {\n    resendInvite(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(email: $email)\n  }\n"): (typeof documents)["\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      mfaRequired\n      me { permissions }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      mfaRequired\n      me { permissions }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyMfa($code: String!) {\n    verifyMfa(code: $code) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyMfa($code: String!) {\n    verifyMfa(code: $code) {\n      me { permissions }\n      errors { field message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PasswordLink($uid: String!, $token: String!) {\n    passwordLink(uid: $uid, token: $token)\n  }\n"): (typeof documents)["\n  query PasswordLink($uid: String!, $token: String!) {\n    passwordLink(uid: $uid, token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetPassword($input: SetPasswordInput!) {\n    setPassword(input: $input) { ok errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SetPassword($input: SetPasswordInput!) {\n    setPassword(input: $input) { ok errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RedeemWelcome($token: String!) {\n    redeemWelcome(token: $token) { me { mfaSetupRequired } errors { message } }\n  }\n"): (typeof documents)["\n  mutation RedeemWelcome($token: String!) {\n    redeemWelcome(token: $token) { me { mfaSetupRequired } errors { message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SlugCheck($slug: String!) {\n    slugCheck(slug: $slug)\n  }\n"): (typeof documents)["\n  query SlugCheck($slug: String!) {\n    slugCheck(slug: $slug)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) { url errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) { url errors { field message } }\n  }\n"];
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
export function graphql(source: "\n  query ChangesWaiting {\n    pendingChangeRequests { id }\n  }\n"): (typeof documents)["\n  query ChangesWaiting {\n    pendingChangeRequests { id }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationList($first: Int!, $after: String) {\n    unreadNotificationCount\n    notifications(first: $first, after: $after) {\n      nodes { id kind title body link read createdAt }\n      pageInfo { hasNextPage endCursor }\n    }\n  }\n"): (typeof documents)["\n  query NotificationList($first: Int!, $after: String) {\n    unreadNotificationCount\n    notifications(first: $first, after: $after) {\n      nodes { id kind title body link read createdAt }\n      pageInfo { hasNextPage endCursor }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UnreadNotificationCount {\n    unreadNotificationCount\n  }\n"): (typeof documents)["\n  query UnreadNotificationCount {\n    unreadNotificationCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkNotificationsRead($ids: [ID!]) {\n    markNotificationsRead(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation MarkNotificationsRead($ids: [ID!]) {\n    markNotificationsRead(ids: $ids)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EmailMyCompanies($email: String!) {\n    emailMyCompanies(email: $email)\n  }\n"): (typeof documents)["\n  mutation EmailMyCompanies($email: String!) {\n    emailMyCompanies(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EmployeeDocuments($employeeId: ID!) {\n    employeeDocuments(employeeId: $employeeId) {\n      id title originalName contentType size expiresOn notes uploadedBy createdAt\n      category { id name requiresExpiry employeeCanView managerCanView }\n    }\n  }\n"): (typeof documents)["\n  query EmployeeDocuments($employeeId: ID!) {\n    employeeDocuments(employeeId: $employeeId) {\n      id title originalName contentType size expiresOn notes uploadedBy createdAt\n      category { id name requiresExpiry employeeCanView managerCanView }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DocumentCategoryOptions {\n    documentCategories { id name requiresExpiry employeeCanView managerCanView isActive }\n  }\n"): (typeof documents)["\n  query DocumentCategoryOptions {\n    documentCategories { id name requiresExpiry employeeCanView managerCanView isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DocumentDownloadUrl($id: ID!) {\n    documentDownloadUrl(id: $id)\n  }\n"): (typeof documents)["\n  mutation DocumentDownloadUrl($id: ID!) {\n    documentDownloadUrl(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDocument($input: UpdateDocumentInput!) {\n    updateDocument(input: $input) { document { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateDocument($input: UpdateDocumentInput!) {\n    updateDocument(input: $input) { document { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveDocument($id: ID!) {\n    removeDocument(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveDocument($id: ID!) {\n    removeDocument(id: $id)\n  }\n"];
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
export function graphql(source: "\n  mutation SaveEmergencyContact($input: EmergencyContactInput!) {\n    saveEmergencyContact(input: $input) { contact { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveEmergencyContact($input: EmergencyContactInput!) {\n    saveEmergencyContact(input: $input) { contact { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEmergencyContact($id: ID!) {\n    deleteEmergencyContact(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteEmergencyContact($id: ID!) {\n    deleteEmergencyContact(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevealPrivateDetails($employeeId: ID!) {\n    revealPrivateDetails(employeeId: $employeeId) { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n  }\n"): (typeof documents)["\n  mutation RevealPrivateDetails($employeeId: ID!) {\n    revealPrivateDetails(employeeId: $employeeId) { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SavePrivateDetails($input: PrivateDetailsInput!) {\n    savePrivateDetails(input: $input) { details { masked } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SavePrivateDetails($input: PrivateDetailsInput!) {\n    savePrivateDetails(input: $input) { details { masked } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetEmployeeCustomValues($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SetEmployeeCustomValues($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyChangeRequests {\n    myChangeRequests { id status note createdAt decidedAt decidedBy lines { field label current requested } }\n  }\n"): (typeof documents)["\n  query MyChangeRequests {\n    myChangeRequests { id status note createdAt decidedAt decidedBy lines { field label current requested } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyDetails($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateMyDetails($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelChangeRequest($id: ID!) {\n    cancelChangeRequest(id: $id) { request { id status } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation CancelChangeRequest($id: ID!) {\n    cancelChangeRequest(id: $id) { request { id status } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeData {\n    home {\n      celebrations { kind date years person { id fullName jobTitle photoUrl } }\n      newHires { hireDate person { id fullName jobTitle photoUrl } }\n      myStuff { trainings certifications certificationsExpiring benefits openTasks }\n      directReports { notes outToday person { id fullName jobTitle photoUrl } }\n      insights {\n        headcount { month value }\n        leavers { month value }\n        turnoverRate\n        byLocation { label value }\n        pendingUrgent pendingOther withoutPayRaise\n        onboarding { inProgress withOverdue startingSoon }\n      }\n    }\n    announcements(limit: 10) { id title body authorName publishedAt pinned }\n    companyLinks { id group label url }\n    homeLayout { key hidden }\n  }\n"): (typeof documents)["\n  query HomeData {\n    home {\n      celebrations { kind date years person { id fullName jobTitle photoUrl } }\n      newHires { hireDate person { id fullName jobTitle photoUrl } }\n      myStuff { trainings certifications certificationsExpiring benefits openTasks }\n      directReports { notes outToday person { id fullName jobTitle photoUrl } }\n      insights {\n        headcount { month value }\n        leavers { month value }\n        turnoverRate\n        byLocation { label value }\n        pendingUrgent pendingOther withoutPayRaise\n        onboarding { inProgress withOverdue startingSoon }\n      }\n    }\n    announcements(limit: 10) { id title body authorName publishedAt pinned }\n    companyLinks { id group label url }\n    homeLayout { key hidden }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeApprovals {\n    leaveApprovals { id startDate endDate days createdAt canDecide employee { id fullName } leaveType { name color } }\n  }\n"): (typeof documents)["\n  query HomeApprovals {\n    leaveApprovals { id startDate endDate days createdAt canDecide employee { id fullName } leaveType { name color } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide }\n  }\n"): (typeof documents)["\n  query HomeChanges {\n    pendingChangeRequests { id employeeId employeeName createdAt canDecide }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation HomeDecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) { request { id status } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation HomeDecideLeave($input: DecideLeaveInput!) {\n    decideLeave(input: $input) { request { id status } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveAnnouncement($input: AnnouncementInput!) {\n    saveAnnouncement(input: $input) { announcement { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveAnnouncement($input: AnnouncementInput!) {\n    saveAnnouncement(input: $input) { announcement { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAnnouncement($id: ID!) {\n    deleteAnnouncement(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteAnnouncement($id: ID!) {\n    deleteAnnouncement(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeWhosOut($day: Date!) {\n    leaveCalendar(start: $day, end: $day) { absences { requestId status employee { id fullName } leaveType { name } } }\n  }\n"): (typeof documents)["\n  query HomeWhosOut($day: Date!) {\n    leaveCalendar(start: $day, end: $day) { absences { requestId status employee { id fullName } leaveType { name } } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveCompanyLinks($links: [CompanyLinkInput!]!) {\n    saveCompanyLinks(links: $links) { links { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveCompanyLinks($links: [CompanyLinkInput!]!) {\n    saveCompanyLinks(links: $links) { links { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeTimeOffUsed($leaveTypeId: ID!) {\n    timeOffUsed(leaveTypeId: $leaveTypeId) { month value }\n  }\n"): (typeof documents)["\n  query HomeTimeOffUsed($leaveTypeId: ID!) {\n    timeOffUsed(leaveTypeId: $leaveTypeId) { month value }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeLeaveTypes {\n    leaveTypes { id name }\n  }\n"): (typeof documents)["\n  query HomeLeaveTypes {\n    leaveTypes { id name }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveHomeLayout($widgets: JSON!) {\n    saveHomeLayout(widgets: $widgets) { key hidden }\n  }\n"): (typeof documents)["\n  mutation SaveHomeLayout($widgets: JSON!) {\n    saveHomeLayout(widgets: $widgets) { key hidden }\n  }\n"];
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
export function graphql(source: "\n  query EmployeeBenefits($employeeId: ID!) {\n    employeeBenefits(employeeId: $employeeId) {\n      id status startDate endDate memberNumber coverage dependants note\n      plan { id name kind provider employeeRate employerRate basis statutory }\n    }\n    benefitPlans { id name kind provider employeeRate employerRate basis statutory isActive }\n  }\n"): (typeof documents)["\n  query EmployeeBenefits($employeeId: ID!) {\n    employeeBenefits(employeeId: $employeeId) {\n      id status startDate endDate memberNumber coverage dependants note\n      plan { id name kind provider employeeRate employerRate basis statutory }\n    }\n    benefitPlans { id name kind provider employeeRate employerRate basis statutory isActive }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveBenefitEnrollment($input: SaveEnrollmentInput!) {\n    saveBenefitEnrollment(input: $input) { enrollment { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveBenefitEnrollment($input: SaveEnrollmentInput!) {\n    saveBenefitEnrollment(input: $input) { enrollment { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBenefitEnrollment($id: ID!) {\n    deleteBenefitEnrollment(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteBenefitEnrollment($id: ID!) {\n    deleteBenefitEnrollment(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetBonusTarget($input: BonusTargetInput!) {\n    setBonusTarget(input: $input) { employee { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SetBonusTarget($input: BonusTargetInput!) {\n    setBonusTarget(input: $input) { employee { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddEmployeeNote($employeeId: ID!, $body: String!) {\n    addEmployeeNote(employeeId: $employeeId, body: $body) { note { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation AddEmployeeNote($employeeId: ID!, $body: String!) {\n    addEmployeeNote(employeeId: $employeeId, body: $body) { note { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEmployeeNote($id: ID!) {\n    deleteEmployeeNote(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteEmployeeNote($id: ID!) {\n    deleteEmployeeNote(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EmployeeChecklist($employeeId: ID!, $kind: ChecklistKind!) {\n    checklist(employeeId: $employeeId, kind: $kind) {\n      startDate\n      tasks { id title description category assignee dueDate completedAt completedByName canComplete }\n    }\n  }\n"): (typeof documents)["\n  query EmployeeChecklist($employeeId: ID!, $kind: ChecklistKind!) {\n    checklist(employeeId: $employeeId, kind: $kind) {\n      startDate\n      tasks { id title description category assignee dueDate completedAt completedByName canComplete }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartChecklist($employeeId: ID!, $kind: ChecklistKind!, $startDate: Date) {\n    startChecklist(employeeId: $employeeId, kind: $kind, startDate: $startDate) { tasks { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation StartChecklist($employeeId: ID!, $kind: ChecklistKind!, $startDate: Date) {\n    startChecklist(employeeId: $employeeId, kind: $kind, startDate: $startDate) { tasks { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetTaskDone($id: ID!, $done: Boolean!) {\n    setTaskDone(id: $id, done: $done) { task { id completedAt } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SetTaskDone($id: ID!, $done: Boolean!) {\n    setTaskDone(id: $id, done: $done) { task { id completedAt } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddEmployeeTask($input: AddTaskInput!) {\n    addEmployeeTask(input: $input) { task { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation AddEmployeeTask($input: AddTaskInput!) {\n    addEmployeeTask(input: $input) { task { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEmployeeTask($id: ID!) {\n    deleteEmployeeTask(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteEmployeeTask($id: ID!) {\n    deleteEmployeeTask(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLayoutCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id key name } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLayoutCustomField($input: SaveCustomFieldInput!) {\n    saveCustomField(input: $input) { field { id key name } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveLayoutCustomTable($input: SaveCustomTableInput!) {\n    saveCustomTable(input: $input) { table { id key name } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveLayoutCustomTable($input: SaveCustomTableInput!) {\n    saveCustomTable(input: $input) { table { id key name } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEmployeeFields($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) { employee { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateEmployeeFields($input: UpdateEmployeeInput!) {\n    updateEmployee(input: $input) { employee { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyFields($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation UpdateMyFields($input: MyDetailsInput!) {\n    updateMyDetails(input: $input) { applied request { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetCustomFields($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SetCustomFields($employeeId: ID!, $values: JSON!) {\n    setEmployeeCustomValues(employeeId: $employeeId, values: $values) { ok errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LeaveHistory($employeeId: ID, $leaveTypeId: ID!, $year: Int) {\n    leaveHistory(employeeId: $employeeId, leaveTypeId: $leaveTypeId, year: $year) {\n      years\n      rows { id date kind description detail used earned balance }\n    }\n  }\n"): (typeof documents)["\n  query LeaveHistory($employeeId: ID, $leaveTypeId: ID!, $year: Int) {\n    leaveHistory(employeeId: $employeeId, leaveTypeId: $leaveTypeId, year: $year) {\n      years\n      rows { id date kind description detail used earned balance }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveTableRow($input: TableRowInput!) {\n    saveTableRow(input: $input) { row { id } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveTableRow($input: TableRowInput!) {\n    saveTableRow(input: $input) { row { id } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTableRow($id: ID!) {\n    deleteTableRow(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTableRow($id: ID!) {\n    deleteTableRow(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EmployeeProfile($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      workPhone\n      workPhoneExt\n      dateOfBirth\n      gender\n      maritalStatus\n      personal { nationality linkedinUrl twitter facebook homePhone addressLine1 addressLine2 city state postalCode country }\n      photoUrl\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name city country timezone }\n      jobTitle { id name description }\n      grade { id name }\n      manager { id fullName jobTitle { name } photoUrl }\n      directReports { id fullName jobTitle { name } }\n      emergencyContacts {\n        id name relationship phone workPhone workPhoneExt homePhone email isPrimary\n        addressLine1 addressLine2 city state postalCode country\n      }\n      privateDetails { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n      customValues { value field { id key name fieldType choices helpText hrOnly } }\n      tableRows { id tableKey values createdAt }\n      compensation { amount currency frequency effectiveDate payType paySchedule overtime }\n      compensationHistory { id amount currency frequency effectiveDate reason payType paySchedule overtime comment }\n      bonusTarget { percent amount }\n      statusHistory { id effectiveDate status comment }\n      notes { id body authorName createdAt }\n      employmentHistory {\n        id effectiveDate changeType reason\n        jobTitle { name }\n        department { name }\n        location { name }\n        grade { name }\n        manager { fullName }\n        employmentType\n      }\n    }\n  }\n"): (typeof documents)["\n  query EmployeeProfile($id: ID!) {\n    employee(id: $id) {\n      id\n      employeeNumber\n      fullName\n      firstName\n      middleName\n      lastName\n      preferredName\n      workEmail\n      personalEmail\n      phone\n      workPhone\n      workPhoneExt\n      dateOfBirth\n      gender\n      maritalStatus\n      personal { nationality linkedinUrl twitter facebook homePhone addressLine1 addressLine2 city state postalCode country }\n      photoUrl\n      status\n      hireDate\n      probationEndDate\n      terminationDate\n      terminationReason\n      employmentType\n      archivedAt\n      legalEntity { id name }\n      department { id name }\n      location { id name city country timezone }\n      jobTitle { id name description }\n      grade { id name }\n      manager { id fullName jobTitle { name } photoUrl }\n      directReports { id fullName jobTitle { name } }\n      emergencyContacts {\n        id name relationship phone workPhone workPhoneExt homePhone email isPrimary\n        addressLine1 addressLine2 city state postalCode country\n      }\n      privateDetails { bankName bankAccountName bankAccountNumber nationalId taxId pensionId masked }\n      customValues { value field { id key name fieldType choices helpText hrOnly } }\n      tableRows { id tableKey values createdAt }\n      compensation { amount currency frequency effectiveDate payType paySchedule overtime }\n      compensationHistory { id amount currency frequency effectiveDate reason payType paySchedule overtime comment }\n      bonusTarget { percent amount }\n      statusHistory { id effectiveDate status comment }\n      notes { id body authorName createdAt }\n      employmentHistory {\n        id effectiveDate changeType reason\n        jobTitle { name }\n        department { name }\n        location { name }\n        grade { name }\n        manager { fullName }\n        employmentType\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileLayout {\n    profileLayout {\n      tabs {\n        key name builtin\n        sections { key title icon items { id kind key label fields } }\n      }\n      library { id kind key label fields }\n    }\n    customTables(includeInactive: true) { id key name hrOnly pay standard isActive columns { key name type choices } }\n    customFields(includeInactive: true) { id key }\n  }\n"): (typeof documents)["\n  query ProfileLayout {\n    profileLayout {\n      tabs {\n        key name builtin\n        sections { key title icon items { id kind key label fields } }\n      }\n      library { id kind key label fields }\n    }\n    customTables(includeInactive: true) { id key name hrOnly pay standard isActive columns { key name type choices } }\n    customFields(includeInactive: true) { id key }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveProfileLayout($config: JSON!) {\n    saveProfileLayout(config: $config) { layout { tabs { key } } errors { field message } }\n  }\n"): (typeof documents)["\n  mutation SaveProfileLayout($config: JSON!) {\n    saveProfileLayout(config: $config) { layout { tabs { key } } errors { field message } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ReportCatalog {\n    reportCatalog { key title description usesRange groupings }\n  }\n"): (typeof documents)["\n  query ReportCatalog {\n    reportCatalog { key title description usesRange groupings }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n      mfaEnabled mfaSetupRequired recoveryCodesLeft\n    }\n    tenant { name slug primaryColor country currency logoUrl }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      permissions\n      roles\n      user { id email fullName }\n      employee { id fullName jobTitle { name } }\n      mfaEnabled mfaSetupRequired recoveryCodesLeft\n    }\n    tenant { name slug primaryColor country currency logoUrl }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;