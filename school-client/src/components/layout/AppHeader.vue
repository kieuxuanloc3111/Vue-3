<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

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
  router.push("/");
};
</script>

<template>
  <header class="site-header">
    <RouterLink :to="authStore.token ? '/exams' : '/'" class="brand">
      <span class="brand-mark">S</span>
      <span class="brand-text">Trường học trực tuyến</span>
    </RouterLink>

    <nav class="top-nav" aria-label="Account navigation">
      <RouterLink v-if="!authStore.token" to="/register" class="top-link">
        Đăng ký
      </RouterLink>
      <RouterLink v-if="!authStore.token" to="/login" class="top-link primary">
        Đăng nhập
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
          Đăng xuất
        </button>
      </div>
    </nav>
  </header>
</template>
