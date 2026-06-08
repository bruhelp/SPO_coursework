const service =
    require("../services/categoryService");

async function getAll(req, res, next) {

    try {
        res.json(
            await service
                .getAll()
        );
    }
    catch (error) {
        next(error);
    }

}

async function create(req, res, next) {
    try {
        const category =
            await service
                .create(req.body.name, req.body.color);
        res
            .status(201)
            .json(category);
    }
    catch (error) {
        next(error);
    }

}

module.exports = {
    getAll,
    create
};