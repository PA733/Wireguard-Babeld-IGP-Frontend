<template>
  <div class="home">
    <div class="content">
      <header class="hero">
        <div class="hero-text">
          <h1>Material Design</h1>
          <p>
            Material 3 is the latest version of Google's open-source design
            system. Design and build beautiful, usable products with Material 3.
          </p>
          <button class="hero-btn">Get started</button>
        </div>
        <div class="hero-image">
          <img src="abstract-design.png" alt="Abstract Design" />
        </div>
      </header>

      <section class="news-launches">
        <h2>News & launches</h2>
        <div class="news-items">
          <div class="news-item" style="background-color: #cffccf"></div>
          <div class="news-item" style="background-color: #ffd6a5"></div>
          <div class="news-item" style="background-color: #9bf6ff"></div>
          <div class="news-item" style="background-color: #ffadad"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
