const authService = require("../services/authService");

async function register(
    req,
    res,
    next
) {

    try {
        const user =
            await authService.register(
                req.body.username,
                req.body.email,
                req.body.password,
                req.ip
            );

        res
            .status(201)
            .json(user);

    }
    catch (error) { next(error); }

}

async function login(
    req,
    res,
    next
) {

    try {
        const token =
            await authService.login(
                req.body.email,
                req.body.password,
                req.ip
            );

        res.json(token);

    }
    catch (error) { next(error); }
}

async function logout(
    req,
    res
) {

    res.json({ message: "Logout successful." });

}

module.exports = {
    register,
    login,
    logout
};