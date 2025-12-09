<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    show-summary
    :summary-method="summaryMethod"
    :span-method="spanMethod"
  >
    <!-- 第一列（跨两行） -->
    <el-table-column label="列1" prop="c1" width="120" />

    <!-- 2-3 列 -->
    <el-table-column label="组 2-3">
      <el-table-column prop="c2" label="列2" width="120" />
      <el-table-column prop="c3" label="列3" width="120" />
    </el-table-column>

    <!-- 4-5 列 -->
    <el-table-column label="组 4-5">
      <el-table-column prop="c4" label="列4" width="120" />
      <el-table-column prop="c5" label="列5" width="120" />
    </el-table-column>

    <!-- 6-7 列 -->
    <el-table-column label="组 6-7">
      <el-table-column prop="c6" label="列6" width="120" />
      <el-table-column prop="c7" label="列7" width="120" />
    </el-table-column>

    <!-- 8-9 列 -->
    <el-table-column label="组 8-9">
      <el-table-column prop="c8" label="列8" width="120" />
      <el-table-column prop="c9" label="列9" width="120" />
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from "vue";

/** 表格数据：3 行，第 1 行、第 2 行 + 第 3 行汇总 */
const tableData = ref([
  {
    c1: "行1",
    c2: 10,
    c3: 20,
    c4: 30,
    c5: 40,
    c6: 50,
    c7: 60,
    c8: 70,
    c9: 80,
  },
  {
    c1: "行2",
    c2: 1,
    c3: 2,
    c4: 3,
    c5: 4,
    c6: 5,
    c7: 6,
    c8: 7,
    c9: 8,
  },
  {
    c1: "汇总行",
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0,
    c6: 0,
    c7: 0,
    c8: 0,
    c9: 0,
  },
]);

/** 让第一列的前两行合并（rowspan = 2）*/
const spanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return [2, 1]; // 合并第 1、2 行
    } else if (rowIndex === 1) {
      return [0, 0]; // 隐藏第 2 行单元格
    }
  }
};

/** 汇总行计算 */
const summaryMethod = ({ columns, data }) => {
  const sums = [];
  sums[0] = "汇总";

  for (let i = 1; i < columns.length; i++) {
    const prop = columns[i].property;
    sums[i] = data
      .slice(0, 2) // 只汇总前两行
      .reduce((sum, r) => sum + Number(r[prop] || 0), 0);
  }
  return sums;
};
</script>

<style scoped></style>

<!-- ======================== 0 ======================== -->

<!-- <template>
  <el-table
    :data="tableData"
    :span-method="spanMethod"
    border
    style="width: 100%"
    :header-cell-style="{ background: '#f5f7fa' }"
  > -->
<!-- 9列都要写清楚 prop，哪怕是假的也没关系 -->
<!-- <el-table-column prop="c0" width="120" />
    <el-table-column prop="c1" />
    <el-table-column prop="c2" />
    <el-table-column prop="c3" />
    <el-table-column prop="c4" />
    <el-table-column prop="c5" />
    <el-table-column prop="c6" />
    <el-table-column prop="c7" />
    <el-table-column prop="c8" />
  </el-table>
</template> -->

<!-- <script setup>
import { ref } from "vue";

// 改成对象数组（推荐！最保险！）
const tableData = ref([
  {
    c0: "项目名称",
    c1: "销售指标",
    c2: null,
    c3: "利润指标",
    c4: null,
    c5: "成本指标",
    c6: null,
    c7: "库存指标",
    c8: null,
  },
  {
    c0: null,
    c1: "北京",
    c2: "上海",
    c3: "广州",
    c4: "深圳",
    c5: "杭州",
    c6: "成都",
    c7: "武汉",
    c8: "西安",
  },
  {
    c0: "合计",
    c1: "1500",
    c2: "2800",
    c3: "900",
    c4: "1200",
    c5: "800",
    c6: "1100",
    c7: "600",
    c8: "900",
  },
]);

const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 第一列前两行合并
  if (columnIndex === 0 && rowIndex <= 1) {
    return rowIndex === 0 ? [2, 1] : [0, 0];
  }

  // 第一行：每两个列合并一次（c1-c2, c3-c4, c5-c6, c7-c8）
  if (rowIndex === 0 && columnIndex >= 1) {
    if (columnIndex % 2 === 1) return [1, 2]; // 奇数列：显示并跨2列
    if (columnIndex % 2 === 0) return [0, 0]; // 偶数列：被合并，隐藏
  }

  return [1, 1];
};
</script> -->

<!-- ==================================2 =================================== -->

