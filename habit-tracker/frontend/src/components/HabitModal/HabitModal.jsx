import { useEffect, useState } from "react";
import { createHabit } from "../../api/habitsApi";
import { getCategories } from "../../api/categoriesApi";
import {
    isEmpty,
    isPositiveInteger,
    isValidGoalType,
    isValidFrequency
} from "../../utils/validators";

import "./HabitModal.css";

function HabitModal({ onClose, onCreated }) {

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        categoryId: "",
        colorTheme: "#4CAF50",
        frequencyType: "day",
        frequencyValue: 1,
        goalType: "none",
        goalValue: "",
        goalDate: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const data = await getCategories();
        setCategories(data);
    }

    function updateField(field, value) {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (isEmpty(form.title)) {
            return setError("Название обязательно");
        }

        if (!isValidFrequency(form.frequencyType)) {
            return setError("Неверная частота");
        }

        if (!isValidGoalType(form.goalType)) {
            return setError("Неверная цель");
        }

        if (form.goalValue && !isPositiveInteger(Number(form.goalValue))) {
            return setError("goalValue должен быть числом");
        }

        try {
            await createHabit({
                ...form,
                categoryId: Number(form.categoryId),
                frequencyValue: Number(form.frequencyValue),
                goalValue: form.goalValue ? Number(form.goalValue) : null
            });

            onCreated();
            onClose();
        }
        catch (err) {
            setError(err.response?.data?.message || "Ошибка создания привычки");
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Новая привычка</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Название"
                        value={form.title}
                        onChange={e => updateField("title", e.target.value)}
                    />

                    <textarea
                        placeholder="Описание"
                        value={form.description}
                        onChange={e => updateField("description", e.target.value)}
                    />

                    <select
                        value={form.categoryId}
                        onChange={e => updateField("categoryId", e.target.value)}
                    >
                        <option value="">Категория</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="color"
                        value={form.colorTheme}
                        onChange={e => updateField("colorTheme", e.target.value)}
                    />

                    <select
                        value={form.frequencyType}
                        onChange={e => updateField("frequencyType", e.target.value)}
                    >
                        <option value="day">День</option>
                        <option value="week">Неделя</option>
                        <option value="month">Месяц</option>
                    </select>

                    <input
                        type="number"
                        value={form.frequencyValue}
                        onChange={e => updateField("frequencyValue", e.target.value)}
                    />

                    <select
                        value={form.goalType}
                        onChange={e => updateField("goalType", e.target.value)}
                    >
                        <option value="none">Нет цели</option>
                        <option value="date">До даты</option>
                        <option value="streak">Серия</option>
                        <option value="total">Всего</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Цель"
                        value={form.goalValue}
                        onChange={e => updateField("goalValue", e.target.value)}
                    />

                    <input
                        type="date"
                        value={form.goalDate}
                        onChange={e => updateField("goalDate", e.target.value)}
                    />

                    {error && <div className="error">{error}</div>}

                    <button type="submit">Создать</button>
                    <button type="button" onClick={onClose}>Закрыть</button>

                </form>
            </div>
        </div>
    );
}

export default HabitModal;