<template>
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
</template>