<!-- <template>
  <div class="my-table">
    <table
      border="1"
      cellspacing="0"
      style="width: 100%; border-collapse: collapse; text-align: center"
    >
      <tbody> -->
<!-- 第1行：左侧跨2行 + 4个组标题各跨2列 -->
<!-- <tr style="height: 60px">
          <td
            rowspan="2"
            style="width: 120px; background: #f5f7fa; font-weight: bold"
          >
            项目名称<br />（跨两行）
          </td>
          <td colspan="2" style="background: #eef1f6">销售指标</td>
          <td colspan="2" style="background: #eef1f6">利润指标</td>
          <td colspan="2" style="background: #eef1f6">成本指标</td>
          <td colspan="2" style="background: #eef1f6">库存指标</td>
        </tr> -->

<!-- 第2行：具体9个小格子 -->
<!-- <tr style="height: 50px">
          <td>北京</td>
          <td>上海</td>
          <td>广州</td>
          <td>深圳</td>
          <td>杭州</td>
          <td>成都</td>
          <td>武汉</td>
          <td>西安</td>
        </tr> -->

<!-- 第3行：汇总行 -->
<!-- <tr style="height: 50px; font-weight: bold; background: #fafafa">
          <td>合计</td>
          <td>1500</td>
          <td>2800</td>
          <td>900</td>
          <td>1200</td>
          <td>800</td>
          <td>1100</td>
          <td>600</td>
          <td>900</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.my-table table {
  font-size: 14px;
  border: 1px solid #e8e8e8;
}
.my-table td {
  border: 1px solid #e8e8e8;
  padding: 8px;
}
</style> -->

<!-- ==============================3============================= -->

<!-- <template>
  <el-table
    :data="tableData"
    :span-method="spanMethod"
    show-summary
    :summary-method="summaryMethod"
    border
    style="width: 100%"
  >
    <el-table-column prop="col1" label="列1" width="100" />
    <el-table-column prop="col2" label="列2" width="100" />
    <el-table-column prop="col3" label="列3" width="100" />
    <el-table-column prop="col4" label="列4" width="100" />
    <el-table-column prop="col5" label="列5" width="100" />
    <el-table-column prop="col6" label="列6" width="100" />
    <el-table-column prop="col7" label="列7" width="100" />
    <el-table-column prop="col8" label="列8" width="100" />
    <el-table-column prop="col9" label="列9" width="100" />
  </el-table>
</template>

<script setup>
import { ref } from "vue";

const tableData = ref([
  {
    col1: "合并值",
    col2: "组1标题",
    col3: null,
    col4: "组2标题",
    col5: null,
    col6: "组3标题",
    col7: null,
    col8: "组4标题",
    col9: null,
  },
  {
    col1: null,
    col2: "行2-col2值",
    col3: "行2-col3值",
    col4: "行2-col4值",
    col5: "行2-col5值",
    col6: "行2-col6值",
    col7: "行2-col7值",
    col8: "行2-col8值",
    col9: "行2-col9值",
  },
]);

// 自定义合并逻辑
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0 && columnIndex === 0) {
    return { rowspan: 2, colspan: 1 }; // 第一列行1-2合并
  } else if (rowIndex === 1 && columnIndex === 0) {
    return { rowspan: 0, colspan: 0 }; // 被合并，不显示
  } else if (rowIndex === 0) {
    if (columnIndex === 1) return { rowspan: 1, colspan: 2 }; // cols 2-3 第一行合并
    if (columnIndex === 2) return { rowspan: 0, colspan: 0 };
    if (columnIndex === 3) return { rowspan: 1, colspan: 2 }; // cols 4-5
    if (columnIndex === 4) return { rowspan: 0, colspan: 0 };
    if (columnIndex === 5) return { rowspan: 1, colspan: 2 }; // cols 6-7
    if (columnIndex === 6) return { rowspan: 0, colspan: 0 };
    if (columnIndex === 7) return { rowspan: 1, colspan: 2 }; // cols 8-9
    if (columnIndex === 8) return { rowspan: 0, colspan: 0 };
  }
  return { rowspan: 1, colspan: 1 }; // 默认不合并
};

// 自定义汇总行（第三行）
const summaryMethod = ({ columns, data }) => {
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "汇总"; // 第一列固定文本
    } else {
      // 示例：简单求和（假设数值），实际可自定义逻辑
      const values = data.map((item) => Number(item[column.property] || 0));
      sums[index] = values.reduce((prev, curr) => prev + curr, 0);
    }
  });
  return sums;
};
</script> -->

