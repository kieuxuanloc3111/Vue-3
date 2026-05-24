<template>
  <section class="home-page">
    <div class="home-hero">
      <div class="home-copy">
        <p class="home-eyebrow">Cổng thi trực tuyến dành cho học sinh</p>

        <h1>
          Học tập, làm bài kiểm tra và xem kết quả trong một hệ thống thống nhất.
        </h1>

        <p class="home-description">
          School Exam hỗ trợ học sinh truy cập danh sách đề thi, làm bài theo thời
          gian quy định và xem lại kết quả sau khi nộp bài.
        </p>

        <div class="home-actions">
          <RouterLink to="/register" class="home-button primary">
            Đăng ký tài khoản
          </RouterLink>

          <RouterLink to="/login" class="home-button">
            Đăng nhập
          </RouterLink>
        </div>
      </div>

      <div class="home-visual" aria-label="Minh họa hệ thống thi trực tuyến">
        <div class="school-card">
          <div class="school-card-header">
            <span />
            <span />
            <span />
          </div>

          <div class="school-board">
            <div class="board-line wide" />
            <div class="board-line" />
            <div class="board-line short" />
          </div>

          <div class="school-stats">
            <div>
              <strong>24/7</strong>
              <span>Truy cập</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Lưu kết quả</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-features">
      <article>
        <h2>Làm bài dễ dàng</h2>
        <p>Giao diện rõ ràng, có đồng hồ đếm ngược và lưu lựa chọn câu trả lời.</p>
      </article>

      <article>
        <h2>Xem lại kết quả</h2>
        <p>Theo dõi điểm số, số câu đúng và xem lại từng câu sau khi nộp bài.</p>
      </article>

      <article>
        <h2>Hỗ trợ nội dung phong phú</h2>
        <p>Hiển thị câu hỏi có hình ảnh, công thức và nội dung từ trình soạn thảo.</p>
      </article>
    </div>
  </section>
</template>
