const validators =
require("../utils/validators");

module.exports = (
    req,
    res,
    next
) => {

    const body =
    req.body;

    for (
        const key
        in body
    ) {

        if (
            body[key] === undefined ||
            body[key] === null
        ) {

            return res
            .status(400)
            .json({

                message:
                `${key} is required.`

            });

        }

        if (
            typeof body[key] ===
            "string"
        ) {

            if (
                validators.isEmpty(
                    body[key]
                )
            ) {

                return res
                .status(400)
                .json({

                    message:
                    `${key} cannot be empty.`

                });

            }

        }

    }

    next();

};