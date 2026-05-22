import { defineStore } from "pinia";

const getStoredUser = () => {

    const user =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

export const useAuthStore =
defineStore("auth", {

    state: () => ({

        token:
            localStorage.getItem(
                "token"
            ) ||
            sessionStorage.getItem(
                "token"
            ) ||
            null,

        user: getStoredUser(),
    }),

    actions: {

        setAuth(token, user, remember = false) {

            this.token = token;
            this.user = user;

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            sessionStorage.removeItem(
                "token"
            );

            sessionStorage.removeItem(
                "user"
            );

            const storage =
                remember
                    ? localStorage
                    : sessionStorage;

            storage.setItem(
                "token",
                token
            );

            storage.setItem(
                "user",
                JSON.stringify(user)
            );
        },

        logout() {

            this.token = null;
            this.user = null;

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            sessionStorage.removeItem(
                "token"
            );

            sessionStorage.removeItem(
                "user"
            );
        }
    }
});
