const pool =
    require("../config/database");

async function getAllByUser(
    userId,
    includeArchived = false
) {
    const conditions = ["user_id = $1"];

    if (!includeArchived) {
        conditions.push("status <> 'archived'");
    }

    const result =
        await pool.query(
            `
        SELECT *

        FROM habits

        WHERE
        ${conditions.join("\n        AND\n        ")}

        ORDER BY
        created_at DESC
        `,
            [userId]
        );

    return result.rows;
}

async function getById(id) {
    const result =
        await pool.query(

            `
        SELECT *

        FROM habits

        WHERE id = $1
        `,

            [id]

        );
    return result.rows[0];
}

async function create(
    habit
) {
    const result =
        await pool.query(

            `
        INSERT INTO habits
        (
            user_id,
            category_id,
            title,
            description,
            color_theme,
            frequency_type,
            frequency_value,
            goal_type,
            goal_value,
            goal_date,
            start_date
        )

        VALUES
        (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,
            $10,$11
        )

        RETURNING *
        `,
            [

                habit.userId,
                habit.categoryId,
                habit.title,
                habit.description,
                habit.colorTheme,
                habit.frequencyType,
                habit.frequencyValue,
                habit.goalType,
                habit.goalValue,
                habit.goalDate,
                habit.startDate

            ]
        );
    return result.rows[0];
}

async function update(
    id,
    habit
) {
    const result =
        await pool.query(
            `
            UPDATE habits
                SET
                    category_id = $1,
                    title = $2,
                    description = $3,
                    color_theme = $4,
                    frequency_type = $5,
                    frequency_value = $6,
                    goal_type = $7,
                    goal_value = $8,
                    goal_date = $9,
                    start_date = $10,
                    status = $11
                WHERE id = $12
                RETURNING *;
        `,

            [
                habit.categoryId,
                habit.title,
                habit.description,
                habit.colorTheme,
                habit.frequencyType,
                habit.frequencyValue,
                habit.goalType,
                habit.goalValue,
                habit.goalDate,
                habit.startDate,
                habit.status,
                id
            ]
        );
    return result.rows[0];
}

async function remove(id) {
    await pool.query(
        `
        DELETE

        FROM habits

        WHERE id = $1
        `,
        [id]
    );
}

async function archive(id) {
    await pool.query(
        `
        UPDATE habits

        SET status =
        'archived'

        WHERE id = $1
        `,
        [id]
    );

}

module.exports = {
    getAllByUser,
    getById,
    create,
    update,
    remove,
    archive
};