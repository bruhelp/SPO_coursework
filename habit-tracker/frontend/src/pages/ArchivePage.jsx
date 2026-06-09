import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoriesApi";
import { getHabits } from "../api/habitsApi";
import "./ArchivePage.css";

function ArchivePage() {
    const [habits, setHabits] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadArchive() {
            try {
                const [habitData, categoryData] = await Promise.all([
                    getHabits({ includeArchived: true }),
                    getCategories()
                ]);

                setHabits(habitData.filter(habit => habit.status === "archived" || habit.status === "completed"));
                setCategories(categoryData);
            } catch (error) {
                console.log(error);
            }
        }

        loadArchive();
    }, []);

    const categoriesById = useMemo(() => {
        return categories.reduce((accumulator, category) => {
            accumulator[category.id] = category.name;
            return accumulator;
        }, {});
    }, [categories]);

    return (
        <div className="archive-page">
            <h1>Архив</h1>
            <p><Link to="/">← Назад к привычкам</Link></p>

            {habits.length === 0 ? (
                <div className="archive-empty">Архивных привычек пока нет.</div>
            ) : (
                <div className="archive-list">
                    {habits.map(habit => (
                        <article key={habit.id} className="archive-item">
                            <div className="archive-item-header">
                                <div className="archive-item-title">{habit.title}</div>
                                <div className="archive-item-status">{habit.status}</div>
                            </div>
                            {habit.description && <div className="archive-item-description">{habit.description}</div>}
                            <div className="archive-item-description">
                                {categoriesById[habit.category_id] || `Категория #${habit.category_id}`}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArchivePage;