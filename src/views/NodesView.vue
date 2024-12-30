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

      <div
        class="drawer-mask"
        v-if="showCreateDrawer"
        @click="showCreateDrawer = false"
      ></div>
      <div class="drawer" :class="{ 'drawer-open': showCreateDrawer }">
        <div class="drawer-header">
          <h2>新建节点</h2>
          <button class="close-btn" @click="showCreateDrawer = false">
            &times;
          </button>
        </div>

        <div class="drawer-content">
          <div class="form-group">
            <md-outlined-text-field
              @change="newNode.Name = $event.target.value"
              label="节点名称"
              required
              v-bind:error="name_error"
              error-text="节点名称不能为空"
              placeholder="请输入节点名称"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              @change="newNode.Endpoint = $event.target.value"
              label="连接端点"
              required
              v-bind:error="endpoint_error"
              error-text="连接端点不能为空"
              placeholder="请输入连接端点"
            />
          </div>

          <div class="form-group">
            <md-divider role="separator"></md-divider>
          </div>

          <div class="form-group">
            <md-outlined-text-field
              @change="newNode.mtu = $event.target.value"
              label="MTU大小"
              placeholder="MTU大小"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              type="number"
              @change="newNode.base_port = $event.target.value"
              label="基础端口"
              placeholder="基础端口"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              v-model="newNode.link_local_net"
              label="链路本地网络"
              placeholder="链路本地网络"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              type="number"
              v-model="newNode.babel_port"
              value="6696"
              label="Babeld端口"
              placeholder="Babeld端口"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              type="number"
              v-model="newNode.babel_interval"
              label="Babeld更新间隔"
              placeholder="更新间隔(秒)"
            />
          </div>

          <div class="drawer-footer">
            <md-outlined-button
              class="cancel-btn"
              @click="showCreateDrawer = false"
              >取消</md-outlined-button
            >
            <md-filled-button class="submit-btn" @click="createNode"
              >确定</md-filled-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  name: "NodesView",
  data() {
    return {
      nodes: [],
      showCreateDrawer: false,
      newNode: {
        Name: "",
        Endpoint: "",
        mtu: null,
        base_port: null,
        link_local_net: "",
        babel_port: 6696,
        babel_interval: null,
      },
      name_error: false,
      endpoint_error: false,
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
    async createNode() {
      this.name_error = !this.newNode.Name;
      this.endpoint_error = !this.newNode.Endpoint;
      if (this.name_error || this.endpoint_error) {
        return;
      }
      try {
        const response = await api.post("/dashboard/nodes", this.newNode);
        console.log("节点创建成功:", response.data);

        // 刷新节点列表
        await this.fetchNodes();

        // 重置表单并关闭抽屉
        this.resetForm();
        this.showCreateDrawer = false;
      } catch (error) {
        console.error("创建节点失败:", error);
      }
    },
    resetForm() {
      this.newNode = {
        Name: "",
        Endpoint: "",
        mtu: null,
        base_port: null,
        link_local_net: "",
        babel_port: 6696,
        babel_interval: null,
      };
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

.drawer-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

.drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 999;
}

.drawer-open {
  right: 0;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-content {
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - 120px);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-group md-outlined-text-field,
.form-group md-filled-text-field {
  width: 100%;
  /* padding: 8px 12px; */
  font-size: 14px;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e8e8e8;
  text-align: right;
  z-index: 999;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  margin-left: 8px;
  cursor: pointer;
}

.submit-btn {
  border: none;
}

.cancel-btn {
  background: white;
  border: 1px solid #d9d9d9;
}
</style>
