<template>
  <main>
    <div style="position: relative; width: 2000px; height: 1000px">
      <canvas
        ref="fishboneCanvas"
        style="position: absolute; top: 0; left: 0; border: 1px solid #ccc"
      ></canvas>
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 2000px;
          height: 1000px;
          overflow: hidden;
        "
      >
        <div
          v-for="(item, index) in canvasData"
          :key="item.id"
          :style="cardStyle(index)"
        >
          <div :style="titleStyle">{{ item.title }}</div>
          <div ref="contentRefs" :style="contentStyle">
            <p
              v-for="(descItem, descIndex) in item.content"
              :key="descIndex"
              :style="textStyle"
            >
              {{ descItem.id }}. {{ descItem.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <button @click="downloadPDF" class="download-btn">下载为PDF</button>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const data = [
  {
    id: 1,
    title: "项目 1",
    content: [
      { id: 1, desc: "项目 1 的描述 1" },
      { id: 2, desc: "项目 1 的描述 2" },
      { id: 3, desc: "项目 1 的描述 3" },
      { id: 4, desc: "项目 1 的描述 4 (超长内容测试)" },
      { id: 5, desc: "项目 1 的描述 5 (超长内容测试)" },
      { id: 6, desc: "项目 1 的描述 6 (超长内容测试)" },
      { id: 7, desc: "项目 1 的描述 7 (超长内容测试)" },
      { id: 8, desc: "项目 1 的描述 8 (超长内容测试)" },
      { id: 9, desc: "项目 1 的描述 9 (超长内容测试)" },
      { id: 10, desc: "项目 1 的描述 10 (超长内容测试)" },
      { id: 11, desc: "项目 1 的描述 11 (超长内容测试)" },
      { id: 12, desc: "项目 1 的描述 12 (超长内容测试)" },
      { id: 13, desc: "项目 1 的描述 13 (超长内容测试)" },
      { id: 14, desc: "项目 1 的描述 14 (超长内容测试)" },
      { id: 15, desc: "项目 1 的描述 15 (超长内容测试)" },
      { id: 16, desc: "项目 1 的描述 16 (超长内容测试)" },
    ],
  },
  {
    id: 2,
    title: "项目 2",
    content: [
      { id: 1, desc: "项目 2 的描述 1" },
      { id: 2, desc: "项目 2 的描述 2" },
      { id: 3, desc: "项目 2 的描述 3" },
      { id: 4, desc: "项目 2 的描述 4" },
      { id: 5, desc: "项目 2 的描述 5 (超长内容测试)" },
      { id: 6, desc: "项目 2 的描述 6 (超长内容测试)" },
      { id: 7, desc: "项目 2 的描述 7 (超长内容测试)" },
      { id: 8, desc: "项目 2 的描述 8 (超长内容测试)" },
      { id: 9, desc: "项目 2 的描述 9 (超长内容测试)" },
      { id: 10, desc: "项目 2 的描述 10 (超长内容测试)" },
      { id: 11, desc: "项目 2 的描述 11 (超长内容测试)" },
      { id: 12, desc: "项目 2 的描述 12 (超长内容测试)" },
      { id: 13, desc: "项目 2 的描述 13 (超长内容测试)" },
      { id: 14, desc: "项目 2 的描述 14 (超长内容测试)" },
      { id: 15, desc: "项目 2 的描述 15 (超长内容测试)" },
      { id: 16, desc: "项目 2 的描述 16 (超长内容测试)" },
    ],
  },
  // 其他项目保持原有数据
  {
    id: 3,
    title: "项目 3",
    content: [
      { id: 1, desc: "项目 3 的描述 1" },
      { id: 2, desc: "项目 3 的描述 2" },
    ],
  },
  // ... 省略其余数据
];

const canvasData = ref([...data]);
const fishboneCanvas = ref<HTMLCanvasElement | null>(null);
const contentRefs = ref([]);

onMounted(() => {
  if (!fishboneCanvas.value) return;

  const canvas = fishboneCanvas.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.height = 1000;
  canvas.width = 2000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mainLineY = 500;
  ctx.beginPath();
  ctx.moveTo(50, mainLineY);
  ctx.lineTo(1950, mainLineY);
  ctx.strokeStyle = "#0078D4";
  ctx.lineWidth = 4;
  ctx.stroke();

  const arrowSize = 30;
  ctx.beginPath();
  ctx.moveTo(1950, mainLineY);
  ctx.lineTo(1950 - arrowSize, mainLineY - arrowSize / 2);
  ctx.lineTo(1950 - arrowSize, mainLineY + arrowSize / 2);
  ctx.closePath();
  ctx.fillStyle = "#0078D4";
  ctx.fill();

  canvasData.value.forEach((item, index) => {
    const boneX = 50 + (index + 1) * (1900 / (canvasData.value.length + 1));
    const isUpper = index % 2 === 0;
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(boneX, mainLineY);
    ctx.lineTo(boneX, isUpper ? mainLineY - 100 : mainLineY + 100);
    ctx.strokeStyle = "#A9A9A9";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
  });
});

const downloadPDF = async () => {
  if (!fishboneCanvas.value) return;

  // 临时移除滚动条，扩展内容区以捕获完整内容
  contentRefs.value.forEach((el) => {
    el.style.overflowY = "visible";
    el.style.maxHeight = "none";
  });

  const canvas = fishboneCanvas.value;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height * 2], // 增加高度以适应扩展内容
  });

  const element = document.querySelector("main") as HTMLElement;
  const canvasElement = await html2canvas(element, { scale: 2 });
  const imgData = canvasElement.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height * 2);
  pdf.save("鱼骨图.pdf");

  // 恢复滚动条
  contentRefs.value.forEach((el) => {
    el.style.overflowY = "auto";
    el.style.maxHeight = "150px";
  });
};

const cardStyle = (index: number) => {
  const spacing = 1900 / (canvasData.value.length + 1);
  const cardWidth = 250;
  const cardHeight = 200; // 统一卡片高度
  const boneX = 50 + (index + 1) * spacing;
  const isUpper = index % 2 === 0;
  const cardY = isUpper ? 500 - 100 - cardHeight : 500 + 100;

  return {
    position: "absolute",
    left: `${boneX - cardWidth / 2}px`,
    top: `${cardY}px`,
    width: `${cardWidth}px`,
    height: `${cardHeight}px`,
    backgroundColor: "#f9f9f9",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };
};

const titleStyle = {
  backgroundColor: "#0078D4",
  color: "white",
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",
  height: "40px",
  lineHeight: "20px",
};

const contentStyle = {
  maxHeight: "150px", // 内容区最大高度，超过滚动
  overflowY: "auto",
  padding: "10px",
  fontSize: "12px",
};

const textStyle = {
  margin: "5px 0",
  color: "#000",
};
</script>

<style lang="less" scoped>
main {
  overflow: auto;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
}
</style>
