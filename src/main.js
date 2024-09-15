import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "./assets/styles/global.scss";

// Material-Web
import "@material/web/button/outlined-button"; // 未选择时的样式
import "@material/web/button/text-button"; // 选择时的样式
import "@material/web/icon/icon";

createApp(App).use(router).mount("#app");
