<template>
  <div
    ref="timelineContainer"
    class="timeline-container"
    :style="{ width: totalWidth + 'px', height: totalHeight + 'px' }"
  >
    <canvas
      ref="timelineCanvas"
      :width="totalWidth"
      :height="totalHeight"
    ></canvas>
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card"
      :style="getCardStyle(index)"
    >
      <div class="card-header">
        <svg
          class="calendar-icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="4"
            width="14"
            height="12"
            rx="2"
            stroke="#007BFF"
            stroke-width="1.5"
          />
          <path d="M2 7H16" stroke="#007BFF" stroke-width="1.5" />
          <path
            d="M5 2V4"
            stroke="#007BFF"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M13 2V4"
            stroke="#007BFF"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <h3>{{ card.title }}</h3>
      </div>
      <div class="card-content">
        <ul>
          <li v-for="(item, i) in card.items" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
  <button @click="downloadImage" style="margin-top: 10px">
    Download as Image
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import html2canvas from "html2canvas";

const props = defineProps({
  cardsData: {
    type: Array,
    default: () => [],
  },
});

const cards = ref(props.cardsData);
const timelineContainer = ref(null);
const timelineCanvas = ref(null);

const dotSpacing = 240;
const arrowHeight = 20;
const sideLength = 50;
const arrowHeadLength = Math.floor((sideLength * Math.sqrt(3)) / 2);
const headHeight = sideLength;
const minTotalWidth = 800;
const cardWidth = 320;
const cardHeight = 280;
const dashHeight = 30;
const headerHeight = 40;
const arrowY = 350;
const extendPadding = 50;

const colors = {
  darkBlue: "#001F3F",
  blue: "#007BFF",
  lightBlue: "#A5D8FF",
  veryLight: "#E6F4FF",
};

const dotSpan = computed(() => (cards.value.length - 1) * dotSpacing);
const naturalWidth = computed(
  () => dotSpan.value + cardWidth + 2 * extendPadding + arrowHeadLength
);
const totalWidth = computed(() => Math.max(minTotalWidth, naturalWidth.value));
const totalHeight = computed(() => {
  return cardHeight * 2 + dashHeight * 2 + arrowHeight + 100;
});
const dotStart = computed(
  () => (totalWidth.value - arrowHeadLength - dotSpan.value) / 2
);

onMounted(() => {
  drawTimeline();
});

const isUpperCard = (index) => {
  return index % 2 === 1;
};

const drawTimeline = () => {
  const canvas = timelineCanvas.value;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, totalWidth.value, totalHeight.value);

  // Draw main arrow line
  ctx.beginPath();
  ctx.moveTo(0, arrowY);
  ctx.lineTo(totalWidth.value - arrowHeadLength, arrowY);
  ctx.strokeStyle = colors.blue;
  ctx.lineWidth = arrowHeight;
  ctx.stroke();

  // Draw arrow head as equilateral triangle
  const headBase = totalWidth.value - arrowHeadLength;
  const headTipX = totalWidth.value;
  ctx.beginPath();
  ctx.moveTo(headBase, arrowY - headHeight / 2);
  ctx.lineTo(headTipX, arrowY);
  ctx.lineTo(headBase, arrowY + headHeight / 2);
  ctx.closePath();
  ctx.fillStyle = colors.blue;
  ctx.fill();

  // Draw white dotted line, stopping at the arrowhead base
  ctx.beginPath();
  ctx.setLineDash([1, 5]);
  ctx.moveTo(0, arrowY);
  ctx.lineTo(totalWidth.value - arrowHeadLength, arrowY);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw small round dots
  for (let i = 0; i < cards.value.length; i++) {
    const dotX = dotStart.value + i * dotSpacing;
    ctx.beginPath();
    ctx.arc(dotX, arrowY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = colors.blue;
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw blue dashed lines to cards (fishbones)
  for (let i = 0; i < cards.value.length; i++) {
    const dotX = dotStart.value + i * dotSpacing;
    let dashStartY, dashEndY;
    if (isUpperCard(i)) {
      dashStartY = arrowY - arrowHeight / 2;
      dashEndY = dashStartY - dashHeight;
    } else {
      dashStartY = arrowY + arrowHeight / 2;
      dashEndY = dashStartY + dashHeight;
    }
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(dotX, dashStartY);
    ctx.lineTo(dotX, dashEndY);
    ctx.strokeStyle = colors.blue;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }
};

const getCardStyle = (index) => {
  const dotX = dotStart.value + index * dotSpacing;
  const cardX = dotX - cardWidth / 2;
  let cardY;
  if (isUpperCard(index)) {
    cardY = arrowY - arrowHeight / 2 - dashHeight - cardHeight;
  } else {
    cardY = arrowY + arrowHeight / 2 + dashHeight;
  }
  return {
    left: `${cardX}px`,
    top: `${cardY}px`,
    width: `${cardWidth}px`,
    height: `${cardHeight}px`,
    background: "white",
    border: `1px solid transparent`,
    borderImage: `linear-gradient(to top, #cae2fe, #fff) 1`,
    borderImageSlice: 1,
  };
};

const downloadImage = async () => {
  console.log("Download button clicked");
  const canvas = await html2canvas(timelineContainer.value, {
    scale: 2,
    useCORS: true,
    logging: true,
    width: totalWidth.value,
    height: totalHeight.value,
  });
  console.log("html2canvas completed");
  const link = document.createElement("a");
  link.download = "fishbone-timeline.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  console.log("Download triggered");
};
</script>

<style scoped>
.timeline-container {
  position: relative;
  margin: 0 auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  height: 40px;
  background: linear-gradient(to bottom, #d0e6ff, #fff);
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #004ea8;
}

.calendar-icon {
  margin-right: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-content {
  padding: 10px 15px 10px 10px;
  height: calc(100% - 40px);
  overflow-y: auto;
  color: #333;
  background: white;
}

.card-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-content li {
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}

/* Custom scrollbar */
.card-content::-webkit-scrollbar {
  width: 6px;
}

.card-content::-webkit-scrollbar-track {
  background: #e0e0e0;
}

.card-content::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: #c0c0c0;
}
</style>
