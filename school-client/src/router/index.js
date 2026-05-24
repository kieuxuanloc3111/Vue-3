import { createRouter,
createWebHistory }
from "vue-router";

import Login
from "../pages/Login.vue";

import Home
from "../pages/Home.vue";

import Register
from "../pages/Register.vue";
import ExamList
from "../pages/ExamList.vue";
import ExamDoing
from "../pages/ExamDoing.vue";
import Review
from "../pages/Review.vue";
import History
from "../pages/History.vue";
const router = createRouter({

    history:
        createWebHistory(),

    routes: [

        {
            path: "/",
            component: Home,
            meta: {
                guestOnly: true,
            },
        },

        {
            path: "/login",
            component: Login,
            meta: {
                guestOnly: true,
            },
        },

        {
            path: "/register",
            component: Register,
            meta: {
                guestOnly: true,
            },
        },
        {
            path: "/exams",
            component: ExamList,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/exams/:id",
            component: ExamDoing,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/review/:id",
            component: Review,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/history",
            component: History,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach((to) => {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (to.meta.requiresAuth && !token) {

        return "/";
    }

    if (to.meta.guestOnly && token) {

        return "/exams";
    }

    return true;
});

export default router;