好！咱们把 `span-method`
这个函数彻底盘明白，**一次讲透，保你以后再也不怕合并单元格**！ ### span-method
到底是干嘛的？ Element Plus 官方文档一句话： >
通过该函数可以自定义**每个单元格**要合并几行几列（rowspan / colspan）
每次渲染表格里**每一个**格子时，el-table
都会调用一次这个函数，问你：“这个格子我要不要合并？要合并的话合并几行几列？”
你只要返回一个数组 `[rowspan, colspan]` 就行了。 ###
四个参数到底是什么？（超详细解释） ```js spanMethod({ row, column, rowIndex,
columnIndex }) ``` | 参数 | 类型 | 含义 | 举个例子（我们这个表） |
|---------------|----------------|----------------------------------------------------------------------|-----------------------|
| `row` | Object | 当前这**一行完整的数据对象**（就是 tableData 里的那一项） |
`{ c0: '项目名称', c1: '销售指标', c2: null, ... }` | | `column` | Object |
当前这**一列的配置对象**（el-table-column 的内部描述） | 包含 prop、label、width
等信息 | | `rowIndex` | Number | 当前行在 **data 数组中的下标**（从 0 开始） | 0
= 第一行，1 = 第二行，2 = 第三行 | | `columnIndex` | Number |
当前列在所有列中的下标（从 0 开始，**严格从左到右**） | 0 = 第一列（项目），1 =
第二列（北京），2 = 第三列（上海）… | **重点：rowIndex 和 columnIndex
才是你判断合并逻辑的“坐标”！** ### 返回值到底怎么写？四种情况 | 返回值 | 含义 |
实际效果 |
|----------------------------|------------------------------------------|----------------------------------|
| `[2, 1]` 或 `{ rowspan: 2, colspan: 1 }` | 这个格子显示，并且向下合并 2 行 |
垂直合并 | | `[1, 3]` | 这个格子显示，向右合并 3 列 | 水平合并 | | `[0, 0]` 或
`{ rowspan: 0, colspan: 0 }` | 这个格子**完全不显示**（被别人合并了） |
隐藏格子（必须这样写！） | | `[1, 1]`（默认） | 正常显示，不合并 | 普通格子 |
### 用我们这个表彻底走一遍逻辑 ```js const spanMethod = ({ row, column,
rowIndex, columnIndex }) => { // 情况1：第一列（项目名称）要跨前两行 → 垂直合并
if (columnIndex === 0) { if (rowIndex === 0) return [2, 1] //
第0行第0列：显示，并向下吃掉第1行 if (rowIndex === 1) return [0, 0] //
第1行第0列：被上面吃掉了，隐藏 } // 情况2：第一行里，四个大组标题要各跨2列 →
水平合并 if (rowIndex === 0 && columnIndex >= 1) { //
每组的“左边格子”是显示并合并的（列索引 1,3,5,7） if (columnIndex % 2 === 1) {
return [1, 2] // 显示，向右吃掉1列（总共跨2列） } //
每组的“右边格子”被吃掉了（列索引 2,4,6,8） if (columnIndex % 2 === 0) { return
[0, 0] // 隐藏 } } // 其他所有格子都不合并 return [1, 1] } ``` ###
完整最终版代码（最稳写法） ```vue
<template>
  <el-table
    :data="tableData"
    :span-method="spanMethod"
    border
    style="width: 100%"
  >
    <el-table-column prop="c0" width="120" align="center" />
    <el-table-column prop="c1" />
    <el-table-column prop="c2" />
    <el-table-column prop="c3" />
    <el-table-column prop="c4" />
    <el-table-column prop="c5" />
    <el-table-column prop="c6" />
    <el-table-column prop="c7" />
    <el-table-column prop="c8" />
  </el-table>
</template>

<script setup>
const tableData = [
  {
    c0: "项目名称",
    c1: "销售指标",
    c2: null,
    c3: "利润指标",
    c4: null,
    c5: "成本指标",
    c6: null,
    c7: "库存指标",
    c8: null,
  },
  {
    c0: null,
    c1: "北京",
    c2: "上海",
    c3: "广州",
    c4: "深圳",
    c5: "杭州",
    c6: "成都",
    c7: "武汉",
    c8: "西安",
  },
  {
    c0: "合计",
    c1: "1500",
    c2: "2800",
    c3: "900",
    c4: "1200",
    c5: "800",
    c6: "1100",
    c7: "600",
    c8: "900",
  },
];

const spanMethod = ({ rowIndex, columnIndex }) => {
  // 1. 第一列前两行合并
  if (columnIndex === 0) {
    if (rowIndex === 0) return [2, 1];
    if (rowIndex === 1) return [0, 0];
  }

  // 2. 第一行四个组标题各跨2列
  if (rowIndex === 0 && columnIndex > 0) {
    if (columnIndex % 2 === 1) return [1, 2]; // 1→跨1-2, 3→跨3-4, 5→跨5-6, 7→跨7-8
    if (columnIndex % 2 === 0) return [0, 0];
  }

  return [1, 1];
};
</script>s
``` 现在你彻底掌握了 `span-method` 的灵魂： - 用 `rowIndex` 和 `columnIndex`
判断“当前在哪个格子” - 想让谁显示并吃掉别人 → 返回 `[吃几行, 吃几列]` -
被吃掉的格子 → 必须返回 `[0, 0]` - 其他 → 返回 `[1, 1]`
以后不管多复杂的合并（比如 L 形、T
形、跨多行多列），你都能轻松搞定！要不要我再给你出几道“合并单元格”面试题练练手？

<!-- ======================================================================================= -->

完美！咱们用最直白、最形象的方式把 `rowspan` 和 `colspan` 这两个词彻底讲透，保证你 10 秒就记住，永远不会搞混！

### rowspan（row + span）  
意思是：**这个格子要纵向（上下）跨多少行**

- 英文：row = 行，span = 跨越  
- 方向：↓ 向下吃掉下面几行  
- 效果：让一个格子变“高”

| rowspan=1（默认） | rowspan=2 | rowspan=3 |
|-------------------|-----------|-----------|
| 只占自己这一行     | 吃掉下面1行<br>总共占2行高度 | 吃掉下面2行<br>总共占3行高度 |
| █                | ████████<br>███████ | ███████████<br>██████████<br>██████████ |

### colspan（column + span）  
意思是：**这个格子要横向（左右）跨多少列**

- 英文：column = 列，span = 跨越  
- 方向：→ 向右吃掉旁边几列  
- 效果：让一个格子变“宽”

| colspan=1（默认） | colspan=2 | colspan=4 |
|-------------------|-----------|-----------|
| 只占自己这一列     | 吃掉右边1列<br>总共占2列宽度 | 吃掉右边3列<br>总共占4列宽度 |
| █      █      █   | █████████      █ | ████████████████      █ |

### 在你的表格里实际怎么用（对应每一格）

我们这个 3 行 9 列的表，真正用到的合并就是下面这几种：

| 位置               | 要写在哪一格                     | 返回值            | 含义                                      |
|--------------------|----------------------------------|-------------------|-------------------------------------------|
| 左边大格子         | 第1行第1列（c0）                 | rowspan=2, colspan=1 → [2,1] | 向下吃掉第2行，高度变成2行高              |
| 被吃掉的格子       | 第2行第1列                       | [0,0]             | 必须隐藏！否则会多出一个格子把布局撑坏     |
| 销售指标（跨2列）  | 第1行第2列（c1）                 | rowspan=1, colspan=2 → [1,2] | 向右吃掉第3列，宽度变成2列宽              |
| 被“销售指标”吃掉的 | 第1行第3列（c2）                 | [0,0]             | 必须隐藏！                                |
| 利润指标（跨2列）  | 第1行第4列（c3）                 | [1,2]             | 向右吃掉第5列                              |
| …                  | 同理 c5、c7                      | [1,2]             | 每组标题都是这样                           |
| 所有普通格子       | 其他位置                         | [1,1]             | 正常显示，不合并                           |

### 经典记忆口诀（背下来就无敌了）

- **rowspan** = 我要**高**多少 → 看**竖着**吃几行  
- **colspan** = 我要**宽**多少 → 看**横着**吃几列  
- 被吃掉的格子永远写 `[0,0]`（必须写！不写会多出一格把表格撑爆）  
- 永远只有**第一个格子**写合并数字，其他被合并的格子写 `[0,0]`

现在你看这个图，一秒就能读懂整个合并逻辑：

```
[2,1]    [1,2]     [0,0]    [1,2]     [0,0]    [1,2]     [0,0]    [1,2]     [0,0]
项目名称  销售指标                     利润指标           成本指标           库存指标
[0,0]    北京     上海      广州     深圳      杭州     成都      武汉     西安
合计      1500    2800     900     1200     800     1100     600     900
```

记住这张图 + 上面口诀，以后不管多复杂的合并，你都能 30 秒写出 `span-method`！

要不要我再给你出一张“终极复杂合并”图，让你现场写一遍练练手？保证你写完就成合并之王！