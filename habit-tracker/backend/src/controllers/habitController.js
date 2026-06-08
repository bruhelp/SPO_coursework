const service = require("../services/habitService");

async function getAll(req, res, next) {
    try {
        res.json(
            await service
                .getAll(req.user.id)
        );
    }
    catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        req.body.userId = req.user.id;

        const habit =
            await service.create(req.body, req.ip);
        res.status(201).json(habit);
    }
    catch (error) {
        next(error);
    }

}

async function update(req, res, next) {
    try {
        req.body.userId = req.user.id;
        res.json(
            await service
                .update(req.params.id, req.body, req.ip)
        );
    }
    catch (error) {
        next(error);
    }

}

async function remove(req, res, next) {
    try {
        await service.remove(req.params.id, req.user.id, req.ip);
        res.json({
            message: "Habit deleted."
        });
    }
    catch (error) {
        next(error);
    }

}

async function archive(req, res, next) {
    try {
        await service.archive(req.params.id, req.user.id, req.ip);
        res.json({
            message: "Habit archived."
        });
    }
    catch (error) {
        next(error);
    }

}

async function complete(req, res, next) {
    try {
        await service.complete(
            req.params.id,
            req.body.date,
            req.user.id,
            req.ip
        );

        res.json({
            message: "Habit completed."
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove,
    archive,
    complete
};