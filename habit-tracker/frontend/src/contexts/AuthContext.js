import {
    createContext,
    useState,
    useEffect
} from "react";

import storage
from "../services/localStorageService";

export const AuthContext =
    createContext();

export function AuthProvider(
    {
        children
    }
) {

    const [token, setToken] =
        useState(null);

    /*
        Восстановление сессии
        после обновления страницы.
    */

    useEffect(() => {

        const savedToken =
            storage.getToken();

        if (
            savedToken
        ) {

            setToken(
                savedToken
            );

        }

    }, []);

    /*
        Авторизация.
    */

    function login(
        accessToken
    ) {

        storage.saveToken(
            accessToken
        );

        setToken(
            accessToken
        );

    }

    /*
        Выход пользователя.
    */

    function logout() {

        storage.removeToken();

        setToken(
            null
        );

    }

    return (

        <AuthContext.Provider

            value={{

                token,

                isAuthenticated:
                    token !== null,

                login,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}