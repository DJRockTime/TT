<template>
  <div>
    <section>
      <!-- lv1 -->
      <el-select
        v-model="lv1Value"
        placeholder="Select lv1"
        multiple
        clearable
        style="width: 240px"
      >
        <el-option
          v-for="item in lv1Options"
          :key="item.lv1Code"
          :label="item.lv1Name"
          :value="item.lv1Code"
        />
      </el-select>

      <!-- lv2 -->
      <el-select
        v-model="lv2Value"
        placeholder="Select lv2"
        multiple
        clearable
        style="width: 240px"
      >
        <el-option
          v-for="item in lv2Options"
          :key="item.lv2Code"
          :label="item.lv2Name"
          :value="item.lv2Code"
        />
      </el-select>

      <!-- lv3 -->
      <el-select
        v-model="itemValue"
        placeholder="Select docItem"
        multiple
        clearable
        style="width: 240px"
      >
        <el-option
          v-for="item in lv3ItemOptions"
          :key="item.docItemCode"
          :label="item.docItemName"
          :value="item.docItemCode"
        />
      </el-select>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// 原始数据
const newData = ref([
  {
    lv1Code: "001-1",
    lv1Name: "商业",
    lv2List: [
      {
        lv2Code: "002-1",
        lv2Name: "零售",
        docItems: [
          { docItemCode: "001-1-1", docItemName: "商品A" },
          { docItemCode: "001-1-2", docItemName: "商品B" },
        ],
      },
      {
        lv2Code: "002-2",
        lv2Name: "批发",
        docItems: [
          { docItemCode: "001-2-1", docItemName: "大宗商品" },
          { docItemCode: "001-2-2", docItemName: "农产品" },
        ],
      },
    ],
  },
  {
    lv1Code: "001-2",
    lv1Name: "制造业",
    lv2List: [
      {
        lv2Code: "003-1",
        lv2Name: "机械制造",
        docItems: [
          { docItemCode: "002-1-1", docItemName: "机床" },
          { docItemCode: "002-1-2", docItemName: "液压设备" },
        ],
      },
      {
        lv2Code: "003-2",
        lv2Name: "电子制造",
        docItems: [
          { docItemCode: "002-2-1", docItemName: "电路板" },
          { docItemCode: "002-2-2", docItemName: "芯片" },
        ],
      },
    ],
  },
  {
    lv1Code: "001-3",
    lv1Name: "教育",
    lv2List: [
      {
        lv2Code: "004-1",
        lv2Name: "高等教育",
        docItems: [
          { docItemCode: "003-1-1", docItemName: "教材A" },
          { docItemCode: "003-1-2", docItemName: "教材B" },
        ],
      },
      {
        lv2Code: "004-2",
        lv2Name: "职业培训",
        docItems: [
          { docItemCode: "003-2-1", docItemName: "技能课程A" },
          { docItemCode: "003-2-2", docItemName: "技能课程B" },
        ],
      },
    ],
  },
  {
    lv1Code: "001-4",
    lv1Name: "医疗",
    lv2List: [
      {
        lv2Code: "005-1",
        lv2Name: "医疗器械",
        docItems: [
          { docItemCode: "004-1-1", docItemName: "呼吸机" },
          { docItemCode: "004-1-2", docItemName: "监护仪" },
        ],
      },
      {
        lv2Code: "005-2",
        lv2Name: "药品销售",
        docItems: [
          { docItemCode: "004-2-1", docItemName: "感冒药" },
          { docItemCode: "004-2-2", docItemName: "抗生素" },
        ],
      },
    ],
  },
  {
    lv1Code: "001-5",
    lv1Name: "金融",
    lv2List: [
      {
        lv2Code: "006-1",
        lv2Name: "银行业务",
        docItems: [
          { docItemCode: "005-1-1", docItemName: "个人贷款" },
          { docItemCode: "005-1-2", docItemName: "企业融资" },
        ],
      },
      {
        lv2Code: "006-2",
        lv2Name: "保险服务",
        docItems: [
          { docItemCode: "005-2-1", docItemName: "车险" },
          { docItemCode: "005-2-2", docItemName: "健康险" },
        ],
      },
    ],
  },
]);

// 响应式变量
const lv1Value = ref<string[]>([]);
const lv2Value = ref<string[]>([]);
const itemValue = ref<string[]>([]);

const lv1Options = ref<any[]>([]);
const lv2Options = ref<any[]>([]);
const lv3ItemOptions = ref<any[]>([]);

// docItemCode -> lv2Code, lv1Code 映射
const docItemMap = ref(new Map());
const lv2Map = ref(new Map());

