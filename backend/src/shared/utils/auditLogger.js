/**
 * Comprehensive Audit Logging Helper
 * Use this in controllers to log important actions with full detail
 */

const { auditService, AuditActionType, AuditModule, AuditSeverity } = require('../../modules/audit/services/audit.service');

/**
 * Log IPR application filing
 */
async function logIprFiling(application, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Filed new IPR application: ${application.title || application.id}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.IPR,
    category: 'application',
    severity: AuditSeverity.INFO,
    targetTable: 'ipr_applications',
    targetId: application.id,
    newValues: application,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      applicationType: application.applicationType,
      status: application.status,
      filingDate: application.filingDate
    }
  });
}

/**
 * Log IPR application update
 */
async function logIprUpdate(oldData, newData, userId, req, action = 'Updated IPR application') {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `${action}: ${newData.title || newData.id}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.IPR,
    category: 'application',
    severity: AuditSeverity.INFO,
    targetTable: 'ipr_applications',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log IPR approval/rejection
 */
async function logIprStatusChange(application, oldStatus, newStatus, userId, req, comments = null) {
  const actionVerb = newStatus.includes('approved') ? 'Approved' : newStatus.includes('reject') ? 'Rejected' : 'Changed status of';
  const actionType = newStatus.includes('approved') ? AuditActionType.APPROVE : 
                     newStatus.includes('reject') ? AuditActionType.REJECT : 
                     AuditActionType.STATUS_CHANGE;
  
  await auditService.log({
    actorId: userId,
    action: `${actionVerb} IPR application: ${application.title || application.id}`,
    actionType,
    module: AuditModule.IPR,
    category: 'approval',
    severity: AuditSeverity.INFO,
    targetTable: 'ipr_applications',
    targetId: application.id,
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      oldStatus,
      newStatus,
      comments,
      reviewedAt: new Date()
    }
  });
}

/**
 * Log Research contribution filing
 */
async function logResearchFiling(contribution, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Filed new research contribution: ${contribution.title || contribution.id}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.RESEARCH,
    category: 'contribution',
    severity: AuditSeverity.INFO,
    targetTable: 'research_contributions',
    targetId: contribution.id,
    newValues: contribution,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      contributionType: contribution.contributionType,
      status: contribution.status,
      submissionDate: contribution.submissionDate
    }
  });
}

/**
 * Log Research contribution update
 */
async function logResearchUpdate(oldData, newData, userId, req, action = 'Updated research contribution') {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `${action}: ${newData.title || newData.id}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.RESEARCH,
    category: 'contribution',
    severity: AuditSeverity.INFO,
    targetTable: 'research_contributions',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log Research approval/rejection
 */
async function logResearchStatusChange(contribution, oldStatus, newStatus, userId, req, comments = null) {
  const actionVerb = newStatus.includes('approved') ? 'Approved' : newStatus.includes('reject') ? 'Rejected' : 'Changed status of';
  const actionType = newStatus.includes('approved') ? AuditActionType.APPROVE : 
                     newStatus.includes('reject') ? AuditActionType.REJECT : 
                     AuditActionType.STATUS_CHANGE;
  
  await auditService.log({
    actorId: userId,
    action: `${actionVerb} research contribution: ${contribution.title || contribution.id}`,
    actionType,
    module: AuditModule.RESEARCH,
    category: 'approval',
    severity: AuditSeverity.INFO,
    targetTable: 'research_contributions',
    targetId: contribution.id,
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      oldStatus,
      newStatus,
      comments,
      reviewedAt: new Date()
    }
  });
}

/**
 * Log file upload
 */
async function logFileUpload(fileName, fileSize, filePath, userId, req, module, entity) {
  await auditService.log({
    actorId: userId,
    action: `Uploaded file: ${fileName} (${formatFileSize(fileSize)})`,
    actionType: AuditActionType.FILE_UPLOAD,
    module,
    category: 'file-upload',
    severity: AuditSeverity.INFO,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      fileName,
      fileSize,
      filePath,
      entity
    }
  });
}

