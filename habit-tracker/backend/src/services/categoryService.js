const repository =
require(
"../repositories/categoryRepository"
);

async function getAll() {

    return await
    repository.getAll();

}

async function create(

    name,
    color

) {

    if (
        !name.trim()
    ) {

        throw new Error(
            "Category name required."
        );

    }

    return await
    repository.create(

        name,
        color

    );

}

module.exports = {

    getAll,
    create

};