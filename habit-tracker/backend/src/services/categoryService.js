const repository = require("../repositories/categoryRepository");

const createError = require("../utils/createError");

async function getAll() {
    return await
        repository.getAll();
}

async function create(name, color) {
    if (!name.trim()) {
        throw createError("Category name required.");
    }
    return await
        repository.create(
            name,
            color
        );
}

module.exports = { getAll, create };