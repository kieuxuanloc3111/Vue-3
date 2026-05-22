<script setup>

import {
    ref,
    onMounted
} from "vue";

import {
    useRouter
} from "vue-router";

import api from "../services/api";

const router = useRouter();

const histories = ref([]);

/*
|--------------------------------------------------------------------------
| LOAD HISTORY
|--------------------------------------------------------------------------
*/

const loadHistory = async () => {

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await api.get(

                "/student/history",

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        histories.value =
            response.data.data;

    } catch (error) {

        console.log(error);

        alert("Load history failed");
    }
};

/*
|--------------------------------------------------------------------------
| GO REVIEW
|--------------------------------------------------------------------------
*/

const goReview = (id) => {

    router.push(
        `/review/${id}`
    );
};

onMounted(() => {

    loadHistory();
});

</script>

<template>

    <div>

        <h1>
            Lịch sử làm bài
        </h1>

        <div
            v-for="history in histories"
            :key="history.id"

            style="
                border:1px solid #ccc;
                padding:20px;
                margin-bottom:20px;
            "
        >

            <h2>
                {{ history.exam?.title }}
            </h2>

            <p>
                Môn:
                {{ history.exam?.subject?.name }}
            </p>

            <p>
                Điểm:
                {{ history.score }}
            </p>

            <p>
                Số câu đúng:
                {{ history.correct_count }}
            </p>

            <p>
                Trạng thái:
                {{ history.status }}
            </p>

            <button
                @click="
                        goReview(
                            history.student_exam_id
                        )
                "
            >

                Xem chi tiết

            </button>

        </div>

    </div>

</template>