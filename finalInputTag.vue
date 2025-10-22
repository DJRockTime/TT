<template>
  <div
    class="input-tag-container"
    :class="[
      'el-input',
      `el-input--${props.size}`,
      `el-tag-input--${props.size}`,
      { 'is-disabled': effectiveDisabled },
    ]"
    @keydown="handleKeydown"
  >
    <div class="tags-wrapper">
      <template v-for="(tag, index) in visibleTags" :key="index">
        <span
          class="el-tag"
          :class="[
            `el-tag--${props.type || 'default'}`,
            `el-tag--${props.effect || 'light'}`,
            `el-tag--${props.size}`,
          ]"
        >
          {{ tag }}
          <button
            v-if="props.clearable && !props.disabled"
            type="button"
            class="el-tag__close"
            @click="deleteTag(index)"
          >
            ×
          </button>
        </span>
      </template>
      <div class="collapse-wrapper">
        <span
          v-if="restTags.length > 0"
          ref="collapseRef"
          class="el-tag collapse-tag"
          :class="[
            `el-tag--${props.type || 'default'}`,
            `el-tag--${props.effect || 'light'}`,
            `el-tag--${props.size}`,
          ]"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          +{{ restTags.length }}
        </span>
        <div
          v-show="showTooltip"
          class="custom-tooltip"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="tooltip-tags">
            <template v-for="(tag, index) in reversedRestTags" :key="index">
              <span
                class="el-tag"
                :class="[
                  `el-tag--${props.type || 'default'}`,
                  `el-tag--${props.effect || 'light'}`,
                  `el-tag--${props.size}`,
                ]"
              >
                {{ tag }}
                <button
                  v-if="props.clearable && !props.disabled"
                  type="button"
                  class="el-tag__close"
                  @click.stop="deleteRestTag(index)"
                >
                  ×
                </button>
              </span>
            </template>
          </div>
        </div>
      </div>
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
        :disabled="effectiveDisabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @paste="handlePaste"
      />
    </div>
    <button
      v-if="props.clearAll && tags.length > 0"
      type="button"
      class="clear-btn"
      :disabled="effectiveDisabled"
      @click="handleClear"
    >
      ×
    </button>
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
  maxCollapseTags?: number;
  type?: TagType;
  effect?: TagEffect;
  unique?: boolean;
  sort?: boolean;
  placeholder?: string;
  size?: TagSize;
  clearable?: boolean;
  clearAll?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  limit: undefined,
  maxCollapseTags: undefined,
  type: "default",
  effect: "light",
  unique: false,
  sort: false,
  placeholder: "",
  size: "normal",
  clearable: true,
  clearAll: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
  (e: "change", value: string[]): void;
  (e: "input", value: string): void;
  (e: "add-tag", tag: string): void;
  (e: "remove-tag", tag: string): void;
  (e: "clear-tag", tag: string): void;
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

const collapseRef = ref<HTMLElement>();

const showTooltip = ref(false);
const tooltipTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const effectiveDisabled = computed(
  () =>
    props.disabled ||
    (props.limit !== undefined && tags.value.length >= props.limit)
);

const visibleTags = computed(() => {
  const max = props.maxCollapseTags;
  if (max === undefined || tags.value.length <= max) {
    return tags.value;
  }
  return tags.value.slice(0, max);
});

const restTags = computed(() => {
  const max = props.maxCollapseTags;
  if (max === undefined || tags.value.length <= max) {
    return [];
  }
  return tags.value.slice(max);
});

const reversedRestTags = computed(() => [...restTags.value].reverse());

const handleMouseEnter = () => {
  if (tooltipTimer.value) {
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = null;
  }
  showTooltip.value = true;
};

const handleMouseLeave = () => {
  tooltipTimer.value = setTimeout(() => {
    showTooltip.value = false;
  }, 150);
};

