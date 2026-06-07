const router =
    require("express")
        .Router();

const auth =
    require(
        "../middleware/authMiddleware"
    );

const controller =
    require(
        "../controllers/userController"
    );

router.get(

    "/profile",

    auth,

    controller.profile

);

module.exports =
    router;