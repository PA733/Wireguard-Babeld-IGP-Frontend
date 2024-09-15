<template>
  <div class="layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            @mouseenter="showSubmenu(index)"
            @mouseleave="hideSubmenu"
          >
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

    <!-- 二级菜单 sub-sidebar，增加鼠标进入和离开的事件监听 -->
    <aside
      class="sub-sidebar"
      v-if="activeSubmenu !== null"
      @mouseenter="keepSubmenuOpen"
      @mouseleave="hideSubmenu"
    >
      <nav>
        <ul>
          <li
            v-for="(subItem, index) in menuItems[activeSubmenu].subItems"
            :key="index"
          >
            <router-link :to="subItem.path">
              <md-text-button :class="{ active: isActive(subItem.path) }">
                <md-icon>{{ subItem.icon }}</md-icon>
              </md-text-button>
              <a>{{ subItem.label }}</a>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {
          label: "Home",
          path: "/",
          icon: "home",
          subItems: [], // 无二级菜单
        },
        {
          label: "About",
          path: "/about",
          icon: "info",
          subItems: [
            { label: "Team", path: "/about/team", icon: "group" },
            { label: "Mission", path: "/about/mission", icon: "flag" },
          ], // 有二级菜单
        },
        {
          label: "About",
          path: "/about",
          icon: "info",
          subItems: [
            { label: "AAA", path: "/about/team", icon: "group" },
            { label: "Mission", path: "/about/mission", icon: "flag" },
          ], // 有二级菜单
        },
      ],
      activeSubmenu: null, // 当前显示的二级菜单
      submenuTimer: null, // 用于延迟显示/隐藏的定时器
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    showSubmenu(index) {
      // 清除隐藏的定时器，以防止快速切换时菜单消失
      clearTimeout(this.submenuTimer);
      // 延迟显示二级菜单
      this.submenuTimer = setTimeout(() => {
        if (
          this.menuItems[index].subItems &&
          this.menuItems[index].subItems.length
        ) {
          this.activeSubmenu = index;
        }
      }, 200); // 延迟200ms显示二级菜单
    },
    hideSubmenu() {
      // 延迟隐藏二级菜单
      this.submenuTimer = setTimeout(() => {
        this.activeSubmenu = null;
      }, 300); // 延迟300ms隐藏二级菜单
    },
    keepSubmenuOpen() {
      // 鼠标进入 sub-sidebar 时清除隐藏定时器
      clearTimeout(this.submenuTimer);
    },
  },
};
</script>