/**
 * Log permission change
 */
async function logPermissionChange(targetUser, permissions, grantedBy, req) {
  await auditService.log({
    actorId: grantedBy,
    action: `Updated permissions for user: ${targetUser.uid || targetUser.email}`,
    actionType: AuditActionType.PERMISSION_CHANGE,
    module: AuditModule.PERMISSION,
    category: 'permission-management',
    severity: AuditSeverity.INFO,
    targetTable: 'permissions',
    targetId: targetUser.id,
    newValues: permissions,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      targetUserId: targetUser.id,
      targetUsername: targetUser.uid,
      permissionsChanged: permissions
    }
  });
}

/**
 * Log data export
 */
async function logDataExport(exportType, filters, recordCount, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Exported ${exportType} data (${recordCount} records)`,
    actionType: AuditActionType.EXPORT,
    module: AuditModule.REPORT,
    category: 'data-export',
    severity: AuditSeverity.INFO,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      exportType,
      filters,
      recordCount,
      exportedAt: new Date()
    }
  });
}

/**
 * Log login attempt
 */
async function logLoginAttempt(username, success, userId = null, req, reason = null) {
  await auditService.log({
    actorId: userId,
    action: success ? 'User logged in successfully' : `Login attempt failed: ${reason || 'Invalid credentials'}`,
    actionType: success ? AuditActionType.LOGIN : AuditActionType.LOGIN_FAILED,
    module: AuditModule.AUTH,
    category: 'authentication',
    severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      username,
      success,
      reason,
      timestamp: new Date()
    }
  });
}

/**
 * Log logout
 */
async function logLogout(userId, req) {
  await auditService.log({
    actorId: userId,
    action: 'User logged out',
    actionType: AuditActionType.LOGOUT,
    module: AuditModule.AUTH,
    category: 'authentication',
    severity: AuditSeverity.INFO,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      logoutAt: new Date()
    }
  });
}

/**
 * Helper: Get IP address from request
 */
function getIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }
  
  const ip = req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  if (ip && ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  
  if (ip === '::1') {
    return '127.0.0.1';
  }
  
  return ip || 'unknown';
}

/**
 * Helper: Get changes between old and new objects
 */
function getChanges(oldObj, newObj) {
  const changes = {};
  
  // Get all unique keys
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  
  for (const key of allKeys) {
    if (key === 'updatedAt' || key === 'updated_at') continue; // Skip timestamp fields
    
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = {
        from: oldVal,
        to: newVal
      };
    }
  }
  
  return changes;
}

/**
 * Helper: Format file size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Log employee creation
 */
async function logEmployeeCreation(employee, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Created employee: ${employee.displayName || employee.empId}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.USER,
    category: 'user_management',
    severity: AuditSeverity.INFO,
    targetTable: 'employee_details',
    targetId: employee.id,
    newValues: employee,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      empId: employee.empId,
      designation: employee.designation,
      school: employee.primarySchoolId,
      department: employee.primaryDepartmentId
    }
  });
}

/**
 * Log employee update
 */
async function logEmployeeUpdate(oldData, newData, userId, req) {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `Updated employee: ${newData.displayName || newData.empId}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.USER,
    category: 'user_management',
    severity: AuditSeverity.INFO,
    targetTable: 'employee_details',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log student creation
 */
async function logStudentCreation(student, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Created student: ${student.displayName || student.studentId}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.USER,
    category: 'user_management',
    severity: AuditSeverity.INFO,
    targetTable: 'student_details',
    targetId: student.id,
    newValues: student,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      studentId: student.studentId,
      registrationNo: student.registrationNo,
      programId: student.programId
    }
  });
}

/**
 * Log student update
 */
