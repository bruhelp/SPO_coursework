const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const controller = require("../controllers/habitController");

router.get(
    "/",
    auth,
    controller.getAll
);

router.post(
    "/",
    auth,
    controller.create
);

router.put(
    "/:id",
    auth,
    controller.update
);

router.delete(
    "/:id",
    auth,
    controller.remove
);

router.patch(
    "/:id/archive",
    auth,
    controller.archive
);

router.patch(
    "/:id/complete",
    auth,
    controller.complete
);

module.exports =
    router;