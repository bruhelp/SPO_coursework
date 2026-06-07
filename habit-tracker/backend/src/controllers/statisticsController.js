const service =
require(
"../services/statisticsService"
);

async function general(
    req,
    res,
    next
) {

    try {

        res.json(

            await service
            .getGeneralStatistics(

                req.user.id

            )

        );

    }
    catch (error) {

        next(error);

    }

}

async function habit(
    req,
    res,
    next
) {

    try {

        res.json(

            await service
            .getHabitStatistics(

                req.params.id

            )

        );

    }
    catch (error) {

        next(error);

    }

}

module.exports = {

    general,
    habit

};