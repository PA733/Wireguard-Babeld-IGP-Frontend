<template>
  <div>
    <div class="drawer-mask" v-if="show" @click="closeDrawer"></div>
    <div class="drawer" :class="{ 'drawer-open': show }">
      <div class="drawer-header">
        <h2>新建节点</h2>
        <button class="close-btn" @click="closeDrawer">&times;</button>
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
          <md-outlined-button class="cancel-btn" @click="closeDrawer"
            >取消</md-outlined-button
          >
          <md-filled-button class="submit-btn" @click="createNode"
            >确定</md-filled-button
          >
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
    closeDrawer() {
      this.$emit("update:show", false);
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

        // 通知父组件刷新节点列表
        this.$emit("node-created");

        // 重置表单并关闭抽屉
        this.resetForm();
        this.closeDrawer();
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
</style>
