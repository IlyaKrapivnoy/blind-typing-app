import { createRouter, createWebHistory } from "vue-router";
import TypingArea from "../components/TypingArea.vue";

const routes = [
  { path: "/level/:levelId", component: TypingArea },
  { path: "/", redirect: "/level/1" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
