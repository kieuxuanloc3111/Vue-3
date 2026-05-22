<script setup>

import {
    useRouter,
    useRoute
} from "vue-router";

import {
    ref,
    onMounted,
    onUnmounted
} from "vue";

import api from "../services/api";
import {
    useAuthStore
} from "../stores/auth";

const route = useRoute();

const router = useRouter();
const authStore = useAuthStore();

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const exam = ref(null);

const studentExamId = ref(null);

const selectedAnswers = ref({});

const remainingSeconds = ref(0);

const isSubmitting = ref(false);

/*
|--------------------------------------------------------------------------
| TIMER
|--------------------------------------------------------------------------
*/

let timer = null;

/*
|--------------------------------------------------------------------------
| CHẶN RELOAD / CLOSE TAB
|--------------------------------------------------------------------------
|
| Browser sẽ hiện popup:
| "Bạn có chắc muốn rời khỏi trang?"
|
*/

const handleBeforeUnload = (event) => {

    event.preventDefault();

    event.returnValue = '';
};

/*
|--------------------------------------------------------------------------
| CHẶN NÚT BACK
|--------------------------------------------------------------------------
|
| Fake history để browser không back được
|
*/

const preventBack = () => {

    window.history.pushState(
        null,
        '',
        window.location.href
    );
};

/*
|--------------------------------------------------------------------------
| COUNTDOWN
|--------------------------------------------------------------------------
*/

const startCountdown = (endTime) => {

    /*
    |--------------------------------------------------------------------------
    | CLEAR TIMER CŨ
    |--------------------------------------------------------------------------
    */

    if (timer !== null) {

        clearInterval(timer);

        timer = null;
    }

    const updateCountdown = () => {

        const now = new Date();

        const diff = Math.max(
            0,
            Math.floor(
                (endTime - now) / 1000
            )
        );

        remainingSeconds.value = diff;

        /*
        |--------------------------------------------------------------------------
        | HẾT GIỜ -> AUTO SUBMIT
        |--------------------------------------------------------------------------
        */

        if (diff === 0) {

            clearInterval(timer);

            timer = null;

            if (!isSubmitting.value) {

                submitExam();
            }
        }
    };

    /*
    |--------------------------------------------------------------------------
    | CHẠY NGAY LẦN ĐẦU
    |--------------------------------------------------------------------------
    */

    updateCountdown();

    /*
    |--------------------------------------------------------------------------
    | UPDATE MỖI GIÂY
    |--------------------------------------------------------------------------
    */

    timer = setInterval(
        updateCountdown,
        1000
    );
};

/*
|--------------------------------------------------------------------------
| FORMAT MM:SS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| LOAD EXAM
|--------------------------------------------------------------------------
*/

const loadExam = async () => {

    try {

        const response =
            await api.post(

                `/student/exams/${route.params.id}/start`,

                {},

                {
                    headers: {
                        Authorization:
                            `Bearer ${authStore.token}`,
                    },
                }
            );

        /*
        |--------------------------------------------------------------------------
        | EXAM DATA
        |--------------------------------------------------------------------------
        */

        exam.value =
            response.data.data;

        studentExamId.value =
            response.data.student_exam_id;

        /*
        |--------------------------------------------------------------------------
        | TIMER
        |--------------------------------------------------------------------------
        */

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

/*
|--------------------------------------------------------------------------
| SUBMIT EXAM
|--------------------------------------------------------------------------
*/

const submitExam = async () => {

    /*
    |--------------------------------------------------------------------------
    | CHỐNG DOUBLE SUBMIT
    |--------------------------------------------------------------------------
    */

    if (isSubmitting.value)
        return;

    isSubmitting.value = true;

    try {

        const answers = [];

        /*
        |--------------------------------------------------------------------------
        | CONVERT OBJECT -> ARRAY
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | API SUBMIT
        |--------------------------------------------------------------------------
        */

        await api.post(

            `/student/student-exams/${studentExamId.value}/submit`,

            {
                answers,
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${authStore.token}`,
                },
            }
        );

        /*
        |--------------------------------------------------------------------------
        | CLEAR TIMER
        |--------------------------------------------------------------------------
        */

        if (timer) {

            clearInterval(timer);

            timer = null;
        }

        /*
        |--------------------------------------------------------------------------
        | CHUYỂN SANG REVIEW
        |--------------------------------------------------------------------------
        */

        router.push(
            `/review/${studentExamId.value}`
        );

    } catch (error) {

        console.log(error);

        alert("Submit failed");

        isSubmitting.value = false;
    }
};

/*
|--------------------------------------------------------------------------
| MOUNT
|--------------------------------------------------------------------------
*/

onMounted(() => {

    /*
    |--------------------------------------------------------------------------
    | LOAD EXAM
    |--------------------------------------------------------------------------
    */

    loadExam();

    /*
    |--------------------------------------------------------------------------
    | CHẶN RELOAD
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
        'beforeunload',
        handleBeforeUnload
    );

    /*
    |--------------------------------------------------------------------------
    | CHẶN BACK
    |--------------------------------------------------------------------------
    */

    preventBack();

    window.onpopstate = () => {

        preventBack();
    };
});

/*
|--------------------------------------------------------------------------
| UNMOUNT
|--------------------------------------------------------------------------
*/

onUnmounted(() => {

    /*
    |--------------------------------------------------------------------------
    | CLEAR TIMER
    |--------------------------------------------------------------------------
    */

    if (timer) {

        clearInterval(timer);

        timer = null;
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE EVENT
    |--------------------------------------------------------------------------
    */

    window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
    );

    window.onpopstate = null;
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
            v-for="(question, index) in exam.questions"
            :key="question.id"

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

                    <span
                        class="rich-content answer-content"
                        v-html="answer.content"
                    />

                </label>

            </div>

        </div>

        <button
            type="button"

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
