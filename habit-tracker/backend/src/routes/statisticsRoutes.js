const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const controller = require("../controllers/statisticsController");

router.get(
    "/",
    auth,
    controller.general
);

router.get(
    "/:id",
    auth,
    controller.habit
);

module.exports = router;