<template>
  <main class="home">
    <div class="common-layout">
      <el-container>
        <!-- Nav -->
        <el-header>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item
              v-for="(item, index) in navItems"
              :key="item.name"
              :index="String(index + 1)"
              :disabled="!item.enabled"
              class="relative"
            >
              {{ item.name }}
            </el-menu-item>
            <!-- 横条始终存在，动态绑定样式 -->
            <span class="underline" :style="underlineStyle"></span>
          </el-menu>
          <div class="h-6" />
        </el-header>

        <!-- Tag标签页 -->
        <el-header>
          <section class="tags-container">
            <transition-group name="tag-fade" tag="div" class="tag-group">
              <el-tag
                v-for="(tag, index) in tags"
                :key="tag.path"
                :closable="tags.length > 1"
                :type="tag.path === route.fullPath ? '' : 'info'"
                :class="{ active: tag.path === route.fullPath }"
                @click="router.push(tag.path)"
                @close="handleCloseTag(index)"
              >
                {{ tag.name }}
              </el-tag>
            </transition-group>
          </section>
        </el-header>

        <!-- 页面内容 -->
        <el-container class="main-container">
          <!-- 侧边栏 -->
          <el-aside width="200px">
            <el-menu
              :default-active="route.path"
              class="el-menu-vertical-demo"
              router
            >
              <template
                v-for="item in generateMenu(menuItems, 2)"
                :key="item.path"
              >
                <el-sub-menu
                  v-if="item.children && item.children.length"
                  :index="item.path"
                >
                  <template #title>{{ item.meta.title }}</template>
                  <el-menu-item
                    v-for="sub in item.children"
                    :key="sub.path"
                    :index="sub.path"
                  >
                    {{ sub.meta.title }}
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.path">
                  {{ item.meta.title }}
                </el-menu-item>
              </template>
            </el-menu>
          </el-aside>

          <!-- 主内容区 -->
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

interface NavItem {
  name: string;
  path: string;
  enabled: boolean;
  routes: RouteRecordRaw[];
}

interface Tag {
  name: string;
  path: string;
}

