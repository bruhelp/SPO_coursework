import {
    createContext,
    useState
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
        useState(
            storage.getToken()
        );

    /*
        Восстановление сессии
        после обновления страницы.
    */


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