<template>
  <div class="gradient-progress" :style="{ height, width }">
    <div class="base-bar" :style="{ background: baseGradient }"></div>
    <div class="label">{{ formatValue(modelValue) }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  positiveColor: {
    type: String,
    default: "#ff0000", // 红色
  },
  negativeColor: {
    type: String,
    default: "#00ff00", // 绿色
  },
  height: {
    type: String,
    default: "20px", // 默认高度，可自定义粗细
  },
  width: {
    type: String,
    default: "100%", // 默认全宽，不传适应列宽
  },
});

const emit = defineEmits(["update:modelValue"]);

const baseGradient = computed(() => {
  const absValue = Math.abs(props.modelValue);
  const whitePercent = (1 - absValue) * 100;
  const fillColor =
    props.modelValue >= 0 ? props.positiveColor : props.negativeColor;

  if (absValue === 0) {
    return "#ffffff"; // 0% 时纯白，无渐变
  }

  // 从左到右：纯白 0% ~ whitePercent%，然后从 whitePercent% 渐变到实色 100%
  return `linear-gradient(to right, 
    #ffffff 0%, 
    #ffffff ${whitePercent}%, 
    ${fillColor} 100%
  )`;
});

const formatValue = (value) => {
  const percent = Math.abs(value * 100).toFixed(0);
  return value >= 0 ? `${percent}%` : `-${percent}%`;
};

// v-model 支持（未使用时可忽略）
const updateValue = (newValue) => emit("update:modelValue", newValue);
</script>

<style scoped>
.gradient-progress {
  position: relative;
  /* 高度和宽度通过 :style 动态绑定 */
}

.base-bar {
  width: 100%;
  height: 100%;
}

.label {
  position: absolute;
  left: 4px; /* 靠左对齐，留点边距 */
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #333;
  z-index: 1;
  font-weight: bold;
  white-space: nowrap; /* 防止文字换行 */
}
</style>
