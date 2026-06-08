import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    login as loginRequest
} from "../api/authApi";

import useAuth from "../hooks/useAuth";

import "./LoginPage.css";

function LoginPage() {

    const navigate =
        useNavigate();

    const {
        login: authLogin
    } = useAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setError("");

        try {

            const response =
                await loginRequest({

                    email,
                    password

                });

            authLogin(
                response.accessToken
            );

            navigate("/");

        }
        catch (error) {

            setError(

                error.response
                    ?.data
                    ?.message

                ||

                "Login failed."

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
                    onSubmit={
                        handleSubmit
                    }
                    className="auth-form"
                >

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
                        <div
                            className="auth-error"
                        >
                            {error}
                        </div>
                    }

                    <button
                        type="submit"
                    >
                        Login
                    </button>

                </form>

                <div className="auth-footer">

                    Don't have an account?

                    <Link
                        to="/register"
                    >
                        Register
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default LoginPage;