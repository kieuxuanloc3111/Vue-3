<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

const exams = ref([]);
const router = useRouter();
const authStore = useAuthStore();

const startExam = (id) => {
    router.push(`/exams/${id}`);
};

const loadExams = async () => {
    try {
        const response = await api.get(
            "/student/exams",
            {
                headers: {
                    Authorization:
                        `Bearer ${authStore.token}`,
                },
            }
        );

        exams.value =
            response.data.data;
    } catch (error) {
        console.log(error);
        alert("Tải danh sách đề thi thất bại");
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
            v-if="exams.length === 0"
            class="empty-state"
        >
            Chưa có đề thi nào.
        </div>

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
                <strong>Môn:</strong>
                {{ exam.subject?.name || "Chưa có môn học" }}
            </p>

            <p>
                <strong>Thời gian:</strong>
                {{ exam.duration_minutes }}
                phút
            </p>

            <button @click="startExam(exam.id)">
                Bắt đầu thi
            </button>
        </div>
    </div>
</template>
