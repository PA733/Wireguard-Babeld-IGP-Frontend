import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/develop",
    name: "develop",
    component: () => import("../views/DevelopView.vue"),
  },
  {
    path: "/develop/android",
    name: "develop-android",
    component: () => import("../views/Develop/DevelopAndroidView.vue"),
  },
  {
    path: "/foundations",
    name: "foundations",
    component: () => import("../views/FoundationsView.vue"),
  },
  {
    path: "/foundations/accessibility",
    name: "foundations-accessibility",
    component: () =>
      import("../views/Foundations/FoundationsAccessibilityView.vue"),
  },
  {
    path: "/foundations/content-design",
    name: "foundations-content-design",
    component: () =>
      import("../views/Foundations/FoundationsContentDesignView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
