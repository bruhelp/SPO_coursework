const pool =
require("../config/database");

async function add(
    userId,
    action,
    entityType,
    entityId,
    ipAddress
) {

    await pool.query(

        `
        INSERT INTO
        audit_logs
        (
            user_id,
            action,
            entity_type,
            entity_id,
            ip_address
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        `,

        [
            userId,
            action,
            entityType,
            entityId,
            ipAddress
        ]
    );
}

module.exports = {
    add
};