const pool =
    require("../config/database");

async function getAll() {

    const result =
        await pool.query(

            `
        SELECT *
        FROM categories
        ORDER BY name
        `

        );

    return result.rows;

}

async function create(
    name,
    color
) {

    const result =
        await pool.query(

            `
        INSERT INTO categories
        (
            name,
            color
        )

        VALUES
        (
            $1,
            $2
        )

        RETURNING *
        `,

            [
                name,
                color
            ]

        );
    return result.rows[0];
}

module.exports = {
    getAll,
    create
};