const auditRepository =
require("../repositories/auditLogRepository");

/*
    Централизованная запись действий пользователя.

    Используется всеми сервисами,
    чтобы не дублировать одинаковый код.
*/

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

module.exports = {

    writeLog

};