async function logStudentUpdate(oldData, newData, userId, req) {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `Updated student: ${newData.displayName || newData.studentId}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.USER,
    category: 'user_management',
    severity: AuditSeverity.INFO,
    targetTable: 'student_details',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log school creation
 */
async function logSchoolCreation(school, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Created school: ${school.facultyName || school.facultyCode}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.SYSTEM,
    category: 'configuration',
    severity: AuditSeverity.INFO,
    targetTable: 'faculty_school_list',
    targetId: school.id,
    newValues: school,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      facultyCode: school.facultyCode,
      facultyType: school.facultyType
    }
  });
}

/**
 * Log school update
 */
async function logSchoolUpdate(oldData, newData, userId, req) {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `Updated school: ${newData.facultyName || newData.facultyCode}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.SYSTEM,
    category: 'configuration',
    severity: AuditSeverity.INFO,
    targetTable: 'faculty_school_list',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log department creation
 */
async function logDepartmentCreation(department, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Created department: ${department.departmentName || department.departmentCode}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.SYSTEM,
    category: 'configuration',
    severity: AuditSeverity.INFO,
    targetTable: 'departments',
    targetId: department.id,
    newValues: department,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      departmentCode: department.departmentCode,
      schoolId: department.facultyId
    }
  });
}

/**
 * Log department update
 */
async function logDepartmentUpdate(oldData, newData, userId, req) {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `Updated department: ${newData.departmentName || newData.departmentCode}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.SYSTEM,
    category: 'configuration',
    severity: AuditSeverity.INFO,
    targetTable: 'departments',
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes }
  });
}

/**
 * Log policy creation
 */
async function logPolicyCreation(policy, policyType, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Created ${policyType} policy: ${policy.policyName || policy.id}`,
    actionType: AuditActionType.CREATE,
    module: AuditModule.POLICY,
    category: 'policy_management',
    severity: AuditSeverity.MEDIUM,
    targetTable: `${policyType}_policy`,
    targetId: policy.id,
    newValues: policy,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: {
      policyType,
      effectiveFrom: policy.effectiveFrom,
      effectiveTo: policy.effectiveTo,
      isActive: policy.isActive
    }
  });
}

/**
 * Log policy update
 */
async function logPolicyUpdate(oldData, newData, policyType, userId, req) {
  const changes = getChanges(oldData, newData);
  
  await auditService.log({
    actorId: userId,
    action: `Updated ${policyType} policy: ${newData.policyName || newData.id}`,
    actionType: AuditActionType.UPDATE,
    module: AuditModule.POLICY,
    category: 'policy_management',
    severity: AuditSeverity.MEDIUM,
    targetTable: `${policyType}_policy`,
    targetId: newData.id,
    oldValues: oldData,
    newValues: newData,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { changes, policyType }
  });
}

/**
 * Log policy deletion
 */
async function logPolicyDeletion(policy, policyType, userId, req) {
  await auditService.log({
    actorId: userId,
    action: `Deleted ${policyType} policy: ${policy.policyName || policy.id}`,
    actionType: AuditActionType.DELETE,
    module: AuditModule.POLICY,
    category: 'policy_management',
    severity: AuditSeverity.HIGH,
    targetTable: `${policyType}_policy`,
    targetId: policy.id,
    oldValues: policy,
    ipAddress: getIp(req),
    userAgent: req.headers['user-agent'],
    details: { policyType }
  });
}

module.exports = {
  logIprFiling,
  logIprUpdate,
  logIprStatusChange,
  logResearchFiling,
  logResearchUpdate,
  logResearchStatusChange,
  logFileUpload,
  logPermissionChange,
  logDataExport,
  logLoginAttempt,
  logLogout,
  logEmployeeCreation,
  logEmployeeUpdate,
  logStudentCreation,
  logStudentUpdate,
  logSchoolCreation,
  logSchoolUpdate,
  logDepartmentCreation,
  logDepartmentUpdate,
  logPolicyCreation,
  logPolicyUpdate,
  logPolicyDeletion,
  getIp,
  getChanges
};
