<template>
  <div class="nodes">
    <div class="content">
      <header class="hero">
        <div class="hero-text">
          <h1>节点总览</h1>
          <p>
            当前共有
            {{ nodes.length }} 个节点。
          </p>
          <md-filled-tonal-button
            class="hero-btn"
            @click="showCreateDrawer = true"
          >
            新建节点
          </md-filled-tonal-button>
        </div>
        <div class="hero-image">
          <md-icon>hub</md-icon>
        </div>
      </header>

      <div class="nodes-grid">
        <div
          v-for="node in nodes"
          :key="node.id"
          class="node-card"
          @click="goToDetail(node.id)"
        >
          <div class="card-header">
            <h2>{{ node.name }}</h2>
            <span :class="['status-badge', node.status.status]">
              {{ node.status.status || "未知" }}
            </span>
          </div>

          <div class="card-content">
            <div class="info-item">
              <span class="label">版本:</span>
              <span>{{ node.status.version || "未知" }}</span>
            </div>
            <div class="info-item">
              <span class="label">最后在线:</span>
              <span>{{ formatDate(node.status.timestamp) }}</span>
            </div>
            <div class="info-item">
              <span class="label">CPU使用率:</span>
              <span>{{ node.status.metrics.cpu_usage }}%</span>
            </div>
            <div class="info-item">
              <span class="label">内存使用率:</span>
              <span>{{ node.status.metrics.memory_usage }}%</span>
            </div>
            <div class="info-item">
              <span class="label">IPv4:</span>
              <span>{{ node.ipv4 || "未设置" }}</span>
            </div>
            <div class="info-item">
              <span class="label">IPv6:</span>
              <span>{{ node.ipv6 || "未设置" }}</span>
            </div>
          </div>
        </div>
      </div>

      <create-node-drawer
        v-model:show="showCreateDrawer"
        @node-created="fetchNodes"
      />
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import CreateNodeDrawer from "./Nodes/CreateNodeDrawer.vue";

export default {
  name: "NodesView",
  components: {
    CreateNodeDrawer,
  },
  data() {
    return {
      nodes: [],
      showCreateDrawer: false,
    };
  },
  methods: {
    async fetchNodes() {
      try {
        const response = await api.get("/dashboard/nodes");
        this.nodes = response.data.sort((a, b) => a.id - b.id);
      } catch (error) {
        console.error("获取节点数据失败:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString || dateString === "0001-01-01T00:00:00Z") {
        return "未知";
      }
      return new Date(dateString).toLocaleString("zh-CN");
    },
    goToDetail(nodeId) {
      this.$router.push(`/nodes/detail/${nodeId}`);
    },
  },
  mounted() {
    this.fetchNodes();
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

.nodes {
  width: 100%;
  /* 如果需要垂直方向也占满可以加上 min-height: 100vh; */
  padding: 20px;
  margin: 0; /* 确保没有额外的页面边距 */
  box-sizing: border-box;
}

.content {
  width: 100%;
}

.hero {
  margin-bottom: 30px;
}

.hero-text {
  width: 100%;
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.node-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  background: #e0e0e0;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-item .label {
  width: 100px;
  color: #666;
}

/* 状态样式 */
.status-badge.online {
  background: #4caf50;
  color: white;
}

.status-badge.offline {
  background: #f44336;
  color: white;
}

.status-badge.error {
  background: #ff9800;
  color: white;
}
</style>
