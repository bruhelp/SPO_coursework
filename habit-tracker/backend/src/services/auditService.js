const auditRepository = require("../repositories/auditLogRepository");

async function writeLog(
    userId,
    action,
    entityType,
    entityId,
    ipAddress
) {

    await auditRepository.add(
        userId,
        action,
        entityType,
        entityId,
        ipAddress
    );
}

module.exports = { writeLog };