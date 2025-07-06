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
            <el-menu-item index="1">Processing Center</el-menu-item>
            <el-sub-menu index="2">
              <template #title>Workspace</template>
              <el-menu-item index="2-1">item one</el-menu-item>
              <el-menu-item index="2-2">item two</el-menu-item>
              <el-menu-item index="2-3">item three</el-menu-item>
              <el-sub-menu index="2-4">
                <template #title>item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="3" disabled>Info</el-menu-item>
            <el-menu-item index="4">Orders</el-menu-item>
          </el-menu>
          <div class="h-6" />
        </el-header>

        <!-- Tag标签页 -->
        <el-header>
          <section class="tags-container">
            <el-tag
              v-for="tag in tags"
              :key="tag.path"
              closable
              :type="tag.type"
              :class="{ active: tag.path === route.fullPath }"
              @click="router.push(tag.path)"
              @close="handleCloseTag(tag.path)"
            >
              {{ tag.name }}
            </el-tag>
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
              <template v-for="item in menuItems" :key="item.index">
                <el-sub-menu v-if="item.children" :index="item.index">
                  <template #title>{{ item.label }}</template>
                  <el-menu-item
                    v-for="sub in item.children"
                    :key="sub.index"
                    :index="sub.index"
                  >
                    {{ sub.label }}
                  </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.index">
                  {{ item.label }}
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
import { ref, computed, onMounted, watch } from "vue";
// import type { Component } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { TagProps } from "element-plus";

const router = useRouter();
const route = useRoute();

interface TagsItem {
  name: string; // 标签显示文字
  path: string; // 标签路径，用于跳转和去重
  type: TagProps["type"]; // 可自定义颜色或状态（默认 all 用 info）
}

const tags = ref<TagsItem[]>([]);

// 动态添加标签
watch(
  () => route.fullPath,
  (newPath) => {
    const matched = route.matched[route.matched.length - 1];
    const meta = matched?.meta;

    // 没有 title 就不展示（标签必须有名字）
    if (!meta?.title) return;

    // 如果明确设置 showInTag === false，就不展示标签
    if (meta?.showInTag === false) return;

    const exists = tags.value.some((t) => t.path === newPath);
    if (!exists) {
      tags.value.push({
        name: meta.title,
        path: newPath,
        type: "info",
      });
    }
  },
  { immediate: true }
);

// // 递归转换路由为菜单项
// const generateMenu = (routes: any[]) => {
//   return (
//     routes
//       .filter((r) => r.meta?.isShow !== false) // 过滤掉隐藏路由
//       // .filter((r) => !r.meta?.hidden) // 过滤掉隐藏路由
//       .map((r) => {
//         const menuItem: any = {
//           index: r.path.startsWith("/") ? r.path : `/${r.path}`, // 保证路径绝对
//           label: r.meta?.title || r.name, // 展示名称优先用 meta.title
//         };
//         if (r.children && r.children.length) {
//           menuItem.children = generateMenu(r.children);
//         }
//         return menuItem;
//       })
//   );
// };

// 正确生成左侧菜单数据的递归函数（支持子路由路径拼接）
const generateMenu = (routes: any[], parentPath = "") => {
  return routes
    .filter((r) => r.meta?.isShow !== false)
    .map((r) => {
      // 拼接完整路径
      const fullPath = r.path.startsWith("/")
        ? r.path
        : `${parentPath}/${r.path}`.replace(/\/+/g, "/");

      const menuItem: any = {
        index: fullPath,
        label: r.meta?.title || r.name,
      };

      if (r.children && r.children.length) {
        menuItem.children = generateMenu(r.children, fullPath);
      }

      return menuItem;
    });
};

// 生成左侧菜单数据
const menuItems = computed(() => {
  const rootChildren = router.options.routes.flatMap((r) => r.children || []);
  return generateMenu(rootChildren);
});

const activeIndex = ref("1");

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleCloseTag = (path: string) => {
  const index = tags.value.findIndex((t) => t.path === path);
  if (index === -1) return;

  // 标签至少保留一个
  if (tags.value.length === 1) return;

  tags.value.splice(index, 1);

  // 如果当前关闭的是当前激活的页面
  if (path === route.fullPath) {
    const nextTag = tags.value[index - 1] || tags.value[0];
    router.push(nextTag.path);
  }
};

onMounted(() => {
  if (route.path === "/") {
    router.replace("/a"); // 默认跳转
  }
});
</script>

<style lang="less" scoped>
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
}

.active {
  background-color: #409eff !important;
  color: #fff !important;
  border-color: #409eff !important;
}
</style>
