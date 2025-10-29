<template>
  <main>
    <section>
      <article v-for="article in articles" :key="article.id">
        <h3>{{ article.title }}</h3>
        <p>{{ article.description }}</p>
        <div class="footer">
          <span class="icon-wrapper">
            <el-icon><UserFilled /></el-icon>
          </span>
          <span>文章 · {{ article.views }}</span>
        </div>
      </article>
    </section>
    <div class="copy-section">
      <el-button type="primary" @click="copyArticles">一键复制</el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const articles = ref([
  {
    id: 1,
    title: "Vue 3 Composition API 深度解析",
    description:
      "Vue 3 的 Composition API 是现代前端开发中的一项重大创新，它彻底改变了组件逻辑的组织方式。通过 setup 函数，你可以更灵活地组合响应式状态、计算属性和方法，而无需依赖传统的 Options API。这种方法大大提升了代码的可复用性和可维护性，尤其在大型项目中表现突出。本文将从基础概念入手，逐步深入探讨响应式 API 如 ref、reactive 和 computed 的使用技巧，并结合实际示例说明如何处理生命周期钩子如 onMounted 和 onUnmounted。同时，我们还会分析 Composition API 与 Options API 的迁移策略，帮助开发者平滑过渡到 Vue 3 的新范式。如果你是一名 Vue 开发者，掌握这些知识将让你在团队协作和代码审查中游刃有余。",
    views: 18,
  },
  {
    id: 2,
    title: "Element Plus 在 Vue 项目中的最佳实践",
    description:
      "Element Plus 作为 Vue 3 的官方 UI 组件库，以其简洁的设计和丰富的功能深受开发者青睐。在实际项目中，如何高效集成它至关重要。本文分享了从安装到高级配置的最佳实践。首先，讨论组件的按需导入以减少打包体积，使用 unplugin-element-plus 插件实现自动化。其次，探索主题定制，通过 Less 变量覆盖默认样式，实现品牌化 UI。性能优化方面，我们会介绍虚拟滚动列表和懒加载图片的技巧，以应对大数据场景。此外，还包括可访问性（a11y）考虑，如 ARIA 属性支持和键盘导航。最后，提供一个完整 demo，展示如何在 Vue Router 中无缝嵌入 Element Plus 组件。遵循这些实践，你的 Vue 项目将更具专业性和用户友好度。",
    views: 25,
  },
  {
    id: 3,
    title: "TypeScript 与 Vue 的完美结合",
    description:
      "TypeScript 的类型系统为 Vue 开发带来了前所未有的安全性和开发效率提升。从零起步，本文指导你逐步集成 TypeScript 到 Vue 项目中。首先，配置 tsconfig.json 和 vite.config.ts，确保类型检查无缝运行。然后，探讨 props、emits 和 ref 的类型定义，使用 Interface 和 Type 别名来描述组件 API。针对 Composition API，我们会深入泛型的使用，如 defineProps 的泛型约束，以实现更精确的类型推断。文章还覆盖了 Vuex/Pinia 的类型化状态管理和路由守卫的类型安全。同时，提供常见 pitfalls 的解决方案，如 any 类型滥用和第三方库的声明文件安装。通过这些步骤，你的项目将从动态语言转向静态类型，减少运行时错误，并提升 IDE 的智能提示体验。",
    views: 12,
  },
  {
    id: 4,
    title: "响应式设计在前端开发中的应用",
    description:
      "响应式设计（Responsive Design）是现代前端的核心原则，确保应用在各种设备上提供一致的用户体验。本文聚焦 Vue 实现移动端适配的实用技巧。首先，介绍媒体查询（Media Queries）的 CSS 基础，并结合 Vue 的动态类绑定实现条件渲染。其次，探讨 Flexbox 和 Grid 布局在组件中的应用，如自适应卡片网格。针对图片和字体，我们分享 srcset 属性和 rem/em 单位的优化策略，以避免性能瓶颈。Vue 特有部分包括使用 v-bind 动态计算视口单位（vh/vw）和监听窗口 resize 事件来调整组件状态。此外，还包括 PWA 集成，实现离线响应式。最后，通过一个电商首页 demo，展示如何从桌面到手机的无缝切换。掌握这些，你的 Vue 应用将真正“响应”用户需求。",
    views: 30,
  },
  {
    id: 5,
    title: "Vue Router 路由守卫详解",
    description:
      "Vue Router 的路由守卫机制是控制导航流程的关键工具，能有效管理权限验证和数据预加载。本文详解各种守卫的使用场景和最佳实践。全局守卫包括 beforeEach（预导航）和 afterEach（后导航），适合统一处理如 token 校验和日志记录。组件内守卫如 beforeRouteEnter，用于在进入组件前获取数据，避免闪烁。路由独享守卫 then 支持异步操作，如 API 调用后的 resolve/reject 处理。我们还会讨论 meta 字段的活用，例如根据路由元数据动态注入权限检查。同时，分析常见问题如无限循环和异步守卫的错误处理。最后，提供一个完整 SPA 示例，集成 NProgress 进度条，实现丝滑的路由体验。理解这些守卫，你的 Vue 应用将更安全且高效。",
    views: 22,
  },
  {
    id: 6,
    title: "Pinia 状态管理库入门",
    description:
      "Pinia 是 Vue 官方推荐的状态管理库，以其轻量级和 TypeScript 支持取代了 Vuex。本文带你从基础上手核心概念。安装后，创建 Store 使用 defineStore，分为 Options 和 Setup 两种模式，前者类似 Vuex 的 mutations/actions，后者更贴合 Composition API。响应式状态通过 ref/reactive 实现，getters 作为计算属性优化性能。插件系统允许扩展如持久化（pinia-plugin-persistedstate）。针对模块化，我们讨论 Store 的拆分和跨 Store 通信，如使用 Pinia 的 $patch 方法。文章还对比 Vuex 的痛点，如无类型支持和复杂 boilerplate。结尾是一个 Todo 应用 demo，展示 Pinia 在实际场景的简洁性。如果你厌倦了 Vuex 的繁琐，Pinia 将是你的新宠。",
    views: 15,
  },
  {
    id: 7,
    title: "Vue 组件通信的多种方式",
    description:
      "组件通信是 Vue 开发中的常见挑战，本文全面梳理从简单到高级的策略。基础方式包括 props 向下传递数据和 emit 向上触发事件，适用于父子组件。针对兄弟组件，使用 provide/inject 实现依赖注入，避免 props 钻取。事件总线（Mitt 库）适合松耦合场景，但 Pinia/Vuex 更推荐用于全局状态。文章深入 Teleport 和 Suspense 在通信中的作用，如跨层级事件冒泡。针对大型应用，我们探讨 Composition API 中的自定义 hooks 来封装通信逻辑。同时，提供性能考虑，如避免过度使用全局事件。最后，通过一个多组件表单 demo，展示混合策略的实际应用。掌握这些，你的 Vue 代码将更模块化和可扩展。",
    views: 28,
  },
  {
    id: 8,
    title: "Less 在 Vue 项目中的使用技巧",
    description:
      "Less 作为 CSS 预处理器，能显著提升 Vue 样式代码的组织性和可维护性。本文分享实用技巧，从基础变量和混合（mixins）入手。变量定义如 @primary-color: #409eff; 可全局注入，结合 Vue 的 scoped 样式避免冲突。嵌套规则简化选择器书写，如 .article { h3 { color: @text-color; } }。导入和部分导入控制文件大小，使用 @import ;。高级部分包括循环（for 循环生成类）和条件判断（when），适用于主题切换。针对 Vite 项目，配置 less-loader 并启用 JavaScript 启用（jsEnabled）。我们还会讨论与 Tailwind 的对比，以及常见错误如变量作用域。最后，一个动态主题 demo 展示 Less 的强大之处。应用这些技巧，你的样式将从杂乱转向优雅。",
    views: 10,
  },
  {
    id: 9,
    title: "Vite 构建工具的优势",
    description:
      "Vite 以其超快启动和热更新速度，成为 Vue 项目的首选构建工具。本文对比 Webpack，剖析其核心优势。Vite 利用浏览器原生 ES Modules 实现开发服务器，无需预打包，启动时间从秒级降至毫秒。热模块替换（HMR）更高效，仅更新变更部分。生产构建使用 Rollup，优化树摇和代码分割。配置简单，vite.config.ts 支持插件生态如 VitePress。针对大型 monorepo，我们讨论 workspace 模式和路径别名。性能指标包括 bundle 分析工具的使用和 sourcemap 优化。同时，分享迁移指南，从 Create React App 到 Vite 的步骤。结尾是一个基准测试，证明 Vite 在开发效率上的领先。如果你还在用 Webpack，Vite 将重塑你的构建体验。",
    views: 35,
  },
  {
    id: 10,
    title: "Vue 3 迁移指南",
    description:
      "从 Vue 2 迁移到 Vue 3 是提升项目现代性的关键步骤，本文提供逐步指南。使用 Migration Build 工具 @vue/compat 渐进式迁移，保留 Options API 兼容性。核心变化包括 Composition API 的引入，setup 函数替换 data/methods。Teleport 和 Suspense 增强了组件渲染控制。针对第三方库，检查 Vue 3 兼容性，并使用 shims 处理。文章详解常见迁移坑，如 v-model 的多值支持和 key 的严格要求。状态管理从 Vuex 2/3 到 Vuex 4/Pinia 的过渡。测试框架如 Vitest 的集成确保覆盖率。最后，一个 e-commerce 项目案例，展示迁移前后代码对比。跟随此指南，你的 Vue 应用将安全升级，拥抱新特性。",
    views: 20,
  },
]);

