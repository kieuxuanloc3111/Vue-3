<script setup>
import { RouterView } from "vue-router";
import AppFooter from "./components/layout/AppFooter.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <div
      class="main-layout"
      :class="{ 'no-sidebar': !authStore.token }"
    >
      <AppSidebar v-if="authStore.token" />

      <main class="page-content">
        <RouterView />
      </main>
    </div>

    <AppFooter />
  </div>
</template>
