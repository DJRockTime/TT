<template>
  <div class="home">
    <!-- Bell Icon with red dot if there are unread messages -->
    <div class="bell-wrapper" @click="toggleNotifications">
      <svg
        class="bell-icon"
        :class="{ shake: isShaking }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 17H9M17 9C17 12.3137 14.3137 15 11 15C7.68629 15 5 12.3137 5 9C5 5.68629 7.68629 3 11 3C14.3137 3 17 5.68629 17 9ZM3.5 9H18.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div v-if="hasMessages" class="red-dot"></div>
    </div>

    <!-- Notification Panel -->
    <Notification
      v-if="showNotifications"
      :messages="messages"
      :theme="theme"
      :initial-width="panelWidth"
      @close="closeNotifications"
      @clear-all="clearAllMessages"
      @remove-message="removeMessage"
      @toggle-theme="toggleTheme"
      @update-width="updateWidth"
      @reload-all="reloadAllMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import anime from "animejs";
import Notification from "./Notification.vue";

interface Message {
  id: number;
  title: string;
  content: string;
  sender: string;
  unread: boolean;
}

const historicalMessages = ref<Message[]>([
  {
    id: 1,
    title: "🔥Meeting Reminder",
    content:
      "Team meeting at 2 PM today.Team meeting at 2 PM today.Team meeting at 2 PM today.Team meeting at 2 PM today.Team meeting at 2 PM today.",
    sender: "HR Team",
    unread: true,
  },
  {
    id: 2,
    title: "🍃Project Update",
    content: "New tasks assigned to you.",
    sender: "Project Manager",
    unread: true,
  },
  {
    id: 3,
    title: "System Alert",
    content: "Server maintenance scheduled.",
    sender: "IT Admin",
    unread: true,
  },
  {
    id: 4,
    title: "📋Feedback Request",
    content: "Please review the document.",
    sender: "Colleague",
    unread: false,
  },
  {
    id: 5,
    title: "🍔Meeting Reminder",
    content: "Team meeting at 2 PM today.",
    sender: "HR Team",
    unread: true,
  },
  {
    id: 6,
    title: "Project Update",
    content: "New tasks assigned to you.",
    sender: "Project Manager",
    unread: true,
  },
  {
    id: 7,
    title: "System Alert",
    content: "Server maintenance scheduled.",
    sender: "IT Admin",
    unread: true,
  },
  {
    id: 8,
    title: "Feedback Request",
    content: "Please review the document.",
    sender: "Colleague",
    unread: false,
  },
  {
    id: 9,
    title: "Meeting Reminder",
    content: "Team meeting at 2 PM today.",
    sender: "HR Team",
    unread: true,
  },
  {
    id: 10,
    title: "Project Update",
    content: "New tasks assigned to you.",
    sender: "Project Manager",
    unread: true,
  },
  {
    id: 11,
    title: "System Alert",
    content: "Server maintenance scheduled.",
    sender: "IT Admin",
    unread: true,
  },
  {
    id: 12,
    title: "Feedback Request",
    content: "Please review the document.",
    sender: "Colleague",
    unread: false,
  },
]);

const messages = ref<Message[]>([]); // Display messages
const showNotifications = ref(false);
const isShaking = ref(false);
const theme = ref<"light" | "dark">("light");
const panelWidth = ref(400); // Default width

// Load theme and width from localStorage on mount
onMounted(() => {
  const savedTheme = localStorage.getItem("notification-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    theme.value = savedTheme;
  }
  const savedWidth = localStorage.getItem("notification-width");
  if (savedWidth) {
    const width = parseInt(savedWidth, 10);
    if (width >= 150 && width <= 500) {
      panelWidth.value = width;
    }
  }
  reloadAllMessages(); // Initial load of messages
});

const hasMessages = computed(() => messages.value.length > 0);

const toggleNotifications = () => {
  isShaking.value = true;
  anime({
    targets: ".bell-icon",
    translateX: [-4, 4, -3, 3, -2, 2, 0],
    duration: 300,
    easing: "easeInOutSine",
    complete: () => {
      isShaking.value = false;
    },
  });
  showNotifications.value = !showNotifications.value;
};

const closeNotifications = () => {
  showNotifications.value = false;
};

const clearAllMessages = async () => {
  messages.value = [];
  closeNotifications();
};

const removeMessage = (id: number) => {
  const index = messages.value.findIndex((msg) => msg.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
};

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("notification-theme", theme.value);
};

const updateWidth = (newWidth: number) => {
  panelWidth.value = newWidth;
  localStorage.setItem("notification-width", newWidth.toString());
};

const reloadAllMessages = () => {
  messages.value = historicalMessages.value.map((msg) => ({
    ...msg,
    unread: true,
  }));
};

watch(showNotifications, (newVal) => {
  if (newVal) {
    messages.value.forEach((msg) => (msg.unread = false));
  }
});
</script>

<style scoped>
.home {
  position: relative;
  height: 100vh;
}

.bell-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.bell-icon {
  width: 24px;
  height: 24px;
  color: #333;
}

.red-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}
</style>
