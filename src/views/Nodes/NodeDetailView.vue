<template>
  <div class="nodes-detail">
    <div class="content">
      <div class="node-switcher">
        <el-select
          v-model="currentNodeId"
          placeholder="选择节点"
          @change="handleNodeChange"
          :loading="loadingNodes"
        >
          <el-option
            v-for="node in nodeList"
            :key="node.id"
            :label="`节点 ${node.id} - ${node.name}`"
            :value="node.id"
          />
        </el-select>
      </div>

      <header class="hero">
        <div class="hero-text">
          <h1>{{ node?.name || "节点详情" }}</h1>
          <div class="status-badge" :class="node?.status?.status">
            {{ node?.status?.status || "未知状态" }}
          </div>
        </div>
      </header>

      <div class="cards-container" v-if="node">
        <!-- 基本信息卡片 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">节点ID:</span>
              <span class="value">{{ node.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDate(node.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间:</span>
              <span class="value">{{ formatDate(node.updated_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">IPv4:</span>
              <span class="value">{{ node.ipv4 || "未设置" }}</span>
            </div>
            <div class="info-item">
              <span class="label">IPv6:</span>
              <span class="value">{{ node.ipv6 || "未设置" }}</span>
            </div>
          </div>
        </el-card>

        <!-- 状态信息卡片 -->
        <el-card class="detail-card" v-if="node.status">
          <template #header>
            <div class="card-header">
              <h3>状态信息</h3>
            </div>
          </template>
          <div class="metrics-grid">
            <el-progress
              type="dashboard"
              :percentage="node.status.metrics.cpu_usage"
              :color="getCpuColor"
            >
              <template #default="{ percentage }">
                <span class="progress-label">CPU</span>
                <span class="percentage">{{ percentage.toFixed(1) }}%</span>
              </template>
            </el-progress>

            <el-progress
              type="dashboard"
              :percentage="node.status.metrics.memory_usage"
              :color="getMemoryColor"
            >
              <template #default="{ percentage }">
                <span class="progress-label">内存</span>
                <span class="percentage">{{ percentage.toFixed(1) }}%</span>
              </template>
            </el-progress>

            <el-progress
              type="dashboard"
              :percentage="node.status.metrics.disk_usage"
              :color="getDiskColor"
            >
              <template #default="{ percentage }">
                <span class="progress-label">磁盘</span>
                <span class="percentage">{{ percentage.toFixed(1) }}%</span>
              </template>
            </el-progress>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">主机名:</span>
              <span class="value">{{ node.status.hostname }}</span>
            </div>
            <div class="info-item">
              <span class="label">运行时间:</span>
              <span class="value">{{
                formatUptime(node.status.metrics.uptime)
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">版本:</span>
              <span class="value">{{ node.status.version }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <div v-else class="loading-state">
        <el-empty description="加载中..." v-if="loading" />
        <el-empty description="未找到节点信息" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api";

const route = useRoute();
const router = useRouter();
const node = ref(null);
const loading = ref(true);
const nodeList = ref([]);
const loadingNodes = ref(false);
const currentNodeId = ref(null);

// 获取节点列表
const getNodeList = async () => {
  loadingNodes.value = true;
  try {
    const response = await api.get("/dashboard/nodes");
    nodeList.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("获取节点列表失败:", error);
  } finally {
    loadingNodes.value = false;
  }
};

// 处理节点切换
const handleNodeChange = (nodeId) => {
  router.push(`/nodes/detail/${nodeId}`);
};

const getNodeDetails = async () => {
  if (!route.params.id) route.params.id = 1;
  currentNodeId.value = Number(route.params.id);
  try {
    const response = await api.get(`/dashboard/nodes/${route.params.id}`);
    node.value = response.data;
  } catch (error) {
    console.error("获取节点详情失败:", error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("zh-CN");
};

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);

  return parts.join(" ") || "未启动";
};

const getCpuColor = (percentage) => {
  if (percentage < 60) return "#67C23A";
  if (percentage < 80) return "#E6A23C";
  return "#F56C6C";
};

const getMemoryColor = (percentage) => {
  if (percentage < 70) return "#67C23A";
  if (percentage < 85) return "#E6A23C";
  return "#F56C6C";
};

const getDiskColor = (percentage) => {
  if (percentage < 75) return "#67C23A";
  if (percentage < 90) return "#E6A23C";
  return "#F56C6C";
};

onMounted(async () => {
  await getNodeList();
  getNodeDetails();
});
</script>

<style scoped>
.nodes-detail {
  padding: 20px;
}

.hero {
  margin-bottom: 24px;
}

.hero-text {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.online {
  background-color: #67c23a;
  color: white;
}

.status-badge.offline {
  background: #f44336;
  color: white;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  color: #909399;
  font-size: 14px;
}

.value {
  font-size: 14px;
  color: #303133;
}

.metrics-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}

.progress-label {
  display: block;
  font-size: 14px;
  color: #909399;
}

.percentage {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.node-switcher {
  margin-bottom: 20px;
}

.node-switcher :deep(.el-select) {
  width: 200px;
}
</style>
