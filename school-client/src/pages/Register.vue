<script setup>

import { ref } from "vue";

import api from "../services/api";

import { useRouter }
from "vue-router";

const name = ref("");

const email = ref("");

const password = ref("");

const router = useRouter();

const register = async () => {

    try {

        await api.post(
            "/auth/register",
            {
                name: name.value,
                email: email.value,
                password:
                    password.value,
            }
        );

        alert("Register success");

        router.push("/login");

    } catch (error) {

        alert("Register failed");
    }
};

</script>

<template>

    <div>

        <h1>Register</h1>

        <input
            v-model="name"
            placeholder="Name"
        />

        <br /><br />

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

        <button @click="register">

            Register

        </button>

    </div>

</template>