const copyArticles = async () => {
  // 直接从当前渲染的DOM提取（基于实际继承宽度，无需模拟）
  const renderedArticles = document.querySelectorAll("section article");
  let copyText = "";

  renderedArticles.forEach((article, index) => {
    const h3 = article.querySelector("h3")?.innerText.trim() || "";
    const p = article.querySelector("p")?.innerText.trim() || "";

    // 标题 + 单\n + 描述（基于实际折行）
    const articleText = h3 + "\n" + p;

    copyText += articleText;

    // 文章间加空行（双\n）
    if (index < renderedArticles.length - 1) {
      copyText += "\n\n";
    }
  });

  try {
    await navigator.clipboard.writeText(copyText);
    ElMessage.success(
      "复制成功！（基于实际盒子宽度折行，标题描述单行分隔，文章间空行）"
    );
  } catch (err) {
    console.error("复制失败:", err);
    ElMessage.error("复制失败，请手动复制");
    // fallback: 选中文本并复制
    const textArea = document.createElement("textarea");
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

async function copyToClipboard(text: any) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("复制成功！");
  } catch (err) {
    console.error("复制失败:", err);
    // 回退方案：如果Clipboard API不可用，使用旧方法（但不推荐长期依赖）
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text: any) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      console.log("回退复制成功！");
    } else {
      console.error("回退复制失败");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

// 使用示例
copyToClipboard("Hello, World!");
</script>

<style lang="less" scoped>
article {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #303133;
  }

  p {
    margin: 0 0 12px 0;
    color: #606266;
    line-height: 1.5;
    word-wrap: break-word; // 确保p在实际宽度下折行
    overflow-wrap: break-word;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-wrapper {
      color: #909399;
      font-size: 16px;
    }

    span:last-child {
      color: #909399;
      font-size: 14px;
    }
  }
}

.copy-section {
  margin-top: 20px;
  text-align: center;
}
</style>
