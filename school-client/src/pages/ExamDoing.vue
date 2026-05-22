<script setup>
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

import {
    ref,
    onMounted,
    onUnmounted
} from "vue";

import api from "../services/api";

const route = useRoute();
const router = useRouter();

const exam = ref(null);

const studentExamId = ref(null);

const selectedAnswers = ref({});

const remainingSeconds = ref(0);

const isSubmitting = ref(false);

let timer = null;

const startCountdown = (endTime) => {

    timer = setInterval(() => {

        const now = new Date();

        const diff = Math.floor(
            (endTime - now) / 1000
        );

        if (diff <= 0) {

            clearInterval(timer);

            remainingSeconds.value = 0;

            submitExam();

            return;
        }

        remainingSeconds.value = diff;

    }, 1000);
};

const formatTime = () => {

    const minutes = Math.floor(
        remainingSeconds.value / 60
    );

    const seconds =
        remainingSeconds.value % 60;

    return `${minutes}:${
        seconds
            .toString()
            .padStart(2, '0')
    }`;
};

const loadExam = async () => {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await api.post(

                `/student/exams/${route.params.id}/start`,

                {},

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        exam.value =
            response.data.data;

        studentExamId.value =
            response.data
                .student_exam_id;

        const startedAt =
            new Date(
                response.data.started_at
            );

        const durationMinutes =
            response.data
                .data
                .duration_minutes;

        const endTime =
            new Date(
                startedAt.getTime()
                +
                durationMinutes
                * 60
                * 1000
            );

        startCountdown(endTime);

    } catch (error) {

        console.log(error);

        alert("Load exam failed");
    }
};

const submitExam = async () => {

    if (isSubmitting.value)
        return;

    isSubmitting.value = true;

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const answers = [];

        for (
            const questionId
            in selectedAnswers.value
        ) {

            answers.push({

                question_id:
                    questionId,

                answer_id:
                    selectedAnswers.value[
                        questionId
                    ],
            });
        }

        await api.post(

            `/student/student-exams/${studentExamId.value}/submit`,

            {
                answers,
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        if (timer) {

            clearInterval(timer);
        }

        router.push(
            `/review/${studentExamId.value}`
        );

    } catch (error) {

        console.log(error);

        alert("Submit failed");

        isSubmitting.value = false;
    }
};

onMounted(() => {

    loadExam();
});

onUnmounted(() => {

    if (timer) {

        clearInterval(timer);
    }
});

</script>

<template>

    <div v-if="exam">

        <h1>
            {{ exam.title }}
        </h1>

        <h2>

            Thời gian còn lại:

            {{ formatTime() }}

        </h2>

        <div
            v-for="question in exam.questions"
            :key="question.id"
            style="
                border:1px solid #ccc;
                padding:20px;
                margin-bottom:20px;
            "
        >

            <h3>
                {{ question.content }}
            </h3>

            <div
                v-for="answer in question.answers"
                :key="answer.id"
            >

                <label>

                    <input
                        type="radio"

                        :name="
                            'question-' +
                            question.id
                        "

                        :value="answer.id"

                        v-model="
                            selectedAnswers[
                                question.id
                            ]
                        "
                    />

                    {{ answer.content }}

                </label>

            </div>

        </div>

        <button
            @click="submitExam"
            :disabled="isSubmitting"
        >

            {{
                isSubmitting
                    ? 'Đang nộp bài...'
                    : 'Nộp bài'
            }}

        </button>

    </div>

</template>