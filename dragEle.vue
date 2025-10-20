<template>
  <div class="table-container">
    <el-table
      ref="tableRef"
      :data="data"
      row-key="id"
      :row-class-name="rowClassName"
      height="400"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="description" label="描述" />
    </el-table>
    <p>
      提示：尝试拖拽pending状态的行，只能互换它们的位置，无法插入ongoing行。
    </p>
    <el-button type="primary" @click="fetchData">模拟加载数据</el-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";

const data = ref([]);
const tableRef = ref(null);
let sortable = null;
let fixedRowsCount = 0; // 动态计算的ongoing行数

// 示例数据（模拟后台返回）
const mockData = [
  {
    id: 1,
    name: "固定行A",
    status: "ongoing",
    description: "ongoing状态，不可拖拽",
  },
  {
    id: 2,
    name: "固定行B",
    status: "ongoing",
    description: "ongoing状态，不可拖拽",
  },
  {
    id: 3,
    name: "可拖行C",
    status: "pending",
    description: "pending状态，可拖拽",
  },
  {
    id: 4,
    name: "可拖行D",
    status: "pending",
    description: "pending状态，可拖拽",
  },
  {
    id: 5,
    name: "可拖行E",
    status: "pending",
    description: "pending状态，可拖拽",
  },
  {
    id: 6,
    name: "可拖行F",
    status: "pending",
    description: "pending状态，可拖拽",
  },
];

// 动态行class：基于status
const rowClassName = ({ row }) => {
  return row.status === "ongoing" ? "no-drag" : "draggable-row";
};

// 计算ongoing行数（假设ongoing总是前面的，但动态计数）
const calculateFixedRows = () => {
  fixedRowsCount = data.value.filter(
    (item) => item.status === "ongoing"
  ).length;
  console.log("固定行数（ongoing）:", fixedRowsCount);
};

// 模拟从后台加载数据
const fetchData = async () => {
  // 实际项目中，用axios/fetch替换
  data.value = [...mockData]; // 或随机打乱pending部分测试
  calculateFixedRows();
  await nextTick(); // 确保DOM更新
  // 重新初始化Sortable（如果数据变化）
  if (sortable) {
    sortable.destroy();
  }
  initSortable();
  ElMessage.success("数据加载完成");
};

// 初始化Sortable
const initSortable = () => {
  if (!tableRef.value) return;
  const tbody = tableRef.value.$el.querySelector(
    ".el-table__body-wrapper tbody"
  );
  if (!tbody) {
    console.warn("未找到tbody，延迟重试");
    setTimeout(initSortable, 100); // 延迟重试
    return;
  }

  sortable = Sortable.create(tbody, {
    animation: 150,
    filter: ".no-drag", // 动态class：ongoing为no-drag
    draggable: ".draggable-row", // 动态class：pending为draggable-row
    ghostClass: "sortable-ghost",
    onMove: function (evt) {
      // 动态限制：目标位置不能在前fixedRowsCount行
      if (evt.newIndex < fixedRowsCount) {
        return false; // 阻止插入到ongoing行
      }
      return true;
    },
    onStart: function (evt) {
      console.log("拖拽开始：原位置", evt.oldIndex, "ID:", evt.item.dataset.id);
    },
    onEnd: function (evt) {
      console.log("拖拽结束：新位置", evt.newIndex, "ID:", evt.item.dataset.id);
      updateDataOrder(); // 更新数据源顺序
      ElMessage.success("拖拽完成");
    },
  });
};

// 更新数据源顺序：ongoing不变，pending按拖拽后顺序重排
const updateDataOrder = () => {
  if (!sortable) return;

  const newOrder = sortable.toArray(); // 获取新顺序的data-id数组，如 ['1', '2', '3', '5', '4', '6']
  const idOrder = newOrder.map((id) => parseInt(id)); // 转int

  // 分离ongoing和pending
  const ongoingData = data.value.filter((item) => item.status === "ongoing");
  const pendingData = data.value.filter((item) => item.status === "pending");

  // 重新排序pending：基于idOrder中pending的id
  const sortedPending = idOrder
    .filter((id) => pendingData.some((item) => item.id === id)) // 只取pending id
    .map((id) => pendingData.find((item) => item.id === id)); // 匹配数据

  // 合并：ongoing + sortedPending
  data.value = [...ongoingData, ...sortedPending];
  console.log(
    "更新后数据顺序:",
    data.value.map((d) => ({ id: d.id, status: d.status }))
  );
};

onMounted(async () => {
  await fetchData(); // 初始加载
});
</script>

<style scoped>
.table-container {
  padding: 20px;
}

.sortable-ghost {
  opacity: 0.4 !important;
  background-color: #e0e0e0 !important;
}

.no-drag {
  background-color: #f9f9f9 !important;
  font-weight: bold !important;
}

.draggable-row {
  cursor: move !important;
  transition: background-color 0.2s !important;
}

.draggable-row:hover {
  background-color: #f0f8ff !important;
}

/* Element Plus 表格样式覆盖 */
:deep(.el-table .no-drag) {
  background-color: #f9f9f9 !important;
}

:deep(.el-table .draggable-row) {
  cursor: move !important;
}

:deep(.el-table .draggable-row:hover > td) {
  background-color: #f0f8ff !important;
}
</style>
