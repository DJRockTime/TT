<template>
  <div
    class="input-tag-container"
    :class="[
      'el-input',
      `el-input--${props.size}`,
      `el-tag-input--${props.size}`,
    ]"
    @keydown="handleKeydown"
  >
    <div
      class="tags-wrapper"
      :style="{ display: 'flex', 'flex-wrap': 'wrap', gap: '4px' }"
    >
      <template v-for="(tag, index) in tags" :key="index">
        <span
          class="el-tag"
          :class="[
            `el-tag--${props.type || 'default'}`,
            `el-tag--${props.effect || 'light'}`,
            `el-tag--${props.size}`,
          ]"
        >
          {{ tag }}
          <button type="button" class="el-tag__close" @click="deleteTag(index)">
            ×
          </button>
        </span>
      </template>
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="el-input__inner"
        :placeholder="
          tags.length === 0
            ? props.placeholder
            : props.limit !== undefined && tags.length >= props.limit
            ? '已达上限'
            : ''
        "
        :disabled="props.limit !== undefined && tags.length >= props.limit"
        :style="{ flex: '1', minWidth: '100px', 'padding-left': '3px' }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="tags.length > 0"
        type="button"
        class="clear-btn"
        @click="handleClear"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

type TagType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";
type TagEffect = "light" | "dark" | "plain";
type TagSize = "small" | "normal" | "large";

interface Props {
  modelValue: string[];
  limit?: number;
  type?: TagType;
  effect?: TagEffect;
  unique?: boolean;
  sort?: boolean;
  placeholder?: string;
  size?: TagSize;
}

const props = withDefaults(defineProps<Props>(), {
  limit: undefined,
  type: "default",
  effect: "light",
  unique: false,
  sort: false,
  placeholder: "",
  size: "normal",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
  (e: "change", value: string[]): void;
  (e: "input", value: string): void;
  (e: "add-tag", tag: string): void;
  (e: "remove-tag", tag: string): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "clear"): void;
}>();

const tags = computed({
  get: () => props.modelValue,
  set: (value: string[]) => {
    emit("update:modelValue", value);
    emit("change", value);
  },
});

const inputRef = ref<HTMLInputElement>();
const inputValue = ref("");

const isDisabled = computed(
  () => props.limit !== undefined && tags.value.length >= props.limit
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("input", target.value);
  if (isDisabled.value) {
    inputValue.value = "";
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.key === "Backspace" &&
    inputValue.value === "" &&
    tags.value.length > 0
  ) {
    // 无论disabled与否，都允许Backspace删除最后一个标签
    deleteTag(tags.value.length - 1);
    return;
  }
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }
  if (event.key === "Enter" || event.key === " " || event.key === ",") {
    event.preventDefault();
    addTag();
  }
};

const addTag = () => {
  const value = inputValue.value.trim();
  if (!value) return;
  if (props.unique && tags.value.includes(value)) return;
  if (props.limit !== undefined && tags.value.length >= props.limit) return;
  tags.value = [...tags.value, value];
  emit("add-tag", value);
  if (props.sort) {
    tags.value.sort();
  }
  inputValue.value = "";
  nextTick(() => inputRef.value?.focus());
};

const deleteTag = (index: number) => {
  const removedTag = tags.value.splice(index, 1)[0];
  emit("remove-tag", removedTag);
  nextTick(() => {
    if (!isDisabled.value) {
      inputRef.value?.focus();
    }
  });
};

const handleClear = () => {
  tags.value = [];
  emit("clear");
  nextTick(() => inputRef.value?.focus());
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
  // 失焦时添加标签
  addTag();
};

onMounted(() => {
  inputRef.value?.focus();
});

watch(
  () => props.modelValue,
  (newVal) => {
    // 外部更新时同步
  },
  { deep: true }
);
</script>

