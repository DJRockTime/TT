<template>
  <div class="notification-overlay" @click.self="close">
    <div
      ref="panelRef"
      class="notification-panel"
      :class="[theme]"
      :style="{ width: `${panelWidth}px` }"
    >
      <!-- Resize Handle -->
      <div ref="resizeHandleRef" class="resize-handle"></div>

      <!-- Header with Theme Toggle, Notify, Reload All, and Clear All -->
      <div class="panel-header">
        <div class="left-section">
          <div
            class="theme-circle"
            :class="[theme]"
            @click="$emit('toggle-theme')"
          ></div>
          <span class="notify-label">Notify</span>
        </div>
        <div class="right-section">
          <button
            class="reload-all"
            :disabled="messages.length > 0"
            @click="$emit('reload-all')"
          >
            Reload All
          </button>
          <button class="clear-all" @click="clearAll">Clear All</button>
        </div>
      </div>

      <!-- Messages List -->
      <div ref="messagesContainerRef" class="messages-container">
        <div v-if="messages.length === 0" class="no-data">No Data yet</div>
        <div
          v-else
          v-for="msg in messages"
          :key="msg.id"
          ref="messageRefs"
          class="message-item"
        >
          <div class="message-header">
            <h3>{{ msg.title }}</h3>
            <svg
              class="close-icon"
              @click="remove(msg.id)"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="content">{{ msg.content }}</p>
          <p class="sender">From: {{ msg.sender }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useTemplateRef } from "vue";
import anime from "animejs";

interface Message {
  id: number;
  title: string;
  content: string;
  sender: string;
  unread: boolean;
}

const props = defineProps<{
  messages: Message[];
  theme: "light" | "dark";
  initialWidth?: number;
}>();

const emit = defineEmits([
  "close",
  "clear-all",
  "remove-message",
  "toggle-theme",
  "update-width",
  "reload-all",
]);

const panelRef = useTemplateRef<HTMLDivElement>("panelRef");
const messagesContainerRef = useTemplateRef<HTMLDivElement>(
  "messagesContainerRef"
);
const messageRefs = useTemplateRef<HTMLDivElement[]>("messageRefs");
const resizeHandleRef = useTemplateRef<HTMLDivElement>("resizeHandleRef");
const isDeleting = ref(false);
const panelWidth = ref(props.initialWidth || 300);

const startResize = (event: MouseEvent | TouchEvent) => {
  const startX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const startWidth = panelWidth.value;

  const onMove = (moveEvent: MouseEvent | TouchEvent) => {
    const currentX =
      "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
    const deltaX = startX - currentX;
    let newWidth = startWidth + deltaX;
    newWidth = Math.max(210, Math.min(560, newWidth));
    panelWidth.value = newWidth;
    emit("update-width", newWidth);
  };

  const onEnd = () => {
    document.body.style.cursor = "auto";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);
  };

  document.body.style.cursor = "ew-resize";
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchmove", onMove);
  document.addEventListener("touchend", onEnd);
};

const close = async () => {
  if (panelRef.value) {
    await anime({
      targets: panelRef.value,
      translateX: [0, "100%"],
      opacity: [1, 0],
      duration: 100,
      easing: "easeInQuad",
    }).finished;
  }
  emit("close");
};

