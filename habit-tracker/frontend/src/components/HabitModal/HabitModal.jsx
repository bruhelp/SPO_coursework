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
    const [loading, setLoading] = useState(false);

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

    async function handleSubmit() {
        setError("");

        if (isEmpty(form.title)) return setError("Название обязательно");
        if (!isValidFrequency(form.frequencyType)) return setError("Неверная частота");
        if (!isValidGoalType(form.goalType)) return setError("Неверная цель");
        if (form.goalValue && !isPositiveInteger(Number(form.goalValue))) {
            return setError("Цель должна быть положительным числом");
        }

        setLoading(true);
        try {
            await createHabit({
                ...form,
                categoryId: form.categoryId ? Number(form.categoryId) : null,
                frequencyValue: Number(form.frequencyValue),
                goalValue: form.goalValue ? Number(form.goalValue) : null,
                goalDate: form.goalDate || null
            });

            onCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Ошибка создания привычки");
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
                    <h2>Новая привычка</h2>
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
                                <option value="">Без категории</option>
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
                            <label>Раз в период</label>
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
                        {loading ? "Создание..." : "Создать"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal;