<style scoped>
.input-tag-container {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: var(--el-input-border-radius, 4px);
  padding: 4px;
  display: flex;
  align-items: flex-start;
  background-color: var(--el-fill-color-blank, #fff);
  font-family: var(--el-font-family, inherit);
  line-height: 1.5;
}

.input-tag-container.el-input--large {
  --el-input-height: 40px;
  --el-input-padding: 0 11px;
  padding: 0 11px;
  min-height: 40px;
}

.input-tag-container.el-input--normal {
  --el-input-height: 32px;
  --el-input-padding: 0 9px;
  padding: 0 9px;
  min-height: 32px;
}

.input-tag-container.el-input--small {
  --el-input-height: 28px;
  --el-input-padding: 0 7px;
  padding: 0 7px;
  min-height: 28px;
}

.tags-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.el-tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  flex-shrink: 0;
  margin: 2px;
  position: relative;
  color: var(--el-tag-text-color, #606266);
  background-color: var(--el-tag-bg-color, #e4e7ed);
  border: 1px solid var(--el-tag-border-color, #d9dde3);
}

.el-tag.el-tag--large {
  height: 32px;
  padding: 0 11px;
  line-height: 30px;
  font-size: 14px;
  border-radius: 4px;
}

.el-tag.el-tag--normal {
  height: 24px;
  padding: 0 8px;
  line-height: 20px;
  font-size: 12px;
  border-radius: 4px;
}

.el-tag.el-tag--small {
  height: 20px;
  padding: 0 6px;
  line-height: 18px;
  font-size: 11px;
  border-radius: 3px;
}

.el-tag__close {
  margin-left: 4px;
  cursor: pointer;
  color: inherit;
  background-color: transparent;
  border: none;
  font-size: 12px;
  line-height: 1;
  padding: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.el-tag.el-tag--large .el-tag__close {
  font-size: 14px;
  width: 14px;
  height: 14px;
}

.el-tag.el-tag--small .el-tag__close {
  font-size: 10px;
  width: 10px;
  height: 10px;
}

.el-tag__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--el-text-color-placeholder, #a8abb2);
  font-size: 16px;
  line-height: 1;
  padding: 0 4px;
  margin-left: 4px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.clear-btn:hover {
  color: var(--el-text-color-regular, #606266);
  background-color: rgba(0, 0, 0, 0.05);
}

.input-tag-container.el-input--large .clear-btn {
  font-size: 18px;
  width: 18px;
  height: 18px;
}

.input-tag-container.el-input--small .clear-btn {
  font-size: 14px;
  width: 14px;
  height: 14px;
}

.el-input__inner {
  border: none;
  outline: none;
  padding: 4px 0;
  background: transparent;
  min-width: 100px;
  flex: 1 1 auto;
  color: var(--el-input-text-color, #606266);
  font-size: inherit;
  line-height: inherit;
}

.input-tag-container.el-input--large .el-input__inner {
  font-size: 16px;
  padding: 8px 0;
}

.input-tag-container.el-input--normal .el-input__inner {
  font-size: 14px;
  padding: 4px 0;
}

.input-tag-container.el-input--small .el-input__inner {
  font-size: 13px;
  padding: 2px 0;
}

.el-input__inner:focus {
  outline: none;
}

.el-input__inner:disabled {
  cursor: not-allowed;
  color: var(--el-text-color-placeholder, #a8abb2);
  background-color: var(--el-input-disabled-bg-color, #f5f7fa);
}

/* Type Styles - Based on Element Plus */
.el-tag--primary {
  --el-tag-bg-color: #409eff;
  --el-tag-text-color: #fff;
  --el-tag-border-color: #409eff;
}

.el-tag--success {
  --el-tag-bg-color: #67c23a;
  --el-tag-text-color: #fff;
  --el-tag-border-color: #67c23a;
}

.el-tag--warning {
  --el-tag-bg-color: #e6a23c;
  --el-tag-text-color: #fff;
  --el-tag-border-color: #e6a23c;
}

.el-tag--danger {
  --el-tag-bg-color: #f56c6c;
  --el-tag-text-color: #fff;
  --el-tag-border-color: #f56c6c;
}

.el-tag--info {
  --el-tag-bg-color: #909399;
  --el-tag-text-color: #fff;
  --el-tag-border-color: #909399;
}

.el-tag--default {
  --el-tag-bg-color: #e4e7ed;
  --el-tag-text-color: #606266;
  --el-tag-border-color: #d9dde3;
}

/* Effect Styles - Based on Element Plus */
.el-tag--light {
  background-color: rgba(var(--el-tag-bg-color-rgb, 64, 158, 255), 0.1);
  border-color: rgba(var(--el-tag-bg-color-rgb, 64, 158, 255), 0.2);
  color: var(--el-tag-bg-color);
}

.el-tag--light.el-tag--primary {
  --el-tag-bg-color-rgb: 64, 158, 255;
}
.el-tag--light.el-tag--success {
  --el-tag-bg-color-rgb: 103, 194, 58;
}
.el-tag--light.el-tag--warning {
  --el-tag-bg-color-rgb: 230, 162, 60;
}
.el-tag--light.el-tag--danger {
  --el-tag-bg-color-rgb: 245, 108, 108;
}
.el-tag--light.el-tag--info {
  --el-tag-bg-color-rgb: 144, 147, 153;
}
.el-tag--light.el-tag--default {
  --el-tag-bg-color-rgb: 228, 231, 237;
  color: #606266;
  border-color: #d9dde3;
  background-color: #e4e7ed;
}

.el-tag--dark {
  background-color: var(--el-tag-bg-color);
  color: #fff;
  border-color: var(--el-tag-bg-color);
}

.el-tag--dark .el-tag__close {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
}

.el-tag--dark .el-tag__close:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.el-tag--plain {
  background-color: #fff;
  border-color: var(--el-tag-border-color);
  color: var(--el-tag-bg-color);
}

.el-tag--plain.el-tag--default {
  border-color: #d9dde3;
  color: #606266;
}

.el-tag--plain .el-tag__close {
  color: var(--el-tag-bg-color);
}

.el-tag--plain .el-tag__close:hover {
  background-color: rgba(var(--el-tag-bg-color-rgb, 64, 158, 255), 0.1);
}

.el-tag--plain.el-tag--primary {
  --el-tag-bg-color-rgb: 64, 158, 255;
}
.el-tag--plain.el-tag--success {
  --el-tag-bg-color-rgb: 103, 194, 58;
}
.el-tag--plain.el-tag--warning {
  --el-tag-bg-color-rgb: 230, 162, 60;
}
.el-tag--plain.el-tag--danger {
  --el-tag-bg-color-rgb: 245, 108, 108;
}
.el-tag--plain.el-tag--info {
  --el-tag-bg-color-rgb: 144, 147, 153;
}
</style>
