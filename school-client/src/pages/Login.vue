<script setup>

import { ref } from "vue";

import api from "../services/api";

import { useAuthStore }
from "../stores/auth";

import { useRouter }
from "vue-router";

const email = ref("");

const password = ref("");

const authStore = useAuthStore();

const router = useRouter();

const login = async () => {

    try {

        const response =
            await api.post(
                "/auth/login",
                {
                    email: email.value,
                    password:
                        password.value,
                }
            );

        authStore.setAuth(
            response.data.token,
            response.data.user
        );

        router.push("/exams");

    } catch (error) {

        alert("Login failed");
    }
};

</script>

<template>

    <div>

        <h1>Login</h1>

        <input
            v-model="email"
            placeholder="Email"
        />

        <br /><br />

        <input
            v-model="password"
            type="password"
            placeholder="Password"
        />

        <br /><br />

        <button @click="login">

            Login

        </button>

    </div>

</template>