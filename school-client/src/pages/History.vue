<script setup>
import { onMounted, ref,computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const histories = ref([]);
const selectedSubject = ref("");

const selectedDate = ref("");
const getExamTitle = (history) => {
    return history.exam_title || history.exam?.title || "Chưa có tên đề thi";
};

const getSubjectName = (history) => {
    return history.subject || history.exam?.subject?.name || "Chưa có môn học";
};

const getStatus = (history) => {
    if (history.status === "submitted" || history.submitted_at) {
        return "Đã nộp bài";
    }

    return history.status || "Chưa có trạng thái";
};
const subjects = computed(() => {

    const uniqueSubjects = [];

    histories.value.forEach((history) => {

        const subjectName =
            getSubjectName(history);

        const exists =
            uniqueSubjects.find(
                item => item === subjectName
            );

        if (!exists) {

            uniqueSubjects.push(
                subjectName
            );
        }
    });

    return uniqueSubjects;
});
const filteredHistories = computed(() => {

    return histories.value.filter(
        (history) => {

            /*
            |--------------------------------------------------------------------------
            | FILTER SUBJECT
            |--------------------------------------------------------------------------
            */

            const subjectMatch =

                !selectedSubject.value ||

                getSubjectName(history)
                    === selectedSubject.value;

            /*
            |--------------------------------------------------------------------------
            | FILTER DATE
            |--------------------------------------------------------------------------
            */

            let dateMatch = true;

            if (selectedDate.value) {

                const historyDate =
                    new Date(
                        normalizeApiDate(
                            history.submitted_at
                        )
                    );

                const yyyy =
                    historyDate.getFullYear();

                const mm =
                    String(
                        historyDate.getMonth() + 1
                    ).padStart(2, "0");

                const dd =
                    String(
                        historyDate.getDate()
                    ).padStart(2, "0");

                const formattedDate =
                    `${yyyy}-${mm}-${dd}`;

                dateMatch =
                    formattedDate
                    === selectedDate.value;
            }

            return (
                subjectMatch &&
                dateMatch
            );
        }
    );
});
const normalizeApiDate = (date) => {
    if (typeof date !== "string") {
        return date;
    }

    const hasTimezone =
        /z$/i.test(date) ||
        /[+-]\d{2}:\d{2}$/.test(date);

    if (hasTimezone) {
        return date;
    }

    return `${date.replace(" ", "T")}Z`;
};

const formatDate = (date) => {
    if (!date) {
        return "Chưa có thời gian";
    }

    return new Date(normalizeApiDate(date))
        .toLocaleString(
            "vi-VN",
            {
                timeZone: "Asia/Ho_Chi_Minh",
                hour12: false,
            }
        );
};

const loadHistory = async () => {
    try {
        const response = await api.get(
            "/student/history",
            {
                headers: {
                    Authorization:
                        `Bearer ${authStore.token}`,
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

const goReview = (id) => {
    router.push(`/review/${id}`);
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
        <div class="filter-box">

            <div class="filter-group">

                <label>
                    Môn học
                </label>

                <select
                    v-model="selectedSubject"
                >
                    <option value="">
                        Tất cả môn học
                    </option>

                    <option
                        v-for="subject in subjects"
                        :key="subject"
                        :value="subject"
                    >
                        {{ subject }}
                    </option>

                </select>

            </div>

            <div class="filter-group">

                <label>
                    Ngày thi
                </label>

                <input
                    type="date"
                    v-model="selectedDate"
                />

            </div>

        </div>
        <div
            v-if="histories.length === 0"
            class="empty-state"
        >
            Chưa có bài thi đã nộp.
        </div>

        <div
            v-for="history in filteredHistories"
            :key="
                history.student_exam_id ||
                history.id
            "
            style="
                border:1px solid #ccc;
                padding:20px;
                margin-bottom:20px;
            "
        >
            <h2>
                {{ getExamTitle(history) }}
            </h2>

            <p>
                <strong>Môn:</strong>
                {{ getSubjectName(history) }}
            </p>

            <p>
                <strong>Điểm:</strong>
                {{ history.score }}
            </p>

            <p>
                <strong>Số câu đúng:</strong>
                {{ history.correct_count }}
            </p>

            <p>
                <strong>Trạng thái:</strong>
                {{ getStatus(history) }}
            </p>

            <p>
                <strong>Thời gian nộp:</strong>
                {{ formatDate(history.submitted_at) }}
            </p>

            <button
                @click="
                    goReview(
                        history.student_exam_id ||
                        history.id
                    )
                "
            >
                Xem chi tiết
            </button>
        </div>
    </div>
</template>
