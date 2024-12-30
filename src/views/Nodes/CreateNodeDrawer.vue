<template>
  <div>
    <div class="drawer-mask" v-if="show" @click="closeDrawer"></div>
    <div class="drawer" :class="{ 'drawer-open': show }">
      <div class="drawer-header">
        <h2>新建节点</h2>
        <button class="close-btn" @click="closeDrawer">&times;</button>
      </div>

      <div class="drawer-content">
        <!-- 步骤指示器 -->
        <div class="steps">
          <div class="step" :class="{ active: currentStep >= 1 }">
            <div class="step-number">1</div>
            <div class="step-text">基本信息</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 2 }">
            <div class="step-number">2</div>
            <div class="step-text">对等节点</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <div class="step-number">3</div>
            <div class="step-text">完成</div>
          </div>
        </div>

        <!-- 步骤 1: 基本信息 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="form-group">
            <md-outlined-text-field
              v-model="newNode.Name"
              label="节点名称"
              required
              :error="name_error"
              error-text="节点名称不能为空"
              placeholder="请输入节点名称"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              v-model="newNode.Endpoint"
              label="连接端点"
              required
              :error="endpoint_error"
              error-text="连接端点不能为空"
              placeholder="请输入连接端点"
            />
          </div>

          <div class="form-group">
            <md-divider role="separator"></md-divider>
          </div>

          <div class="form-group">
            <md-outlined-text-field
              v-model="newNode.mtu"
              label="MTU大小"
              placeholder="MTU大小"
            />
          </div>

          <div class="form-group">
            <md-outlined-text-field
              type="number"
              v-model="newNode.base_port"
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
        </div>

        <!-- 步骤 2: 对等节点 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="peers-list">
            <div
              v-for="node in availableNodes"
              :key="node.id"
              class="peer-item"
            >
              <label class="peer-label">
                <md-checkbox
                  touch-target="wrapper"
                  :checked="selectedPeers.includes(node.id)"
                  @change="togglePeer(node.id)"
                ></md-checkbox>
                {{ node.id }} - {{ node.name }}
              </label>
            </div>
          </div>
        </div>

        <!-- 步骤 3: 完成 -->
        <div v-if="currentStep === 3" class="step-content">
          <div v-if="isCreating" class="creating-status">
            <md-circular-progress indeterminate></md-circular-progress>
            <p>正在创建节点...</p>
          </div>
          <div v-else-if="createdNode" class="creation-result">
            <h3>节点创建成功！</h3>
            <div class="result-item">
              <span class="label">节点 ID:</span>
              <span>{{ createdNode.id }}</span>
            </div>
            <div class="result-item">
              <span class="label">节点名称:</span>
              <span>{{ createdNode.name }}</span>
            </div>
            <div class="result-item token-item">
              <span class="label">Token:</span>
              <div class="token-wrapper">
                <span class="token">{{ createdNode.token }}</span>
                <md-text-button @click="copyToken">
                  <md-icon>content_copy</md-icon>
                </md-text-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="drawer-footer">
          <md-outlined-button
            class="cancel-btn"
            @click="currentStep === 1 ? closeDrawer() : prevStep()"
          >
            {{ currentStep === 1 ? "取消" : "上一步" }}
          </md-outlined-button>
          <md-filled-button
            class="submit-btn"
            @click="nextStep"
            :disabled="isCreating"
          >
            {{ buttonText }}
          </md-filled-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  name: "CreateNodeDrawer",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentStep: 1,
      newNode: {
        Name: "",
        Endpoint: "",
        mtu: null,
        base_port: null,
        link_local_net: "",
        babel_port: 6696,
        babel_interval: null,
        Peers: [],
      },
      newNodeDefault: {
        Name: "",
        Endpoint: "",
        mtu: null,
        base_port: null,
        link_local_net: "",
        babel_port: 6696,
        babel_interval: null,
        Peers: [],
      },
      name_error: false,
      endpoint_error: false,
      availableNodes: [],
      selectedPeers: [],
      isCreating: false,
      createdNode: null,
    };
  },
  computed: {
    buttonText() {
      if (this.currentStep === 1) return "下一步";
      if (this.currentStep === 2) return "创建";
      return "完成";
    },
  },
  methods: {
    async fetchAvailableNodes() {
      try {
        const response = await api.get("/dashboard/nodes");
        this.availableNodes = response.data.sort((a, b) => a.id - b.id);
        this.selectedPeers = this.availableNodes.map((node) => node.id);
      } catch (error) {
        console.error("获取节点列表失败:", error);
      }
    },
    togglePeer(nodeId) {
      const index = this.selectedPeers.indexOf(nodeId);
      if (index === -1) {
        this.selectedPeers.push(nodeId);
      } else {
        this.selectedPeers.splice(index, 1);
      }
    },
    async nextStep() {
      if (this.currentStep === 1) {
        if (this.validateStep1()) {
          this.currentStep = 2;
          await this.fetchAvailableNodes();
        }
      } else if (this.currentStep === 2) {
        this.newNode.Peers = this.selectedPeers;
        this.currentStep = 3;
        await this.createNode();
      } else {
        this.closeDrawer();
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    validateStep1() {
      this.name_error = !this.newNode.Name;
      this.endpoint_error = !this.newNode.Endpoint;
      return !this.name_error && !this.endpoint_error;
    },
    async createNode() {
      this.isCreating = true;
      try {
        const response = await api.post("/dashboard/nodes", this.newNode);
        this.createdNode = response.data;
        this.$emit("node-created");
      } catch (error) {
        console.error("创建节点失败:", error);
      } finally {
        this.isCreating = false;
      }
    },
    copyToken() {
      if (this.createdNode?.token) {
        navigator.clipboard.writeText(this.createdNode.token);
      }
    },
    closeDrawer() {
      this.resetForm();
      this.$emit("update:show", false);
    },
    resetForm() {
      // this.currentStep = 1;
      // this.newNode = {
      //   Name: "",
      //   Endpoint: "",
      //   mtu: null,
      //   base_port: null,
      //   link_local_net: "",
      //   babel_port: 6696,
      //   babel_interval: null,
      //   Peers: [],
      // };
      // this.selectedPeers = [];
      // this.createdNode = null;
      // this.isCreating = false;
      this.newNode = this.newNodeDefault;
    },
  },
};
</script>

<style scoped>
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

.form-group md-outlined-text-field,
.form-group md-filled-text-field {
  width: 100%;
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

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.step.active {
  color: var(--md-sys-color-primary);
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.step-line {
  flex-grow: 1;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 10px;
  margin-bottom: 30px;
}

.peers-list {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.peer-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.peer-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.creating-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
}

.creation-result {
  padding: 20px;
}

.result-item {
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.result-item .label {
  width: 100px;
  color: #666;
}

.token-item {
  align-items: flex-start;
}

.token-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.token {
  word-break: break-all;
  font-family: monospace;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  flex: 1;
}
</style>
