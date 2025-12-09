```vue
<template>
  <section class="checkbox-transfer">
    <!-- 左侧面板 -->
    <div class="left-panel">
      <div class="input-search">
        <div class="search-bar">
          <input
            type="search"
            v-model="searchValue"
            placeholder="搜索名称或编码..."
            @input="handleSearch"
          />
          <button
            class="toggle-all-btn"
            @click="toggleAllExpand"
            :title="isAllExpanded ? '全部收起' : '全部展开'"
          >
            <span class="expand-arrow" :class="{ expanded: isAllExpanded }"
              >▶</span
            >
            {{ isAllExpanded ? "收起" : "展开" }}
          </button>
        </div>
      </div>

      <div class="checkbox-tree-scroll">
        <div class="checkbox-tree-container">
          <div
            v-for="node in displayedNodes"
            :key="node.id"
            class="tree-node-wrapper"
          >
            <!-- 父节点 -->
            <div class="tree-node level-0">
              <span
                class="expand-arrow"
                :class="{ expanded: isNodeExpanded(node) }"
                @click.stop="toggleExpand(node)"
              >
                <svg
                  :class="{ expanded: isNodeExpanded(node) }"
                  width="12"
                  height="12"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    d="M366.336 772.48l348.16-348.16-348.16-348.16 59.904-59.904 408.064 408.064L428.24 832.384z"
                  />
                </svg>
              </span>

              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="node.checked"
                  :indeterminate.prop="node.indeterminate"
                  @change="handleCheck(node, $event.target.checked)"
                />
                <span class="node-label" v-html="highlightLabel(node)"></span>
              </label>
            </div>

            <!-- 子节点区域 -->
            <transition name="expand">
              <div v-if="isNodeExpanded(node)" class="children-group">
                <div
                  v-for="child in getVisibleChildren(node)"
                  :key="child.id"
                  class="tree-node level-1"
                >
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      :checked="child.checked"
                      @change="handleCheck(child, $event.target.checked)"
                    />
                    <span
                      class="node-label"
                      v-html="highlightLabel(child)"
                    ></span>
                  </label>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="displayedNodes.length === 0" class="empty-tip">
            无匹配结果
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧面板 -->
    <div class="right-panel">
      <header class="selected-header">
        <span class="selected-count">已选 {{ selectList.length }} 条</span>
        <span class="clear-all" @click="clearAll">清空</span>
      </header>

      <div class="selected-items-scroll">
        <div class="selected-items-list">
          <div
            class="selected-item"
            v-for="item in selectList"
            :key="item.value"
          >
            <span class="item-name">
              {{ item.label }}
              <small style="opacity: 0.6; margin-left: 4px"
                >({{ item.value }})</small
              >
            </span>
            <span class="remove-item" @click="removeItem(item)">×</span>
          </div>
          <div v-if="selectList.length === 0" class="empty-tip">暂无已选项</div>
        </div>
      </div>

      <div class="action-footer">
        <button class="confirm-btn" @click="handleConfirm">确认</button>
      </div>

      <div v-if="resultOutput" class="result-output">
        <pre>{{ JSON.stringify(resultOutput, null, 2) }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";

interface ITreeData {
  id: number;
  pid: number | null;
  label: string;
  value: string;
  displayText: string;
  isLeaf?: boolean;
  docClassCode?: string;
  docClassName?: string;
  checked: boolean;
  indeterminate: boolean;
  childrenIds?: number[];
}

const props = defineProps<{
  modelValue?: string[]; // v-model 传入的已选编码数组，如 ['DOC0001', 'DOC0003']
  allowParentSelect?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  confirm: [
    {
      docItemNames: string;
      docClassCode: string;
      docClassNames: string;
    }
  ];
}>();

const allowParentSelect = computed(() => props.allowParentSelect ?? false);

// 原始数据
// 原始数据（保持不变）
const realData = [
  {
    docItemName: "商务合作",
    children: [
      { docClassCode: "DOC0001", docClassName: "合同范本" },
      { docClassCode: "DOC0002", docClassName: "协议范本" },
    ],
  },
  {
    docItemName: "法律事务",
    children: [
      { docClassCode: "DOC0001", docClassName: "合同范本" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0005", docClassName: "尽职调查报告" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
  {
    docItemName: "知识产权",
    children: [
      { docClassCode: "DOC0006", docClassName: "专利申请" },
      { docClassCode: "DOC0003", docClassName: "法律意见书" },
      { docClassCode: "DOC0007", docClassName: "商标注册" },
    ],
  },
];

// 新增
const previouslyCollapsed = ref<Set<number>>(new Set());

// 替换 toggleExpand
const toggleExpand = (node: ITreeData) => {
  if (expandedNodes.value.has(node.id)) {
    expandedNodes.value.delete(node.id);
    previouslyCollapsed.value.add(node.id);
  } else {
    expandedNodes.value.add(node.id);
    previouslyCollapsed.value.delete(node.id);
  }
  expandedNodes.value = new Set(expandedNodes.value);
  previouslyCollapsed.value = new Set(previouslyCollapsed.value);
};

// 替换 toggleAllExpand（加上清除手动收起记录）
const toggleAllExpand = () => {
  const shouldExpand = !isAllExpanded.value;
  allNodes.value.forEach((node) => {
    if (!node.isLeaf) {
      if (shouldExpand) {
        expandedNodes.value.add(node.id);
        previouslyCollapsed.value.delete(node.id);
      } else {
        expandedNodes.value.delete(node.id);
        previouslyCollapsed.value.add(node.id);
      }
    }
  });
  expandedNodes.value = new Set(expandedNodes.value);
  previouslyCollapsed.value = new Set(previouslyCollapsed.value);
};

// 替换 isNodeExpanded（关键！）
const isNodeExpanded = (node: ITreeData) => {
  if (searchValue.value) {
    const manualExpanded = expandedNodes.value.has(node.id);
    const manualCollapsed = previouslyCollapsed.value.has(node.id);
    if (manualExpanded || manualCollapsed) {
      return manualExpanded;
    }
    const lower = searchValue.value.toLowerCase();
    const selfMatch = node.label.toLowerCase().includes(lower);
    const childMatch =
      node.childrenIds?.some((id) => {
        const child = nodeMap.value.get(id);
        return child?.displayText.toLowerCase().includes(lower);
      }) ?? false;
    return selfMatch || childMatch;
  }
  return expandedNodes.value.has(node.id);
};

// 展开/收起
const isAllExpanded = computed(() => {
  const parentNodes = allNodes.value.filter((n) => !n.isLeaf);
  if (parentNodes.length === 0) return true;
  return parentNodes.every((n) => expandedNodes.value.has(n.id));
});

// ========== 关键数据 ==========
const allNodes = ref<ITreeData[]>([]);
const nodeMap = computed(() => {
  const map = new Map<number, ITreeData>();
  allNodes.value.forEach((n) => map.set(n.id, n));
  return map;
});

const expandedNodes = ref<Set<number>>(new Set());
const searchValue = ref<string>("");
const selectList = ref<Array<{ value: string; name: string; label: string }>>(
  []
);
const resultOutput = ref<any>(null);

// ========== 扁平化 ==========
const flattenData = (data: any[]) => {
  const list: ITreeData[] = [];
  let id = 1;
  data.forEach((parent) => {
    const pNode: ITreeData = {
      id: id++,
      pid: null,
      label: parent.docItemName,
      value: parent.docItemName,
      displayText: parent.docItemName,
      isLeaf: false,
      checked: false,
      indeterminate: false,
      childrenIds: [],
    };
    list.push(pNode);

    parent.children.forEach((c: any) => {
      const childNode: ITreeData = {
        id: id++,
        pid: pNode.id,
        label: c.docClassCode,
        value: c.docClassCode,
        displayText: `${c.docClassCode} ${c.docClassName}`,
        isLeaf: true,
        docClassCode: c.docClassCode,
        docClassName: c.docClassName,
        checked: false,
        indeterminate: false,
      };
      list.push(childNode);
      pNode.childrenIds!.push(childNode.id);
    });
  });
  return list;
};

// ========== 初始化 & 回显 ==========
onMounted(() => {
  allNodes.value = flattenData(realData);
  // 默认展开所有
  allNodes.value.forEach((n) => {
    if (!n.isLeaf) expandedNodes.value.add(n.id);
  });
  // 外部传入回显
  if (props.modelValue?.length) {
    applyExternalSelection(props.modelValue);
  }
});

// v-model 监听：外部改了值，内部同步勾选
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    // 避免自己 emit 出去的值又触发自己（防死循环）
    if (!newVal) {
      clearAll();
      return;
    }

    const newCodes = new Set(newVal);
    const currentCodes = new Set(
      selectList.value
        .filter((i) =>
          allNodes.value.some((n) => n.isLeaf && n.docClassCode === i.value)
        )
        .map((i) => i.value)
    );

    // 如果外部传进来的和当前已选一模一样，就不处理（防止闪烁）
    if (
      newCodes.size === currentCodes.size &&
      [...newCodes].every((code) => currentCodes.has(code))
    ) {
      return;
    }

    applyExternalSelection(newVal);
  },
  { deep: true }
);

// 应用外部传入的选中值
// 完全替换 applyExternalSelection 函数
const applyExternalSelection = (codes: string[]) => {
  const codeSet = new Set(codes);

  // 第一步：先把所有叶子节点该勾的勾上（但不能直接改 checked！）
  allNodes.value.forEach((node) => {
    if (node.isLeaf && node.docClassCode && codeSet.has(node.docClassCode)) {
      // 关键：模拟一次“点击”行为，走完整的三态逻辑！
      if (!node.checked) {
        handleCheck(node, true);
      }
    } else if (node.isLeaf && !codeSet.has(node.docClassCode || "")) {
      if (node.checked) {
        handleCheck(node, false);
      }
    }
  });

  // 注意：不需要再手动 updateParentState，因为 handleCheck 里已经做了
};
// ========== 搜索与展开逻辑 ==========
const displayedNodes = computed(() => {
  if (!searchValue.value) return allNodes.value.filter((n) => n.pid === null);

  const lower = searchValue.value.toLowerCase();
  const matchedParentIds = new Set<number>();

  // 收集匹配的父节点或子节点的父节点
  allNodes.value.forEach((node) => {
    if (node.displayText.toLowerCase().includes(lower)) {
      if (node.pid === null) {
        matchedParentIds.add(node.id);
      } else if (node.pid !== null) {
        matchedParentIds.add(node.pid);
      }
    }
  });

  return allNodes.value.filter(
    (n) => n.pid === null && matchedParentIds.has(n.id)
  );
});

const getVisibleChildren = (parent: ITreeData) => {
  if (!searchValue.value) {
    return parent.childrenIds!.map((id) => nodeMap.value.get(id)!);
  }
  // 搜索父项时，显示所有子项（关键！）
  if (parent.label.toLowerCase().includes(searchValue.value.toLowerCase())) {
    return parent.childrenIds!.map((id) => nodeMap.value.get(id)!);
  }
  // 否则只显示匹配的子项
  const lower = searchValue.value.toLowerCase();
  return parent
    .childrenIds!.map((id) => nodeMap.value.get(id)!)
    .filter((child) => child.displayText.toLowerCase().includes(lower));
};

// ========== 其他逻辑（不变）==========
const highlightLabel = (node: ITreeData) => {
  if (!searchValue.value) return node.label;
  const escaped = searchValue.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  if (
    node.displayText.toLowerCase().includes(searchValue.value.toLowerCase())
  ) {
    return node.label.replace(regex, '<span class="highlight">$1</span>');
  }
  return node.label;
};

const handleCheck = (node: ITreeData, checked: boolean) => {
  // === 情况1：点击的是父节点 ===
  if (!node.isLeaf) {
    // 强制覆盖 indeterminate，点击就是“明确意图”
    node.checked = checked;
    node.indeterminate = false;

    // 级联：所有子节点跟随父节点
    node.childrenIds!.forEach((id) => {
      const child = nodeMap.value.get(id);
      if (child) {
        child.checked = checked;
        child.indeterminate = false; // 子节点也不能有横杠
      }
    });
  }
  // === 情况2：点击的是子节点 ===
  else {
    node.checked = checked;
    // 子节点不需要 indeterminate
    node.indeterminate = false;
  }

  // === 无论点父还是点子，都要更新所有祖先节点状态 ===
  if (node.pid !== null) {
    updateParentState(node.pid);
  }

  // === 最后更新右侧列表和抛出事件 ===
  updateSelectList();
  emitSelectedCodes();
};

function updateParentState(pid: number) {
  const parent = nodeMap.value.get(pid);
  if (!parent) return;

  const children = parent.childrenIds!.map((id) => nodeMap.value.get(id)!);
  const checkedCount = children.filter((c) => c.checked).length;
  const total = children.length;

  if (checkedCount === total) {
    parent.checked = true;
    parent.indeterminate = false;
  } else if (checkedCount === 0) {
    parent.checked = false;
    parent.indeterminate = false;
  } else {
    parent.checked = false; // 注意：部分选中时，父节点 checkbox 本身是“未勾选”状态
    parent.indeterminate = true; // 但显示横杠
  }

  // 继续向上更新祖先
  if (parent.pid !== null) {
    updateParentState(parent.pid);
  }
}

const updateSelectList = () => {
  const map = new Map<string, { value: string; name: string; label: string }>();
  allNodes.value.forEach((node) => {
    if (node.checked && (node.isLeaf || allowParentSelect.value)) {
      if (!map.has(node.value)) {
        map.set(node.value, {
          value: node.value,
          name: node.label,
          label: node.isLeaf ? node.docClassName || node.label : node.label,
        });
      }
    }
  });
  selectList.value = Array.from(map.values());
};

// 把 emitSelectedCodes 包一层
let isEmitting = false;
const emitSelectedCodes = () => {
  if (isEmitting) return;
  isEmitting = true;

  nextTick(() => {
    const codes = selectList.value
      .filter((item) =>
        allNodes.value.some((n) => n.isLeaf && n.docClassCode === item.value)
      )
      .map((item) => item.value);

    emit("update:modelValue", codes);
    isEmitting = false;
  });
};

const clearAll = () => {
  allNodes.value.forEach((n) => {
    n.checked = false;
    n.indeterminate = false;
  });
  selectList.value = [];
  updateSelectList();
  emitSelectedCodes();
};

const removeItem = (item: { value: string; name: string }) => {
  const codeToRemove = item.value; // 这是 docClassCode

  // Step 1: 找到所有拥有这个 docClassCode 的叶子节点，全部取消选中
  const affectedParentIds = new Set<number>();

  allNodes.value.forEach((node) => {
    if (node.isLeaf && node.docClassCode === codeToRemove) {
      node.checked = false;
      node.indeterminate = false;
      if (node.pid !== null) {
        affectedParentIds.add(node.pid); // 收集受影响的父节点
      }
    }
  });

  // Step 2: 重新计算所有受影响的父节点的三态（关键！）
  affectedParentIds.forEach((pid) => {
    updateParentState(pid);
  });

  // Step 3: 更新右侧列表 + 抛出事件
  updateSelectList();
  emitSelectedCodes();
};

const handleSearch = () => {
  // computed 自动响应
};

const handleConfirm = () => {};

defineExpose({
  selectList,
  getSelectedCodes: () => selectList.value.map((i) => i.value),
  getSelectedItems: () =>
    selectList.value.map((i) => ({
      value: i.value,
      name: i.name,
      label: i.label,
    })),
});

// ---------------------缓存方案
// 在 <script setup> 最顶部，加上这个缓存工具（零侵入）

// 缓存 Key（你可以改成动态的，比如加页面路径）
const CACHE_KEY = "CHECKBOX_TREE_PERSISTENT_STATE_v3";

// 缓存数据结构（极简化但足够强）
interface CachedTreeState {
  timestamp: number;
  checkedLeafCodes: string[]; // 所有被勾选的 docClassCode
  expandedNodeIds: number[]; // 用户手动展开过的节点（可选记忆展开状态）
}

// 读取缓存
const loadCache = (): CachedTreeState | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// 保存缓存（防抖 300ms）
let saveTimeout: any = null;
const saveCache = (state: CachedTreeState) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  }, 300);
};

// 防止在缓存还原时触发 emit 死循环
function updateParentStateFromChildren(parent: ITreeData) {
  const children = parent.childrenIds!.map((id) => nodeMap.value.get(id)!);
  const checkedCount = children.filter((c) => c.checked).length;
  const total = children.length;

  if (checkedCount === total) {
    parent.checked = true;
    parent.indeterminate = false;
  } else if (checkedCount === 0) {
    parent.checked = false;
    parent.indeterminate = false;
  } else {
    parent.checked = false;
    parent.indeterminate = true;
  }
}

onMounted(() => {
  allNodes.value = flattenData(realData);

  // 默认展开所有
  allNodes.value.forEach((n) => {
    if (!n.isLeaf) expandedNodes.value.add(n.id);
  });

  // === 重点：加载本地缓存并还原左侧树状态 ===
  const cache = loadCache();
  if (cache) {
    // 还原展开状态（可选）
    if (cache.expandedNodeIds?.length) {
      expandedNodes.value = new Set(cache.expandedNodeIds);
    }

    // 重点：还原所有叶子节点的勾选状态
    const codeSet = new Set(cache.checkedLeafCodes);
    allNodes.value.forEach((node) => {
      if (node.isLeaf && node.docClassCode && codeSet.has(node.docClassCode)) {
        node.checked = true;
      }
    });

    // 重新计算所有父节点三态
    allNodes.value.forEach((node) => {
      if (!node.isLeaf && node.childrenIds) {
        updateParentStateFromChildren(node);
      }
    });

    // 更新右侧 + 抛出 v-model
    nextTick(() => {
      updateSelectList();
      emitSelectedCodes();
    });
  }

  // 外部 v-model 优先级更高（如果有传入，就覆盖缓存）
  if (props.modelValue?.length) {
    applyExternalSelection(props.modelValue);
  }
});

// 在 handleCheck、removeItem、clearAll 最后，都加上这句：
const triggerCacheSave = () => {
  const checkedCodes: string[] = [];
  const expandedIds: number[] = [];

  allNodes.value.forEach((node) => {
    if (node.isLeaf && node.checked && node.docClassCode) {
      checkedCodes.push(node.docClassCode);
    }
    if (!node.isLeaf && expandedNodes.value.has(node.id)) {
      expandedIds.push(node.id);
    }
  });

  saveCache({
    timestamp: Date.now(),
    checkedLeafCodes: checkedCodes,
    expandedNodeIds: expandedIds,
  });
};

/**
 * 
 * // handleCheck 最后
updateSelectList();
emitSelectedCodes();
triggerCacheSave();  // 新增

// removeItem 最后
updateSelectList();
emitSelectedCodes();
triggerCacheSave();  // 新增

// clearAll 最后
emit("update:modelValue", []);
triggerCacheSave();  // 新增
 */
</script>

<style scoped>
/* ==================== 全局布局 ==================== */
.checkbox-transfer {
  display: flex;
  height: 100%;
  min-height: 480px;
  gap: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  background: #fff;
}

/* ==================== 左侧面板 ==================== */
.left-panel {
  width: 340px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 搜索区域 */
.input-search {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-bar input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.toggle-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: #f5f7fa;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.toggle-all-btn:hover {
  background: #e6f7ff;
  border-color: #409eff;
  color: #409eff;
}

.toggle-all-btn .expand-arrow {
  font-size: 10px;
  transition: transform 0.25s;
}

.toggle-all-btn .expand-arrow.expanded {
  transform: rotate(90deg);
}

/* 左侧树滚动区域 - 关键！ */
.checkbox-tree-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 必须加！解决 flex 嵌套滚动失效 */
  -webkit-overflow-scrolling: touch;
}

.checkbox-tree-container {
  padding: 8px 12px;
  min-height: 100px; /* 避免空状态太矮 */
}

/* ==================== 右侧面板 ==================== */
.right-panel {
  width: 280px;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 头部 */
.selected-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  flex-shrink: 0;
}

.selected-count {
  font-weight: 600;
  color: #333;
}

.clear-all {
  color: #ff4d4f;
  cursor: pointer;
  font-size: 13px;
}

.clear-all:hover {
  text-decoration: underline;
}

/* 右侧已选项滚动区域 - 关键！ */
.selected-items-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 必须加！ */
  -webkit-overflow-scrolling: touch;
}

.selected-items-list {
  padding: 8px 12px;
}

/* 已选项标签 */
.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 6px 0;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 13px;
  transition: background 0.2s;
}

.selected-item:hover {
  background: #e6f7ff;
}

.remove-item {
  cursor: pointer;
  font-weight: bold;
  color: #999;
  font-size: 18px;
}

.remove-item:hover {
  color: #ff4d4f;
}

/* 底部按钮 */
.action-footer {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
  flex-shrink: 0;
}

.confirm-btn {
  padding: 8px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-btn:hover {
  background: #66b1ff;
}

/* ==================== 树节点通用样式 ==================== */
.tree-node-wrapper {
  margin-bottom: 4px;
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  user-select: none;
  transition: background 0.2s;
}

.tree-node:hover {
  background: #f5f7fa;
}

.level-0 {
  font-weight: 600;
  color: #1f2329;
}

.level-1 {
  color: #555;
  padding-left: 22px;
}

.expand-arrow {
  cursor: pointer;
  margin-right: 6px;
  display: flex;
  align-items: center;
}

.expand-arrow svg {
  width: 12px;
  height: 12px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-arrow svg.expanded {
  transform: rotate(90deg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.checkbox-label input {
  margin-right: 8px;
}

.node-label {
  line-height: 1.4;
}

.highlight {
  background: #fff566;
  padding: 0 3px;
  border-radius: 3px;
  font-weight: 600;
}

.children-group {
  margin-left: 22px;
  overflow: hidden;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.28s ease;
  max-height: 2000px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0 !important;
  padding: 0 !important;
}

/* 空状态 */
.empty-tip {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

/* 调试输出 */
.result-output {
  margin: 12px;
  padding: 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}

/* ------------------ */
/* 在 style 中任意位置加这一行 */
.checkbox-label input:indeterminate + span::before,
.checkbox-label input[indeterminate] + span::before {
  background-position: -24px 0 !important; /* element-ui / antd 的横杠样式，Vue 原生没这个可忽略 */
}

/* 强制横杠时不显示对勾 */
.checkbox-label input[indeterminate] {
  background-image: none !important;
  background-color: #fff !important;
  border-color: #d9d9d9 !important;
}

.checkbox-label input[indeterminate]::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  background: #409eff;
  transform: translate(-50%, -50%);
}
</style>
