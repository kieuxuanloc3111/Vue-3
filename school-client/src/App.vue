<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const avatarLoadError = ref(false);

const userName = computed(() => authStore.user?.name || authStore.user?.email);

const userAvatar = computed(() => {
  const image =
    authStore.user?.image ||
    authStore.user?.avatar ||
    authStore.user?.photo ||
    authStore.user?.profile_photo_url;

  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const cleanPath = image.replace(/^\/+/, "");
  const path = cleanPath.startsWith("storage/")
    ? `/${cleanPath}`
    : `/storage/${cleanPath}`;

  return `http://school.test${path}`;
});

watch(userAvatar, () => {
  avatarLoadError.value = false;
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink to="/exams" class="brand">
        <span class="brand-mark">S</span>
        <span class="brand-text">School Exam</span>
      </RouterLink>

      <nav class="top-nav" aria-label="Account navigation">
        <RouterLink to="/register" class="top-link">Register</RouterLink>
        <RouterLink v-if="!authStore.token" to="/login" class="top-link primary">
          Login
        </RouterLink>

        <div v-else class="user-actions">
          <img
            v-if="userAvatar && !avatarLoadError"
            :src="userAvatar"
            :alt="userName || 'User avatar'"
            class="user-avatar"
            @error="avatarLoadError = true"
          />
          <span v-else class="user-avatar fallback">
            {{ userName?.charAt(0)?.toUpperCase() || "U" }}
          </span>
          <span class="user-name">{{ userName }}</span>
          <button type="button" class="top-link primary" @click="logout">
            Logout
          </button>
        </div>
      </nav>
    </header>

    <div class="main-layout">
      <aside class="left-sidebar" aria-label="Main navigation">
        <div class="sidebar-section">
          <p class="sidebar-title">Menu</p>

          <RouterLink to="/exams" class="sidebar-link">
            <span class="sidebar-icon">E</span>
            <span>Danh sách đề thi</span>
          </RouterLink>

          <RouterLink to="/history" class="sidebar-link">
            <span class="sidebar-icon">H</span>
            <span>Lịch sử làm bài</span>
          </RouterLink>
        </div>

        <div class="sidebar-panel">
          <p class="panel-title">Student Portal</p>
          <p class="panel-text">
            Theo dõi đề thi, làm bài và xem lại kết quả trong cùng một giao diện.
          </p>
        </div>
      </aside>

      <main class="page-content">
        <RouterView />
      </main>
    </div>

    <footer class="site-footer">
      <span>School Exam Client</span>
      <span>Vue 3 learning project</span>
    </footer>
  </div>
</template>
