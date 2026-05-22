<script setup>

import { ref, onMounted }
from "vue";

import { useRoute }
from "vue-router";

import api
from "../services/api";

const route = useRoute();

const review = ref(null);

const loadReview = async () => {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await api.get(

                `/student/student-exams/${route.params.id}/review`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
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
            v-for="question in review.questions"
            :key="question.question_id"

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

                    {{ answer.content }}

                </div>

            </div>

            <p>

                <strong>
                    Giải thích:
                </strong>

                {{ question.explanation }}

            </p>

        </div>

    </div>

</template>