// 导航项，包含enabled属性和对应路由配置
const navItems = ref<NavItem[]>([
  {
    name: "Home",
    path: "/",
    enabled: true,
    routes: [
      {
        path: "/home",
        name: "home",
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
    ],
  },
  {
    name: "Product",
    path: "/product",
    enabled: true,
    routes: [
      {
        path: "/product",
        name: "product",
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
    ],
  },
  {
    name: "Detail",
    path: "/detail",
    enabled: false,
    routes: [
      {
        path: "/detail",
        name: "detail",
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
    ],
  },
  {
    name: "Information",
    path: "/information",
    enabled: true,
    routes: [
      {
        path: "/information",
        name: "information",
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
    ],
  },
  {
    name: "About Us",
    path: "/about",
    enabled: true,
    routes: [
      {
        path: "/about",
        name: "about",
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
    ],
  },
]);

const router = useRouter();
const route = useRoute();
const activeIndex = ref("1"); // 默认选中 Home
const underlineStyle = ref({ transform: "translateX(0px)", width: "0px" }); // 初始化横条样式
const tags = ref<Tag[]>([{ name: "页面 A", path: "/a" }]); // 默认包含页面 A 的标签
const menuItems = ref<RouteRecordRaw[]>(navItems.value[0].routes); // 默认加载 Home 的路由
const currentNav = ref(navItems.value[0]); // 当前导航

const handleSelect = (index: string) => {
  const navIndex = parseInt(index) - 1;
  const selectedNav = navItems.value[navIndex];
  if (!selectedNav.enabled) return; // 禁用导航不可点击
  activeIndex.value = index;
  currentNav.value = selectedNav;
  menuItems.value = selectedNav.routes;
  // 清空标签并加载新导航的默认子页面
  tags.value = [];
  const defaultSubRoute = selectedNav.routes[0]?.children?.[0]?.path;
  if (defaultSubRoute) {
    const normalizedPath = defaultSubRoute.startsWith("/")
      ? defaultSubRoute
      : `${selectedNav.path}/${defaultSubRoute}`.replace("//", "/");
    router.push(normalizedPath);
  } else {
    router.push(selectedNav.path);
  }
  // 等待 DOM 更新后调整横条位置
  nextTick(() => {
    updateUnderlinePosition();
  });
};

const updateUnderlinePosition = () => {
  const activeElement = document.querySelectorAll(".el-menu-item")[
    parseInt(activeIndex.value) - 1
  ] as HTMLElement;
  if (activeElement) {
    const { offsetLeft, offsetWidth } = activeElement;
    underlineStyle.value = {
      transform: `translateX(${offsetLeft}px)`,
      width: `${offsetWidth}px`,
    };
  } else {
    // 如果没有找到元素，重置横条
    underlineStyle.value = {
      transform: "translateX(0px)",
      width: "0px",
    };
  }
};

const generateMenu = (
  routes: RouteRecordRaw[],
  level: number
): RouteRecordRaw[] => {
  const filterAndSortRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    return routes
      .filter((route) => route.meta?.isShow !== false)
      .sort((a, b) => (a.meta?.order || 0) - (b.meta?.order || 0))
      .map((route) => ({
        ...route,
        children: route.children
          ? filterAndSortRoutes(route.children)
          : undefined,
      }));
  };

  let result = filterAndSortRoutes(routes);
  if (level > 1) {
    result = result.reduce((acc: RouteRecordRaw[], route) => {
      if (route.children) {
        return [...acc, ...filterAndSortRoutes(route.children)];
      }
      return acc;
    }, []);
  }
  return result;
};

const handleCloseTag = (index: number) => {
  if (tags.value.length <= 1) return; // 确保至少保留一个标签
  const closedTag = tags.value[index];
  tags.value.splice(index, 1);
  if (closedTag.path === route.fullPath) {
    const prevIndex = index > 0 ? index - 1 : 0;
    router.push(tags.value[prevIndex].path);
  }
};

const updateTags = () => {
  const currentRoute = menuItems.value
    .flatMap((route) => [route, ...(route.children || [])])
    .find((r) => {
      const normalizedRoutePath = r.path.startsWith("/")
        ? r.path
        : `${currentNav.value.path}/${r.path}`.replace("//", "/");
      return normalizedRoutePath === route.fullPath;
    });

  if (currentRoute && currentRoute.meta?.showInTag) {
    const normalizedPath = currentRoute.path.startsWith("/")
      ? currentRoute.path
      : `${currentNav.value.path}/${currentRoute.path}`.replace("//", "/");
    const existingTag = tags.value.find((tag) => tag.path === normalizedPath);
    if (!existingTag) {
      tags.value.push({
        name: currentRoute.meta.title,
        path: normalizedPath,
      });
    }
  }
};

watch(
  () => route.fullPath,
  () => {
    updateTags();
  },
  { immediate: true }
);

onMounted(() => {
  // 默认跳转到 /a，确保页面 A 选中
  if (route.path === "/" || route.path === "") {
    router.push("/home/a");
  }
  // 初始化顶部导航为 Home
  activeIndex.value = "1";
  nextTick(() => {
    updateUnderlinePosition();
  });
  window.addEventListener("resize", updateUnderlinePosition);
});

// tagsViewStore.ts or where you manage tags
// function addTagWithDelay(route: RouteLocationNormalized, delay = 800) {
//   // 判断是否已经存在
//   const exists = tagList.find(tag => tag.fullPath === route.fullPath)
//   if (exists) return

//   // 设置延迟加入
//   setTimeout(() => {
//     tagList.push({
//       title: route.meta.title || route.name,
//       fullPath: route.fullPath,
//       name: route.name as string,
//     })
//   }, delay)
// }

// 在菜单点击处理或路由守卫中调用
// router.push(menuPath).then(() => {
//   addTagWithDelay(route) // 加上延迟
// })
</script>

<style lang="less" scoped>
:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: none !important;
}

.home {
  height: 100%;
  width: 100%;
}

.common-layout {
  height: 100%;
  width: 100%;
}

:deep(.el-container) {
  height: 100%;
  width: 100%;
}

:deep(.el-header) {
  padding: 0 !important;
}

.tags-container {
  width: 100%;
  height: 40px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  padding: 0 10px;
  overflow-x: auto;
}

.active {
  background-color: #409eff !important;
  color: #fff !important;
  border-color: #409eff !important;
}

.el-menu-demo {
  position: relative;
}

.el-menu-item {
  position: relative;
  transition: color 0.2s ease-in-out;
}

.el-menu-item:hover:not(.is-disabled) {
  color: #409eff;
  font-weight: bold;
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out,
    font-weight 0.2s ease-in-out;
}

.el-menu-item.is-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: #409eff;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  transform-origin: center;
}

.el-tag {
  margin-right: 8px;
  cursor: pointer;
}

.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: all 0.3s ease;
}
.tag-fade-enter-from,
.tag-fade-leave-to {
  opacity: 0;
  transform: translateXX(-10px);
}
.tag-fade-enter-to,
.tag-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
