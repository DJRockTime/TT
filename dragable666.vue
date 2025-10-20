<template>
  <div class="table-container">
    <table class="sortable-table">
      <thead>
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>描述</th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr class="no-drag">
          <td>1</td>
          <td>固定行1</td>
          <td>这是不可拖拽的固定行</td>
        </tr>
        <tr class="no-drag">
          <td>2</td>
          <td>固定行2</td>
          <td>这是不可拖拽的固定行</td>
        </tr>
        <tr class="draggable-row" data-index="2">
          <td>3</td>
          <td>可拖行A</td>
          <td>可以拖拽互换位置，但只能在后三行间</td>
        </tr>
        <tr class="draggable-row" data-index="3">
          <td>4</td>
          <td>可拖行B</td>
          <td>可以拖拽互换位置，但只能在后三行间</td>
        </tr>
        <tr class="draggable-row" data-index="4">
          <td>5</td>
          <td>可拖行C</td>
          <td>可以拖拽互换位置，但只能在后三行间</td>
        </tr>
      </tbody>
    </table>
    <p>提示：尝试拖拽后三行，只能互换它们的位置，无法插入前两行。</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sortable from "sortablejs";

const tableBody = ref(null);

onMounted(() => {
  if (tableBody.value) {
    const sortable = Sortable.create(tableBody.value, {
      animation: 150, // 拖拽动画时长
      filter: ".no-drag", // 前两行添加 class="no-drag"，这样不可拖拽
      draggable: ".draggable-row", // 后三行添加 class="draggable-row"，指定可拖拽范围
      ghostClass: "sortable-ghost", // 占位符样式类（可选，需自定义CSS）
      onMove: function (evt) {
        // evt.newIndex 是目标插入位置（0-based索引）
        // 如果目标位置在前两行（< 2），阻止移动
        if (evt.newIndex < 2) {
          return false; // 阻止插入到前两行
        }
        return true; // 允许在后三行间移动
      },
      onStart: function (evt) {
        console.log("拖拽开始：原位置", evt.oldIndex); // start事件，可用于额外逻辑
      },
      onEnd: function (evt) {
        console.log("拖拽结束：新位置", evt.newIndex); // end事件，用于最终更新数据
        // 这里可以更新你的数据源，例如重新排序数组
        updateRowNumbers(); // 示例：更新序号
      },
    });
  }
});

// 示例：拖拽结束后更新序号（可选）
const updateRowNumbers = () => {
  const rows = tableBody.value.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const td = row.querySelector("td:first-child");
    if (td) {
      td.textContent = index + 1;
    }
  });
};
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

/* 前两行样式 */
.no-drag {
  background-color: #f9f9f9;
  font-weight: bold;
}

/* 可拖拽行样式 */
.draggable-row {
  cursor: move;
  transition: background-color 0.2s;
}

.draggable-row:hover {
  background-color: #f0f8ff;
}
</style>
