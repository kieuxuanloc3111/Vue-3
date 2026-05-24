<script setup>

import { ref } from "vue";

import api from "../services/api";

import { useRouter }
from "vue-router";

const name = ref("");

const email = ref("");

const password = ref("");

const image = ref(null);

const imagePreview = ref("");

const router = useRouter();

const handleImageChange = (event) => {

    const file =
        event.target.files?.[0];

    image.value =
        file || null;

    imagePreview.value =
        file
            ? URL.createObjectURL(file)
            : "";
};

const register = async () => {

    try {

        const formData =
            new FormData();

        formData.append(
            "name",
            name.value
        );

        formData.append(
            "email",
            email.value
        );

        formData.append(
            "password",
            password.value
        );

        formData.append(
            "role",
            "student"
        );

        if (image.value) {

            formData.append(
                "image",
                image.value
            );
        }

        await api.post(
            "/auth/register",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        alert("Đăng ký thành công");

        router.push("/login");

    } catch (error) {

        alert("Đăng ký thất bại");
    }
};

</script>

<template>

    <div>

        <h1>Đăng ký tài khoản học sinh</h1>

        <input
            v-model="name"
            placeholder="Họ và tên"
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
            placeholder="Mật khẩu"
        />

        <br /><br />

        <label class="upload-field">

            <span>
                Ảnh đại diện
            </span>

            <input
                type="file"
                accept="image/*"
                @change="handleImageChange"
            />

        </label>

        <div
            v-if="imagePreview"
            class="avatar-preview"
        >

            <img
                :src="imagePreview"
                alt="Avatar preview"
            />

            <span>
                {{ image?.name }}
            </span>

        </div>

        <br /><br />

        <button @click="register">

            Đăng ký

        </button>

    </div>

</template>
