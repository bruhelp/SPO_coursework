CREATE TYPE frequency_enum AS ENUM (
    'day',
    'week',
    'month'
);

CREATE TYPE goal_enum AS ENUM (
    'none',
    'date',
    'streak',
    'total'
);

CREATE TYPE status_enum AS ENUM (
    'active',
    'archived',
    'completed'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20) NOT NULL
);

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    title VARCHAR(100) NOT NULL,
    description TEXT,

    color_theme VARCHAR(20),

    frequency_type frequency_enum NOT NULL,
    frequency_value INTEGER NOT NULL,

    goal_type goal_enum DEFAULT 'none',
    goal_value INTEGER,
    goal_date DATE,

    start_date DATE NOT NULL,

    status status_enum DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
);

CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,

    habit_id INTEGER NOT NULL,

    completed_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_habit
        FOREIGN KEY(habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    action VARCHAR(50) NOT NULL,

    entity_type VARCHAR(50) NOT NULL,

    entity_id INTEGER,

    ip_address VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

INSERT INTO categories(name, color)
VALUES
('Здоровье', '#4CAF50'),
('Спорт', '#2196F3'),
('Обучение', '#9C27B0'),
('Работа', '#FF9800'),
('Другое', '#607D8B');