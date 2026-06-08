import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

import "./RegisterPage.css";

function RegisterPage() {

    const navigate =
        useNavigate();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        try {

            await register({

                username,
                email,
                password

            });

            navigate("/login");

        }
        catch (error) {

            setError(

                error.response?.data?.message
                ||
                "Registration failed."

            );

        }

    }

    return (

        <div className="auth-page">

            <div className="auth-container">

                <h1 className="auth-title">
                    Habit Tracker
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={
                            (e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={
                            (e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={
                            (e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    {

                        error &&
                        <div className="auth-error">
                            {error}
                        </div>

                    }

                    <button type="submit">
                        Register
                    </button>

                </form>

                <div className="auth-footer">

                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default RegisterPage;