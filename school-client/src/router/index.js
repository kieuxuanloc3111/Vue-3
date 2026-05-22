import { createRouter,
createWebHistory }
from "vue-router";

import Login
from "../pages/Login.vue";

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
        },
        {
            path: "/exams/:id",
            component: ExamDoing,
        },
        {
            path: "/review/:id",
            component: Review,
        },
        {
            path: "/history",
            component: History,
        },
    ],
});

export default router;