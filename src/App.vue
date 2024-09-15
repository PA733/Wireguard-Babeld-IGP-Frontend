<template>
  <div class="layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.path">
              <md-text-button :class="{ active: isActive(item.path) }">
                <md-icon>{{ item.icon }}</md-icon>
              </md-text-button>
              <a>{{ item.label }}</a>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="theme-toggle">
        <button>🌙</button>
      </div>
    </aside>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { label: "Home", path: "/", icon: "home" },
        { label: "About", path: "/about", icon: "info" },
      ],
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>
