<script setup>

import { ref, onMounted }
from "vue";

import { useRoute }
from "vue-router";

import api
from "../services/api";
import {
    useAuthStore
} from "../stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const review = ref(null);

const loadReview = async () => {

    try {

        const response =
            await api.get(

                `/student/student-exams/${route.params.id}/review`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${authStore.token}`,
                    },
                }
            );

        review.value =
            response.data.data;

    } catch (error) {

        console.log(error);

        alert("Load review failed");
    }
};

onMounted(() => {

    loadReview();
});

</script>

<template>

    <div v-if="review">

        <h1>

            Kết quả bài thi

        </h1>

        <h2>
            Điểm:
            {{ review.score }}
        </h2>

        <h3>
            Đúng:
            {{ review.correct_count }}
        </h3>

        <div
            v-for="(question, index) in review.questions"
            :key="question.question_id"

            style="
                border:1px solid #ccc;
                padding:20px;
                margin-bottom:20px;
            "
        >

            <div class="question-heading">
                Câu {{ index + 1 }}
            </div>

            <div
                class="rich-content question-content"
                v-html="question.content"
            />

            <div
                v-for="answer in question.answers"
                :key="answer.id"
            >

                <div
                    :style="{

                        backgroundColor:

                            answer.is_correct
                            ? '#90EE90'

                            : answer.id ===
                              question.selected_answer_id

                            ? '#ffb3b3'

                            : ''
                    }"

                    style="
                        padding:10px;
                        margin-bottom:5px;
                    "
                >
                    <div
                        class="rich-content answer-content"
                        v-html="answer.content"
                    />

                </div>

            </div>

            <p>

                <strong>
                    Giải thích:
                </strong>

                <span
                    class="rich-content explanation-content"
                    v-html="question.explanation"
                />

            </p>

        </div>

    </div>

</template>
