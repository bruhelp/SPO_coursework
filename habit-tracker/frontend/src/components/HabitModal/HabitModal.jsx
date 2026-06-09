import { useEffect, useState } from "react";
import { createHabit, updateHabit } from "../../api/habitsApi";
import { getCategories } from "../../api/categoriesApi";
import {
    isEmpty,
    isPositiveInteger,
    isValidGoalType,
    isValidFrequency
} from "../../utils/validators";
import "./HabitModal.css";

function getInitialForm(habit) {
    if (!habit) {
        return {
            title: "",
            description: "",
            categoryId: "",
            colorTheme: "#4CAF50",
            frequencyType: "day",
            frequencyValue: 1,
            goalType: "none",
            goalValue: "",
            goalDate: "",
            startDate: new Date().toISOString().slice(0, 10)
        };
    }

    return {
        title: habit.title || "",
        description: habit.description || "",
        categoryId: habit.category_id ? String(habit.category_id) : "",
        colorTheme: habit.color_theme || "#4CAF50",
        frequencyType: habit.frequency_type || "day",
        frequencyValue: habit.frequency_value || 1,
        goalType: habit.goal_type || "none",
        goalValue: habit.goal_value ?? "",
        goalDate: habit.goal_date ? String(habit.goal_date).slice(0, 10) : "",
        startDate: habit.start_date ? String(habit.start_date).slice(0, 10) : new Date().toISOString().slice(0, 10)
    };
}

function HabitModal({ onClose, onCreated, onSaved, habit = null }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(getInitialForm(habit));

    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setForm(getInitialForm(habit));
        setError("");
    }, [habit]);

    // Close on backdrop click
    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (e) {
            console.log(e);
        }
    }

    function updateField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function getPayload() {
        return {
            title: form.title.trim(),
            description: form.description.trim() || null,
            categoryId: Number(form.categoryId),
            colorTheme: form.colorTheme,
            frequencyType: form.frequencyType,
            frequencyValue: Number(form.frequencyValue),
            goalType: form.goalType,
            goalValue: form.goalType === "streak" || form.goalType === "total"
                ? Number(form.goalValue)
                : null,
            goalDate: form.goalType === "date" ? form.goalDate : null,
            startDate: form.startDate
        };
    }

    async function handleSubmit() {
        setError("");

        if (isEmpty(form.title)) return setError("Название обязательно");
        if (isEmpty(form.categoryId)) return setError("Категория обязательна");
        if (!isValidFrequency(form.frequencyType)) return setError("Неверная частота");
        if (!isValidGoalType(form.goalType)) return setError("Неверная цель");
        if (!isPositiveInteger(Number(form.frequencyValue))) {
            return setError("Частота должна быть положительным числом");
        }
        if ((form.goalType === "streak" || form.goalType === "total") && !isPositiveInteger(Number(form.goalValue))) {
            return setError("Цель должна быть положительным числом");
        }
        if (form.goalType === "date" && isEmpty(form.goalDate)) {
            return setError("Нужна дата цели");
        }

        setLoading(true);
        try {
            const payload = getPayload();
            const savedHabit = habit
                ? await updateHabit(habit.id, payload)
                : await createHabit(payload);

            if (onSaved) {
                onSaved(savedHabit);
            } else if (onCreated) {
                onCreated(savedHabit);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Ошибка ${habit ? "обновления" : "создания"} привычки`);
        } finally {
            setLoading(false);
        }
    }

    const showGoalValue = form.goalType === "streak" || form.goalType === "total";
    const showGoalDate = form.goalType === "date";

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal">
                <div className="modal-header">
                    <h2>{habit ? "Редактирование привычки" : "Новая привычка"}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="field-group">
                        <label>Название *</label>
                        <input
                            placeholder="Например: Медитация"
                            value={form.title}
                            onChange={e => updateField("title", e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="field-group">
                        <label>Описание</label>
                        <textarea
                            placeholder="Кратко о привычке..."
                            value={form.description}
                            onChange={e => updateField("description", e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="field-row">
                        <div className="field-group">
                            <label>Категория</label>
                            <select
                                value={form.categoryId}
                                onChange={e => updateField("categoryId", e.target.value)}
                            >
                                    <option value="">Выберите категорию</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group field-group--color">
                            <label>Цвет</label>
                            <input
                                type="color"
                                value={form.colorTheme}
                                onChange={e => updateField("colorTheme", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field-group">
                            <label>Частота</label>
                            <select
                                value={form.frequencyType}
                                onChange={e => updateField("frequencyType", e.target.value)}
                            >
                                <option value="day">Каждый день</option>
                                <option value="week">Раз в неделю</option>
                                <option value="month">Раз в месяц</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label>Кол-во</label>
                            <input
                                type="number"
                                min="1"
                                value={form.frequencyValue}
                                onChange={e => updateField("frequencyValue", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label>Тип цели</label>
                        <select
                            value={form.goalType}
                            onChange={e => updateField("goalType", e.target.value)}
                        >
                            <option value="none">Без цели</option>
                            <option value="date">До даты</option>
                            <option value="streak">Серия дней</option>
                            <option value="total">Всего выполнений</option>
                        </select>
                    </div>

                    {showGoalValue && (
                        <div className="field-group">
                            <label>{form.goalType === "streak" ? "Дней подряд" : "Всего раз"}</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Введите число"
                                value={form.goalValue}
                                onChange={e => updateField("goalValue", e.target.value)}
                            />
                        </div>
                    )}

                    {showGoalDate && (
                        <div className="field-group">
                            <label>Дата цели</label>
                            <input
                                type="date"
                                value={form.goalDate}
                                onChange={e => updateField("goalDate", e.target.value)}
                            />
                        </div>
                    )}

                    {error && <div className="modal-error">{error}</div>}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={loading}>
                        Отмена
                    </button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? (habit ? "Сохранение..." : "Создание...") : (habit ? "Сохранить" : "Создать")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal;
