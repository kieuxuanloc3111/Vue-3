<script setup>

import { ref, onMounted }
from "vue";

import api
from "../services/api";
import { useRouter }
from "vue-router";

const exams = ref([]);
const router = useRouter();

const startExam = (id) => {

    router.push(`/exams/${id}`);
};
const loadExams = async () => {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await api.get(
                "/student/exams",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        exams.value =
            response.data.data;

    } catch (error) {

        console.log(error);

        alert("Load exams failed");
    }
};

onMounted(() => {

    loadExams();
});

</script>

<template>

    <div>

        <h1>Danh sách đề thi</h1>

        <div
            v-for="exam in exams"
            :key="exam.id"
            style="
                border:1px solid #ccc;
                padding:20px;
                margin-bottom:20px;
            "
        >

            <h2>
                {{ exam.title }}
            </h2>

            <p>
                Môn:
                {{ exam.subject.name }}
            </p>

            <p>
                Thời gian:
                {{ exam.duration_minutes }}
                phút
            </p>

            <button
                @click="startExam(exam.id)"
            >

                Bắt đầu thi

            </button>

        </div>

    </div>

</template>