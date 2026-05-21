import { createRouter,
createWebHistory }
from "vue-router";

import Login
from "../pages/Login.vue";

import Register
from "../pages/Register.vue";
import ExamList
from "../pages/ExamList.vue";
const router = createRouter({

    history:
        createWebHistory(),

    routes: [

        {
            path: "/login",
            component: Login,
        },

        {
            path: "/register",
            component: Register,
        },
        {
            path: "/exams",
            component: ExamList,
        }
    ],
});

export default router;