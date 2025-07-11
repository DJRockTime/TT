import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "root",
    redirect: "/home/a",
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    redirect: "/home",
    meta: {
      title: "首页",
      isShow: true,
      pageId: "home",
      permission: "view_home",
      showInTag: false,
      order: 1,
    },
    children: [
      {
        path: "a",
        name: "a",
        component: () => import("../views/A.vue"),
        meta: {
          title: "页面 A",
          isShow: true,
          pageId: "page-a",
          permission: "view_a",
          showInTag: true,
          order: 1,
        },
      },
      {
        path: "a/dialog",
        name: "a-dialog",
        component: () => import("../views/Dialog.vue"),
        meta: {
          title: "对话框",
          isShow: false,
          pageId: "page-a",
          permission: "view_a",
          showInTag: true,
          order: 2,
        },
      },
      {
        path: "b",
        name: "b",
        component: () => import("../views/B.vue"),
        meta: {
          title: "页面 B",
          isShow: true,
          pageId: "page-b",
          permission: "view_b",
          showInTag: true,
          order: 3,
        },
      },
      {
        path: "c",
        name: "c",
        component: () => import("../views/C.vue"),
        meta: {
          title: "页面 C",
          isShow: true,
          pageId: "page-c",
          permission: "view_c",
          showInTag: true,
          order: 4,
        },
      },
      {
        path: "d",
        name: "d",
        component: () => import("../views/D.vue"),
        meta: {
          title: "页面 D",
          isShow: true,
          pageId: "page-d",
          permission: "view_d",
          showInTag: true,
          order: 5,
        },
      },
    ],
  },
  {
    path: "/product",
    name: "product",
    component: Home,
    meta: {
      title: "产品",
      isShow: true,
      pageId: "product",
      permission: "view_product",
      showInTag: false,
      order: 1,
    },
    children: [
      {
        path: "p1",
        name: "p1",
        component: () => import("../views/P1.vue"),
        meta: {
          title: "产品页面 1",
          isShow: true,
          pageId: "page-p1",
          permission: "view_p1",
          showInTag: true,
          order: 1,
        },
      },
      {
        path: "p2",
        name: "p2",
        component: () => import("../views/P2.vue"),
        meta: {
          title: "产品页面 2",
          isShow: true,
          pageId: "page-p2",
          permission: "view_p2",
          showInTag: true,
          order: 2,
        },
      },
    ],
  },
  {
    path: "/detail",
    name: "detail",
    component: Home,
    meta: {
      title: "详情",
      isShow: true,
      pageId: "detail",
      permission: "view_detail",
      showInTag: false,
      order: 1,
    },
    children: [
      {
        path: "d1",
        name: "d1",
        component: () => import("../views/D1.vue"),
        meta: {
          title: "详情页面 1",
          isShow: true,
          pageId: "page-d1",
          permission: "view_d1",
          showInTag: true,
          order: 1,
        },
      },
    ],
  },
  {
    path: "/information",
    name: "information",
    component: Home,
    meta: {
      title: "信息",
      isShow: true,
      pageId: "information",
      permission: "view_information",
      showInTag: false,
      order: 1,
    },
    children: [
      {
        path: "i1",
        name: "i1",
        component: () => import("../views/I1.vue"),
        meta: {
          title: "信息页面 1",
          isShow: true,
          pageId: "page-i1",
          permission: "view_i1",
          showInTag: true,
          order: 1,
        },
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    component: Home,
    meta: {
      title: "关于我们",
      isShow: true,
      pageId: "about",
      permission: "view_about",
      showInTag: false,
      order: 1,
    },
    children: [
      {
        path: "a1",
        name: "a1",
        component: () => import("../views/A1.vue"),
        meta: {
          title: "关于页面 1",
          isShow: true,
          pageId: "page-a1",
          permission: "view_a1",
          showInTag: true,
          order: 1,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
