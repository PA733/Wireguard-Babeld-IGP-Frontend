import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "./assets/styles/global.scss";

// Material-Web
import "@material/web/button/outlined-button"; // 未选择时的样式
import "@material/web/button/text-button"; // 选择时的样式
import "@material/web/button/filled-tonal-button";
import "@material/web/button/filled-button";
import "@material/web/divider/divider";
import "@material/web/textfield/outlined-text-field";
import "@material/web/textfield/filled-text-field";
import "@material/web/icon/icon";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入样式

const app = createApp(App);

app.use(ElementPlus);

app.use(router).mount("#app");