/** 初始化处理 **/
// 初始化选项，不设置默认选中项
function initOptions() {
  lv2Map.value.clear();
  docItemMap.value.clear();

  newData.value.forEach((lv1) => {
    lv1.lv2List.forEach((lv2) => {
      lv2Map.value.set(lv2.lv2Code, {
        ...lv2,
        lv1Code: lv1.lv1Code,
      });

      lv2.docItems?.forEach((doc) => {
        docItemMap.value.set(doc.docItemCode, {
          ...doc,
          lv2Code: lv2.lv2Code,
          lv1Code: lv1.lv1Code,
        });
      });
    });
  });

  updateOptions();
}

function updateOptions() {
  // lv1 始终全量
  lv1Options.value = newData.value.map((lv1) => ({
    lv1Code: lv1.lv1Code,
    lv1Name: lv1.lv1Name,
  }));

  // lv2Options: 基于 lv1Value 过滤
  if (lv1Value.value.length > 0) {
    const allowedLv1Set = new Set(lv1Value.value);
    const temp: any[] = [];
    newData.value.forEach((lv1) => {
      if (allowedLv1Set.has(lv1.lv1Code)) {
        lv1.lv2List.forEach((lv2) => {
          temp.push({
            lv2Code: lv2.lv2Code,
            lv2Name: lv2.lv2Name,
          });
        });
      }
    });
    lv2Options.value = temp;
  } else {
    const temp: any[] = [];
    lv2Map.value.forEach((lv2) => {
      temp.push({
        lv2Code: lv2.lv2Code,
        lv2Name: lv2.lv2Name,
      });
    });
    lv2Options.value = temp;
  }

  // lv3ItemOptions: 优先基于 lv2Value，其次 lv1Value，否则全量
  if (lv2Value.value.length > 0) {
    const allowedLv2Set = new Set(lv2Value.value);
    const temp: any[] = [];
    lv2Map.value.forEach((lv2, lv2Code) => {
      if (allowedLv2Set.has(lv2Code)) {
        lv2.docItems?.forEach((doc) => {
          temp.push({
            docItemCode: doc.docItemCode,
            docItemName: doc.docItemName,
          });
        });
      }
    });
    lv3ItemOptions.value = temp;
  } else if (lv1Value.value.length > 0) {
    const allowedLv1Set = new Set(lv1Value.value);
    const temp: any[] = [];
    newData.value.forEach((lv1) => {
      if (allowedLv1Set.has(lv1.lv1Code)) {
        lv1.lv2List.forEach((lv2) => {
          lv2.docItems?.forEach((doc) => {
            temp.push({
              docItemCode: doc.docItemCode,
              docItemName: doc.docItemName,
            });
          });
        });
      }
    });
    lv3ItemOptions.value = temp;
  } else {
    const temp: any[] = [];
    docItemMap.value.forEach((doc) => {
      temp.push({
        docItemCode: doc.docItemCode,
        docItemName: doc.docItemName,
      });
    });
    lv3ItemOptions.value = temp;
  }
}

// 监听 lv1Value
watch(
  lv1Value,
  (newVal, oldVal) => {
    const removed = oldVal.filter((x) => !newVal.includes(x));

    if (removed.length > 0 || newVal.length !== oldVal.length) {
      // 移除孤儿 lv2
      const allowedLv1Set = new Set(newVal);
      lv2Value.value = lv2Value.value.filter((code) =>
        allowedLv1Set.has(lv2Map.value.get(code)?.lv1Code)
      );
    }

    updateOptions();
  },
  { deep: true }
);

// 监听 lv2Value
watch(
  lv2Value,
  (newVal, oldVal) => {
    const added = newVal.filter((x) => !oldVal.includes(x));
    const removed = oldVal.filter((x) => !newVal.includes(x));

    // 为新增的添加父级 lv1
    added.forEach((code) => {
      const parentLv1 = lv2Map.value.get(code)?.lv1Code;
      if (parentLv1 && !lv1Value.value.includes(parentLv1)) {
        lv1Value.value.push(parentLv1);
      }
    });

    if (removed.length > 0 || newVal.length !== oldVal.length) {
      // 移除孤儿 lv3
      const allowedLv2Set = new Set(newVal);
      itemValue.value = itemValue.value.filter((code) =>
        allowedLv2Set.has(docItemMap.value.get(code)?.lv2Code)
      );
    }

    updateOptions();
  },
  { deep: true }
);

// 监听 itemValue
watch(
  itemValue,
  (newVal, oldVal) => {
    const added = newVal.filter((x) => !oldVal.includes(x));

    // 为新增的添加父级 lv2 和 lv1
    added.forEach((code) => {
      const mapVal = docItemMap.value.get(code);
      if (mapVal) {
        const parentLv2 = mapVal.lv2Code;
        if (parentLv2 && !lv2Value.value.includes(parentLv2)) {
          lv2Value.value.push(parentLv2);
        }
        const parentLv1 = mapVal.lv1Code;
        if (parentLv1 && !lv1Value.value.includes(parentLv1)) {
          lv1Value.value.push(parentLv1);
        }
      }
    });

    updateOptions();
  },
  { deep: true }
);

// 初始化数据
initOptions();
</script>
