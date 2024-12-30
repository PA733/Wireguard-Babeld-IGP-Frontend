<template>
  <div class="home">
    <div class="content">
      <header class="hero">
        <div class="hero-text">
          <h1>IGP 管理系统</h1>
          <p>
            IGP 管理系统是一个 Wireguard 和 Babeld
            的配置文件管理平台，它可以帮助您更方便地管理您的网络设备。
          </p>
          <md-filled-tonal-button
            @click="this.$router.push(`/nodes`)"
            class="hero-btn"
            >快速开始</md-filled-tonal-button
          >
        </div>
        <div class="hero-image"></div>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
