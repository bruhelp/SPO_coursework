class AuditLog {

    constructor(
        id,
        userId,
        action,
        entityType,
        entityId,
        ipAddress,
        createdAt
    ) {
        this.id = id;
        this.userId = userId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
    }

}

module.exports = AuditLog;