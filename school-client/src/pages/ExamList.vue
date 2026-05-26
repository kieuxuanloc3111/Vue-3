<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
const exams = ref([]);
const router = useRouter();
const authStore = useAuthStore();

const startExam = (id) => {
    router.push(`/exams/${id}`);
};
const selectedSubject = ref("");
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
const subjects = computed(() => {

    const uniqueSubjects = [];

    exams.value.forEach((exam) => {

        const subject = exam.subject;

        if (!subject)
            return;

        const exists =
            uniqueSubjects.find(
                item => item.id === subject.id
            );

        if (!exists) {

            uniqueSubjects.push(subject);
        }
    });

    return uniqueSubjects;
});
const filteredExams = computed(() => {

    if (!selectedSubject.value) {

        return exams.value;
    }

    return exams.value.filter((exam) => {

        return (
            exam.subject?.id ==
            selectedSubject.value
        );
    });
});
onMounted(() => {
    loadExams();
});
</script>

<template>
    <div>
        <h1>Danh sách đề thi</h1>
        <div class="filter-box">

            <label>
                Lọc theo môn:
            </label>

            <select v-model="selectedSubject">

                <option value="">
                    Tất cả môn học
                </option>

                <option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :value="subject.id"
                >
                    {{ subject.name }}
                </option>

            </select>

        </div>
        <div
        
            v-if="exams.length === 0"
            class="empty-state"
        >
            Chưa có đề thi nào.
        </div>

        <div
            v-for="exam in filteredExams"
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
