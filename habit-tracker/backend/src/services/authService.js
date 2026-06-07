const bcrypt =
require("bcrypt");

const jwt =
require("jsonwebtoken");

const jwtConfig =
require("../config/jwt");

const userRepository =
require("../repositories/userRepository");

const auditService =
require("./auditService");

const validators =
require("../utils/validators");

async function register(

    username,
    email,
    password,
    ipAddress

) {

    if (
        validators.isEmpty(username)
        ||
        validators.isEmpty(email)
        ||
        validators.isEmpty(password)
    ) {

        throw new Error(
            "All fields are required."
        );

    }

    if (
        !validators
        .isValidEmail(email)
    ) {

        throw new Error(
            "Invalid email."
        );

    }

    const existingUser =
    await userRepository
    .findByEmail(email);

    if (
        existingUser
    ) {

        throw new Error(
            "User already exists."
        );

    }

    const passwordHash =
    await bcrypt.hash(
        password,
        10
    );

    const user =
    await userRepository.create(

        username,
        email,
        passwordHash

    );

    await auditService.writeLog(

        user.id,
        "register",
        "user",
        user.id,
        ipAddress

    );

    return user;

}

async function login(

    email,
    password,
    ipAddress

) {

    const user =
    await userRepository
    .findByEmail(email);

    if (
        !user
    ) {

        throw new Error(
            "Invalid credentials."
        );

    }

    const validPassword =
    await bcrypt.compare(

        password,
        user.password_hash

    );

    if (
        !validPassword
    ) {

        throw new Error(
            "Invalid credentials."
        );

    }

    const accessToken =
    jwt.sign(

        {

            id: user.id,
            email: user.email

        },

        jwtConfig.secret,

        {

            expiresIn:
            jwtConfig.expiresIn

        }

    );

    await auditService.writeLog(

        user.id,
        "login",
        "user",
        user.id,
        ipAddress

    );

    return {

        accessToken

    };

}

module.exports = {

    register,
    login

};