const router =
    require("express")
        .Router();

const auth =
    require(
        "../middleware/authMiddleware"
    );

const controller =
    require(
        "../controllers/categoryController"
    );

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

module.exports =
    router;