<template>
  <div class="table-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户表格</span>
          <div class="actions">
            <el-button @click="toggleSelectAll" type="primary" size="small"
              >全选</el-button
            >
            <el-button @click="toggleSelectNone" type="primary" size="small"
              >全反选</el-button
            >
            <el-button
              @click="batchDelete"
              :disabled="multipleSelection.length === 0"
              type="danger"
              size="small"
              >批量删除</el-button
            >
          </div>
        </div>
      </template>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        @selection-change="handleSelectionChange"
        row-key="id"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="age" label="年龄" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button @click="handleDelete(row)" type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

interface User {
  id: number;
  name: string;
  age: number;
}

const multipleTableRef = ref();
const tableData = ref<User[]>([]);
const multipleSelection = ref<User[]>([]);
const loading = ref(false);

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

const toggleSelectAll = () => {
  if (multipleTableRef.value) {
    multipleTableRef.value.toggleAllSelection();
  }
};

const toggleSelectNone = () => {
  if (multipleTableRef.value) {
    multipleTableRef.value.clearSelection();
  }
};

const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定删除用户 ${row.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value = tableData.value.filter((item) => item.id !== row.id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const batchDelete = () => {
  if (multipleSelection.value.length === 0) return;
  ElMessageBox.confirm(
    `确定删除选中的 ${multipleSelection.value.length} 条数据？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      const ids = multipleSelection.value.map((item) => item.id);
      tableData.value = tableData.value.filter(
        (item) => !ids.includes(item.id)
      );
      multipleSelection.value = [];
      ElMessage.success("批量删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消批量删除");
    });
};

onMounted(() => {
  loading.value = true;
  // 模拟生成20条数据
  const data: User[] = [];
  for (let i = 1; i <= 20; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      age: Math.floor(Math.random() * (60 - 18 + 1)) + 18,
    });
  }
  tableData.value = data;
  loading.value = false;
});
</script>

<style lang="less" scoped>
.table-demo {
  padding: 20px;

  .box-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>
