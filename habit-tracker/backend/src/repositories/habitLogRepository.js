const pool =
require("../config/database");

async function add(
    habitId,
    completedAt
) {

    const result =
    await pool.query(

        `
        INSERT INTO
        habit_logs
        (
            habit_id,
            completed_at
        )

        VALUES
        (
            $1,
            $2
        )

        RETURNING *
        `,

        [
            habitId,
            completedAt
        ]

    );

    return result.rows[0];

}

async function getByHabit(
    habitId
) {

    const result =
    await pool.query(

        `
        SELECT *

        FROM habit_logs

        WHERE habit_id = $1

        ORDER BY
        completed_at
        `,

        [habitId]

    );

    return result.rows;

}

module.exports = {

    add,
    getByHabit

};