const handlePaste = (event: ClipboardEvent) => {
  if (effectiveDisabled.value) return;
  event.preventDefault();
  const pastedText = event.clipboardData?.getData("text") || "";
  if (!pastedText) return;
  const parts = pastedText
    .split(/[\r\n,;]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  for (const part of parts) {
    if (props.unique && tags.value.includes(part)) continue;
    if (props.limit !== undefined && tags.value.length >= props.limit) break;
    tags.value.push(part);
    emit("add-tag", part);
  }
  if (props.sort) {
    tags.value.sort();
  }
  inputValue.value = "";
  nextTick(() => inputRef.value?.focus());
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("input", target.value);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (effectiveDisabled.value) {
    event.preventDefault();
    return;
  }
  if (
    event.key === "Backspace" &&
    inputValue.value === "" &&
    tags.value.length > 0
  ) {
    deleteTag(tags.value.length - 1);
    return;
  }
  if (event.key === "Enter" || event.key === " " || event.key === ",") {
    event.preventDefault();
    addTag();
  }
};

const addTag = () => {
  if (effectiveDisabled.value) return;
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
  if (props.disabled) return;
  const removedTag = tags.value.splice(index, 1)[0];
  emit("remove-tag", removedTag);
  emit("clear-tag", removedTag);
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const deleteRestTag = (restIndex: number) => {
  if (props.disabled) return;
  const originalIndex = restTags.value.length - 1 - restIndex;
  const actualIndex = (props.maxCollapseTags || 0) + originalIndex;
  deleteTag(actualIndex);
};

const handleClear = () => {
  if (effectiveDisabled.value) return;
  tags.value = [];
  emit("clear");
  nextTick(() => inputRef.value?.focus());
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
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

watch(restTags, (newVal) => {
  if (newVal.length === 0) {
    showTooltip.value = false;
    if (tooltipTimer.value) {
      clearTimeout(tooltipTimer.value);
      tooltipTimer.value = null;
    }
  }
});
</script>

<style scoped>
.input-tag-container {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: var(--el-input-border-radius, 4px);
  padding: 0 var(--el-input-padding, 9px);
  display: flex;
  align-items: center;
  background-color: var(--el-fill-color-blank, #fff);
  font-family: var(--el-font-family, inherit);
  line-height: 1.5;
  position: relative;
  min-height: var(--el-input-height, 32px);
}

.input-tag-container.is-disabled {
  background-color: var(--el-input-disabled-bg-color, #f5f7fa);
  border-color: var(--el-input-disabled-border-color, #e4e6f0);
  color: var(--el-text-color-disabled, #a8abb2);
  cursor: not-allowed;
}

.input-tag-container.is-disabled .el-input__inner {
  cursor: not-allowed;
  color: var(--el-text-color-disabled, #a8abb2);
  background-color: var(--el-input-disabled-bg-color, #f5f7fa);
}

.input-tag-container.is-disabled .el-tag {
  opacity: 0.6;
}

.input-tag-container.is-disabled .clear-btn,
.input-tag-container.is-disabled .collapse-tag {
  cursor: not-allowed;
  opacity: 0.6;
}

.input-tag-container.el-input--large {
  --el-input-height: 40px;
  --el-input-padding: 11px;
  min-height: 40px;
}

.input-tag-container.el-input--normal {
  --el-input-height: 32px;
  --el-input-padding: 9px;
  min-height: 32px;
}

.input-tag-container.el-input--small {
  --el-input-height: 28px;
  --el-input-padding: 7px;
  min-height: 28px;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: 28px;
  position: relative;
}

.input-tag-container.el-input--large .tags-wrapper {
  padding-right: 32px;
}

.input-tag-container.el-input--small .tags-wrapper {
  padding-right: 26px;
}

.collapse-wrapper {
  position: relative;
  display: inline-block;
}

.el-tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  flex-shrink: 0;
  margin: 2px 0;
  position: relative;
  color: var(--el-tag-text-color, #606266);
  background-color: var(--el-tag-bg-color, #e4e7ed);
  border: 1px solid var(--el-tag-border-color, #d9dde3);
  height: auto;
  line-height: normal;
}

.collapse-tag {
  cursor: pointer;
  margin: 2px 0;
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
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  z-index: 1;
  flex-shrink: 0;
}

.input-tag-container.el-input--large .clear-btn {
  font-size: 18px;
  width: 22px;
  height: 22px;
  right: 10px;
}

.input-tag-container.el-input--normal .clear-btn {
  font-size: 16px;
  width: 20px;
  height: 20px;
  right: 8px;
}

.input-tag-container.el-input--small .clear-btn {
  font-size: 14px;
  width: 18px;
  height: 18px;
  right: 6px;
}

.clear-btn:hover:not(:disabled) {
  color: var(--el-text-color-regular, #606266);
  background-color: rgba(0, 0, 0, 0.05);
}

.el-input__inner {
  border: none;
  outline: none;
  padding: 4px 0;
  background: transparent;
  flex: 1;
  min-width: 0;
  color: var(--el-input-text-color, #606266);
  font-size: inherit;
  line-height: inherit;
  box-sizing: border-box;
  margin: 2px 0;
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

.custom-tooltip {
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 200px;
  pointer-events: auto;
}

.tooltip-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  max-width: 300px;
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
