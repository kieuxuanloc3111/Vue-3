<script setup>
import { RouterView } from "vue-router";
import AppFooter from "./components/layout/AppFooter.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <div class="main-layout">
      <AppSidebar />

      <main class="page-content">
        <RouterView />
      </main>
    </div>

    <AppFooter />
  </div>
</template>
