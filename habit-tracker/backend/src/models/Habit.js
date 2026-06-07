class Habit {

    constructor(
        id,
        userId,
        categoryId,
        title,
        description,
        colorTheme,
        frequencyType,
        frequencyValue,
        goalType,
        goalValue,
        goalDate,
        startDate,
        status,
        createdAt
    ) {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.colorTheme = colorTheme;
        this.frequencyType = frequencyType;
        this.frequencyValue = frequencyValue;
        this.goalType = goalType;
        this.goalValue = goalValue;
        this.goalDate = goalDate;
        this.startDate = startDate;
        this.status = status;
        this.createdAt = createdAt;
    }

}

module.exports = Habit;