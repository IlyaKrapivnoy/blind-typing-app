import { createRouter, createWebHistory } from "vue-router";
import TypingArea from "../components/TypingArea.vue";

const routes = [
  { path: "/lesson/:lessonId", component: TypingArea },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;