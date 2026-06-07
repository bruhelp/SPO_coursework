const repository =
require(
"../repositories/userRepository"
);

async function profile(
    req,
    res,
    next
) {

    try {

        const user =
        await repository
        .findById(
            req.user.id
        );

        res.json(user);

    }
    catch (error) {

        next(error);

    }

}

module.exports = {

    profile

};