const remove = async (id: number) => {
  const index = props.messages.findIndex((msg) => msg.id === id);
  if (index === -1 || !messageRefs.value?.[index]) return;

  isDeleting.value = true;
  const target = messageRefs.value[index];

  await anime({
    targets: target,
    translateX: ["0%", "100%"],
    opacity: [1, 0],
    duration: 300,
    easing: "easeInOutQuad",
  }).finished;

  const remainingTargets = messageRefs.value.slice(index);
  remainingTargets.forEach((target) =>
    target.classList.add("message-transition")
  );

  emit("remove-message", id);
  await nextTick();

  await new Promise((resolve) => setTimeout(resolve, 400));
  remainingTargets.forEach((target) =>
    target.classList.remove("message-transition")
  );

  const isLastMessage = props.messages.length === 0;
  if (isLastMessage && panelRef.value) {
    await anime({
      targets: panelRef.value,
      translateX: [0, "100%"],
      opacity: [1, 0],
      duration: 100,
      easing: "easeInQuad",
    }).finished;
    emit("close");
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  isDeleting.value = false;
};

const clearAll = async () => {
  if (messageRefs.value && messageRefs.value.length > 0) {
    await anime({
      targets: messageRefs.value,
      translateX: ["0%", "100%"],
      opacity: [1, 0],
      duration: 300,
      delay: anime.stagger(50, { from: "last" }),
      easing: "easeInOutQuad",
    }).finished;
  }
  if (panelRef.value) {
    await anime({
      targets: panelRef.value,
      translateX: [0, "100%"],
      opacity: [1, 0],
      duration: 100,
      easing: "easeInQuad",
    }).finished;
  }
  emit("clear-all");
  emit("close");
};

const animateIn = () => {
  if (panelRef.value) {
    anime({
      targets: panelRef.value,
      translateX: ["100%", 0],
      opacity: [0, 1],
      duration: 100,
      easing: "easeOutQuad",
    });
  }
  animateMessagesIn();
};

const animateMessagesIn = () => {
  if (isDeleting.value || !messageRefs.value || messageRefs.value.length === 0)
    return;
  anime({
    targets: messageRefs.value,
    translateX: ["100%", 0],
    opacity: [0, 1],
    duration: 200,
    delay: anime.stagger(50, { start: 50 }),
    easing: "linear",
  });
};

const enableSmoothScroll = () => {
  if (messagesContainerRef.value) {
    const container = messagesContainerRef.value;
    container.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      container.scrollTop += evt.deltaY;
    });
  }
};

onMounted(() => {
  animateIn();
  enableSmoothScroll();
  if (resizeHandleRef.value) {
    resizeHandleRef.value.addEventListener("mousedown", startResize);
    resizeHandleRef.value.addEventListener("touchstart", startResize);
  }
});

onUnmounted(() => {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.removeEventListener("wheel", () => {});
  }
  if (resizeHandleRef.value) {
    resizeHandleRef.value.removeEventListener("mousedown", startResize);
    resizeHandleRef.value.removeEventListener("touchstart", startResize);
  }
});

watch(
  () => props.messages.length,
  (newLength, oldLength: any) => {
    if (isDeleting.value || newLength <= oldLength) return;
    nextTick(() => {
      if (!isDeleting.value) animateMessagesIn();
    });
  },
  { immediate: true }
);
</script>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 1000;
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 10px;
  height: 90%;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.notification-panel.light {
  background: rgba(255, 255, 255, 0.3);
  color: #333;
}

.notification-panel.dark {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: -5px;
  width: 5px;
  height: 100%;
  background: transparent;
  cursor: ew-resize;
  z-index: 10;
}

.resize-handle:hover {
  background: rgba(255, 255, 255, 0.5);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notify-label {
  font-size: 16px;
  font-weight: 600;
  color: inherit;
}

.theme-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.theme-circle.light {
  background: #fff;
}

.theme-circle.dark {
  background: #000;
}

.theme-circle:hover,
.theme-circle:active {
  transform: scale(1.2);
}

.clear-all,
.reload-all {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
}

.clear-all:hover,
.reload-all:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.reload-all:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.messages-container {
  height: calc(100% - 60px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  touch-action: pan-y;
}

.messages-container::-webkit-scrollbar {
  display: none;
}

.message-item {
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  position: relative;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.2s linear;
}

.notification-panel.dark .message-item {
  background: rgba(0, 0, 0, 0.4);
}

.message-item.message-transition {
  transition: all 0.4s linear;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-item h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.message-item p {
  font-size: 14px;
  margin-bottom: 4px;
}

.message-item .sender {
  font-size: 12px;
  opacity: 0.7;
}

.close-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #fff;
  transition: transform 0.2s, color 0.2s;
}

.notification-panel.light .close-icon {
  color: #333;
}

.close-icon:hover {
  transform: scale(1.2);
  color: #ff4d4d;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  color: inherit;
  opacity: 0.6;
}
</style>
