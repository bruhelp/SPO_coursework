import {
    Routes,
    Route
} from "react-router-dom";

import LoginPage
from "./pages/LoginPage";

import RegisterPage
from "./pages/RegisterPage";

import HomePage
from "./pages/HomePage";

import ArchivePage
from "./pages/ArchivePage";

import NotFoundPage
from "./pages/NotFoundPage";

import PrivateRoute
from "./components/PrivateRoute/PrivateRoute";

function App() {

    return (

        <Routes>

            <Route
                path="/login"
                element={
                    <LoginPage />
                }
            />

            <Route
                path="/register"
                element={
                    <RegisterPage />
                }
            />

            <Route

                path="/"

                element={

                    <PrivateRoute>

                        <HomePage />

                    </PrivateRoute>

                }

            />

            <Route

                path="/archive"

                element={

                    <PrivateRoute>

                        <ArchivePage />

                    </PrivateRoute>

                }

            />

            <Route

                path="*"

                element={
                    <NotFoundPage />
                }

            />

        </Routes>

    );

}

export default App;