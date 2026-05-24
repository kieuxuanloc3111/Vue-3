<script setup>

import { ref } from "vue";

import api from "../services/api";

import { useAuthStore } from "../stores/auth";

import { useRouter } from "vue-router";

const email = ref("");

const password = ref("");

const remember = ref(false);

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
                    remember:
                        remember.value,
                }
            );

        authStore.setAuth(
            response.data.token ||
            response.data.data?.token,

            response.data.user ||
            response.data.data?.user,

            remember.value
        );

        router.push("/exams");

    } catch (error) {

        alert("Đăng nhập thất bại");
    }
};

</script>

<template>

    <div>

        <h1>Đăng nhập</h1>

        <input
            v-model="email"
            placeholder="Email"
        />

        <br /><br />

        <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
        />

        <br /><br />

        <label class="remember-field">

            <input
                v-model="remember"
                type="checkbox"
            />

            <span>
                Ghi nhớ đăng nhập
            </span>

        </label>

        <br /><br />

        <button @click="login">

            Đăng nhập

        </button>

    </div>

</template>
