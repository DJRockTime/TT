<template>
  <div class="table-container">
    <table class="sortable-table">
      <thead>
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>状态</th>
          <th>描述</th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr
          v-for="(item, index) in data"
          :key="item.id"
          :class="item.status === 'ongoing' ? 'no-drag' : 'draggable-row'"
          :data-id="item.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>
    <p>
      提示：尝试拖拽pending状态的行，只能互换它们的位置，无法插入ongoing行。
    </p>
    <button @click="fetchData">模拟加载数据</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sortable from "sortablejs";

const data = ref([]);
const tableBody = ref(null);
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

// 计算ongoing行数（假设ongoing总是前面的，但动态计数）
const calculateFixedRows = () => {
  fixedRowsCount = data.value.filter(
    (item) => item.status === "ongoing"
  ).length;
  console.log("固定行数（ongoing）:", fixedRowsCount);
};

// 模拟从后台加载数据
const fetchData = () => {
  // 实际项目中，用axios/fetch替换
  data.value = [...mockData]; // 或随机打乱pending部分测试
  calculateFixedRows();
  // 重新初始化Sortable（如果数据变化）
  if (sortable) {
    sortable.destroy();
  }
  initSortable();
};

// 初始化Sortable
const initSortable = () => {
  if (!tableBody.value) return;

  sortable = Sortable.create(tableBody.value, {
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
      updateRowNumbers(); // 更新序号
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

// 更新序号
const updateRowNumbers = () => {
  const rows = tableBody.value.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const td = row.querySelector("td:first-child");
    if (td) {
      td.textContent = index + 1;
    }
  });
};

onMounted(() => {
  fetchData(); // 初始加载
});
</script>

<style scoped>
.table-container {
  padding: 20px;
}

.sortable-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.sortable-ghost {
  opacity: 0.4;
  background-color: #e0e0e0;
}

.no-drag {
  background-color: #f9f9f9;
  font-weight: bold;
}

.draggable-row {
  cursor: move;
  transition: background-color 0.2s;
}

.draggable-row:hover {
  background-color: #f0f8ff;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
