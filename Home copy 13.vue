```vue
<template>
    <div class="quiet-clock">
        <!-- ==========================================
         动态背景
    =========================================== -->
        <canvas ref="backgroundCanvas" class="background-canvas" />

        <main class="clock-scene">
            <section class="calendar-layout">
                <!-- ======================================
             台历
        ======================================= -->
                <div class="calendar-card">
                    <div class="calendar-top">
                        <div class="calendar-month">
                            {{ monthName }}
                        </div>

                        <div class="calendar-mini">
                            {{ year }}
                        </div>
                    </div>

                    <div class="calendar-date">
                        <div class="date-day">
                            {{ day }}
                        </div>

                        <div class="date-info">
                            <div>{{ weekday }}</div>
                            <div>{{ solarTerm }}</div>
                        </div>
                    </div>

                    <div class="card-divider" />

                    <div class="time">
                        <span>{{ hours }}</span>

                        <span class="time-colon">:</span>

                        <span>{{ minutes }}</span>

                        <span class="seconds"> :{{ seconds }} </span>
                    </div>

                    <div class="mood">
                        {{ currentMood }}
                    </div>

                    <div class="calendar-footer">
                        <span class="footer-dot" />
                        <span>A QUIET MOMENT</span>
                    </div>
                </div>

                <!-- ======================================
             幸运数
        ======================================= -->
                <aside class="luck-panel">
                    <div class="luck-content">
                        <div class="luck-label">
                            TODAY'S
                            <br />
                            LITTLE LUCK
                        </div>

                        <div
                            class="luck-number"
                            :class="{ rolling: isRolling }"
                        >
                            {{ luckNumber }}
                        </div>

                        <div class="luck-hint">
                            随便 roll 一下
                            <br />
                            图个小乐
                        </div>

                        <button
                            class="roll-button"
                            type="button"
                            @click="rollLuck"
                        >
                            <span class="roll-icon">↻</span>
                            <span>ROLL</span>
                        </button>
                    </div>
                </aside>
            </section>

            <div class="page-footer">愿今天，有一点小小的幸运。</div>
        </main>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

/* =====================================================
 * 时间
 * ===================================================== */

const now = ref(new Date());

let clockTimer = null;

const year = computed(() => {
    return now.value.getFullYear();
});

const month = computed(() => {
    return now.value.getMonth() + 1;
});

const monthName = computed(() => {
    return `${month.value} 月`;
});

const day = computed(() => {
    return String(now.value.getDate()).padStart(2, "0");
});

const hours = computed(() => {
    return String(now.value.getHours()).padStart(2, "0");
});

const minutes = computed(() => {
    return String(now.value.getMinutes()).padStart(2, "0");
});

const seconds = computed(() => {
    return String(now.value.getSeconds()).padStart(2, "0");
});

/* =====================================================
 * 星期
 * ===================================================== */

const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
];

const weekday = computed(() => {
    return weekdays[now.value.getDay()];
});

/* =====================================================
 * 节气
 * ===================================================== */

const solarTerms = [
    [1, 6, "小寒"],
    [1, 20, "大寒"],

    [2, 4, "立春"],
    [2, 19, "雨水"],

    [3, 6, "惊蛰"],
    [3, 21, "春分"],

    [4, 5, "清明"],
    [4, 20, "谷雨"],

    [5, 6, "立夏"],
    [5, 21, "小满"],

    [6, 6, "芒种"],
    [6, 21, "夏至"],

    [7, 7, "小暑"],
    [7, 23, "大暑"],

    [8, 8, "立秋"],
    [8, 23, "处暑"],

    [9, 8, "白露"],
    [9, 23, "秋分"],

    [10, 8, "寒露"],
    [10, 23, "霜降"],

    [11, 7, "立冬"],
    [11, 22, "小雪"],

    [12, 7, "大雪"],
    [12, 22, "冬至"],
];

const solarTerm = computed(() => {
    const currentMonth = month.value;
    const currentDay = now.value.getDate();

    const exact = solarTerms.find(([m, d]) => {
        return m === currentMonth && Math.abs(d - currentDay) <= 1;
    });

    if (exact) {
        return exact[2];
    }

    const next = solarTerms.find(([m, d]) => {
        return m === currentMonth && d >= currentDay;
    });

    return next?.[2] || "四时皆安";
});

/* =====================================================
 * 氛围文字
 * ===================================================== */

const moods = [
    "慢一点，也没关系。",
    "风很轻，时间也很轻。",
    "刚刚好，就很好。",
    "把今天过得松弛一点。",
    "小小的快乐，也值得被记住。",
    "忙完了，就让自己安静一会儿。",
    "此刻没有什么特别的事，而这本身就是一种惬意。",
];

const moodIndex = ref(Math.floor(Math.random() * moods.length));

const currentMood = computed(() => {
    return moods[moodIndex.value];
});

/* =====================================================
 * 幸运数字
 * ===================================================== */

const luckNumber = ref(randomNumber());

const isRolling = ref(false);

let rollTimer = null;

function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function rollLuck() {
    if (isRolling.value) {
        return;
    }

    isRolling.value = true;

    let count = 0;

    rollTimer = setInterval(() => {
        luckNumber.value = randomNumber();

        count++;

        if (count >= 10) {
            clearInterval(rollTimer);

            rollTimer = null;

            luckNumber.value = randomNumber();

            isRolling.value = false;
        }
    }, 65);
}

/* =====================================================
 * 动态科幻背景
 *
 * 非常克制：
 * - 不改变背景颜色
 * - 不抢主体
 * - 粒子缓慢漂移
 * - 附近粒子产生极淡连接线
 * - 鼠标附近产生轻微扰动
 * ===================================================== */

const backgroundCanvas = ref(null);

let canvas = null;
let ctx = null;
let animationFrame = null;

let particles = [];

const mouse = {
    x: null,
    y: null,
};

function createParticles(width, height) {
    const count = Math.min(
        Math.max(Math.floor((width * height) / 18000), 28),
        90,
    );

    particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,

        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,

        radius: Math.random() * 1.2 + 0.35,

        alpha: Math.random() * 0.24 + 0.08,

        phase: Math.random() * Math.PI * 2,
    }));
}

function resizeCanvas() {
    if (!canvas || !ctx) {
        return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles(width, height);
}

function drawBackground(time = 0) {
    if (!canvas || !ctx) {
        return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    /* -----------------------------------------
     粒子
  ----------------------------------------- */

    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        /*
         * 非常轻微的上下呼吸
         */
        const breathing = Math.sin(time * 0.0006 + particle.phase) * 0.12;

        particle.y += breathing;

        /* 鼠标附近轻微排斥 */
        if (mouse.x !== null && mouse.y !== null) {
            const dx = particle.x - mouse.x;

            const dy = particle.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130 && distance > 0) {
                const force = ((130 - distance) / 130) * 0.12;

                particle.x += (dx / distance) * force;

                particle.y += (dy / distance) * force;
            }
        }

        /* 边缘循环 */

        if (particle.x < -10) {
            particle.x = width + 10;
        }

        if (particle.x > width + 10) {
            particle.x = -10;
        }

        if (particle.y < -10) {
            particle.y = height + 10;
        }

        if (particle.y > height + 10) {
            particle.y = -10;
        }

        const alpha =
            particle.alpha + Math.sin(time * 0.001 + particle.phase) * 0.035;

        ctx.beginPath();

        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        /*
         * 极淡的蓝灰色
         */
        ctx.fillStyle = `rgba(143, 184, 198, ${Math.max(alpha, 0.03)})`;

        ctx.fill();
    });

    /* -----------------------------------------
     粒子连线
  ----------------------------------------- */

    const maxDistance = 135;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.075;

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);

                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle = `rgba(143, 184, 198, ${opacity})`;

                ctx.lineWidth = 0.6;

                ctx.stroke();
            }
        }
    }

    animationFrame = requestAnimationFrame(drawBackground);
}

function handleMouseMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

function handleMouseLeave() {
    mouse.x = null;
    mouse.y = null;
}

/* =====================================================
 * 生命周期
 * ===================================================== */

onMounted(async () => {
    await nextTick();

    clockTimer = setInterval(() => {
        now.value = new Date();
    }, 1000);

    canvas = backgroundCanvas.value;

    if (!canvas) {
        return;
    }

    ctx = canvas.getContext("2d");

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(drawBackground);
});

onBeforeUnmount(() => {
    if (clockTimer) {
        clearInterval(clockTimer);
    }

    if (rollTimer) {
        clearInterval(rollTimer);
    }

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    window.removeEventListener("resize", resizeCanvas);

    window.removeEventListener("mousemove", handleMouseMove);

    window.removeEventListener("mouseleave", handleMouseLeave);
});
</script>

<style scoped>
/* =====================================================
   Page
===================================================== */

.quiet-clock {
    position: relative;

    width: 100%;
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    color: #29343b;

    /*
   * 保留上一版背景
   */
    background:
        radial-gradient(
            circle at 18% 18%,
            rgba(201, 229, 238, 0.24),
            transparent 30%
        ),
        radial-gradient(
            circle at 82% 78%,
            rgba(236, 225, 207, 0.22),
            transparent 28%
        ),
        #f7f8f8;

    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "PingFang SC",
        "Microsoft YaHei",
        sans-serif;

    -webkit-font-smoothing: antialiased;
}

/* =====================================================
   Dynamic Background
===================================================== */

.background-canvas {
    position: absolute;

    inset: 0;

    width: 100%;
    height: 100%;

    pointer-events: none;

    z-index: 0;
}

/* =====================================================
   Main
===================================================== */

.clock-scene {
    position: relative;

    z-index: 1;

    width: min(930px, 100%);

    padding: 50px 32px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

/* =====================================================
   Calendar Layout
===================================================== */

.calendar-layout {
    width: 100%;

    display: flex;
    align-items: stretch;
    justify-content: center;

    gap: 30px;
}

/* =====================================================
   Calendar Card
===================================================== */

.calendar-card {
    position: relative;

    width: min(600px, 100%);

    padding: 34px 42px 30px;

    display: flex;
    flex-direction: column;

    background: rgba(255, 255, 255, 0.96);

    border: 1px solid rgba(226, 230, 232, 0.8);

    border-radius: 18px;

    box-shadow:
        0 24px 70px rgba(38, 51, 59, 0.07),
        0 3px 12px rgba(38, 51, 59, 0.035);

    overflow: hidden;

    backdrop-filter: blur(4px);
}

/*
 * 台历装订点
 */

.calendar-card::before,
.calendar-card::after {
    content: "";

    position: absolute;

    top: 15px;

    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: #dce2e5;

    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.calendar-card::before {
    left: 42px;
}

.calendar-card::after {
    right: 42px;
}

/* =====================================================
   Calendar Top
===================================================== */

.calendar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #a8b1b6;
}

.calendar-month {
    font-size: 12px;

    letter-spacing: 0.16em;
}

.calendar-mini {
    font-size: 11px;

    letter-spacing: 0.12em;
}

/* =====================================================
   Date
===================================================== */

.calendar-date {
    margin-top: 27px;

    display: flex;
    align-items: flex-end;

    gap: 16px;
}

.date-day {
    color: #263139;

    font-size: 68px;
    font-weight: 300;

    line-height: 0.82;

    letter-spacing: -0.06em;

    font-variant-numeric: tabular-nums;
}

.date-info {
    padding-bottom: 3px;

    display: flex;
    flex-direction: column;

    gap: 6px;

    color: #89949b;

    font-size: 12px;

    letter-spacing: 0.1em;
}

/* =====================================================
   Divider
===================================================== */

.card-divider {
    width: 100%;
    height: 1px;

    margin: 28px 0 25px;

    background: #edf0f1;
}

/* =====================================================
   Time
===================================================== */

.time {
    display: flex;
    align-items: baseline;

    color: #202a31;

    font-size: clamp(65px, 9vw, 92px);

    font-weight: 300;

    line-height: 0.95;

    letter-spacing: -0.065em;

    font-variant-numeric: tabular-nums;
}

.time-colon {
    margin: 0 5px;

    color: #b9c1c5;

    font-weight: 200;
}

.seconds {
    margin-left: 8px;

    color: #aab3b8;

    font-size: 0.25em;

    font-weight: 400;

    letter-spacing: 0;
}

/* =====================================================
   Mood
===================================================== */

.mood {
    margin: 25px 0 0;

    color: #9ba5aa;

    font-size: 13px;

    letter-spacing: 0.08em;

    line-height: 1.8;
}

/* =====================================================
   Calendar Footer
===================================================== */

.calendar-footer {
    margin-top: auto;
    padding-top: 27px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 8px;

    color: #c1c8cc;

    font-size: 9px;

    letter-spacing: 0.22em;
}

.footer-dot {
    width: 5px;
    height: 5px;

    flex-shrink: 0;

    border-radius: 50%;

    background: #a9d5e5;
}

/* =====================================================
   Luck Panel
===================================================== */

.luck-panel {
    /*
   * 关键：
   * align-self: stretch + flex
   * 与左侧台历严格等高
   */
    width: 155px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 28px 20px;

    background: rgba(255, 255, 255, 0.72);

    border: 1px solid rgba(228, 232, 234, 0.8);

    border-radius: 18px;

    box-shadow:
        0 24px 70px rgba(38, 51, 59, 0.045),
        0 3px 12px rgba(38, 51, 59, 0.025);

    backdrop-filter: blur(8px);
}

.luck-content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

/* =====================================================
   Luck Label
===================================================== */

.luck-label {
    color: #aeb7bc;

    font-size: 9px;

    line-height: 1.65;

    letter-spacing: 0.17em;

    text-align: center;
}

/* =====================================================
   Luck Number
===================================================== */

.luck-number {
    margin: 18px 0 12px;

    color: #56656e;

    font-size: 38px;

    font-weight: 300;

    line-height: 1;

    letter-spacing: 0.08em;

    font-variant-numeric: tabular-nums;
}

.luck-number.rolling {
    animation: rolling 0.08s linear infinite;
}

@keyframes rolling {
    0% {
        transform: translateY(-2px);
        opacity: 0.5;
    }

    50% {
        transform: translateY(2px);
        opacity: 1;
    }

    100% {
        transform: translateY(-2px);
        opacity: 0.5;
    }
}

/* =====================================================
   Luck Hint
===================================================== */

.luck-hint {
    margin-bottom: 22px;

    color: #b4bdc1;

    font-size: 10px;

    line-height: 1.8;

    letter-spacing: 0.05em;

    text-align: center;
}

/* =====================================================
   Roll
===================================================== */

.roll-button {
    width: 100%;

    min-height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 7px;

    border: 0;

    border-radius: 999px;

    background: #f1f7f9;

    color: #708590;

    font-family: inherit;

    font-size: 10px;

    letter-spacing: 0.1em;

    cursor: pointer;

    transition:
        background 0.2s ease,
        color 0.2s ease,
        transform 0.15s ease;
}

.roll-icon {
    color: #91b9c8;

    font-size: 16px;

    line-height: 1;
}

.roll-button:hover {
    background: #eaf5f8;

    color: #5e7b88;
}

.roll-button:active {
    transform: scale(0.95);
}

.roll-button:focus-visible {
    outline: 2px solid #b9dce8;

    outline-offset: 3px;
}

/* =====================================================
   Footer
===================================================== */

.page-footer {
    margin-top: 34px;

    color: #b9c1c5;

    font-size: 10px;

    letter-spacing: 0.14em;
}

/* =====================================================
   Responsive
===================================================== */

@media (max-width: 760px) {
    .clock-scene {
        padding: 35px 20px;
    }

    .calendar-layout {
        flex-direction: column;

        gap: 18px;
    }

    .calendar-card {
        width: 100%;

        padding: 32px 28px 27px;
    }

    /*
   * 移动端恢复成横向的小幸运条
   */
    .luck-panel {
        width: 100%;

        min-height: 100px;

        padding: 17px 20px;
    }

    .luck-content {
        display: grid;

        grid-template-columns:
            1fr
            auto
            auto;

        align-items: center;

        gap: 18px;
    }

    .luck-label {
        text-align: left;
    }

    .luck-number {
        margin: 0;
    }

    .luck-hint {
        display: none;
    }

    .roll-button {
        width: 100px;
    }
}

@media (max-width: 460px) {
    .quiet-clock {
        min-height: 100svh;
    }

    .clock-scene {
        padding: 24px 15px;
    }

    .calendar-card {
        padding: 30px 22px 25px;

        border-radius: 16px;
    }

    .calendar-card::before {
        left: 27px;
    }

    .calendar-card::after {
        right: 27px;
    }

    .date-day {
        font-size: 58px;
    }

    .date-info {
        font-size: 11px;
    }

    .time {
        font-size: 62px;
    }

    .mood {
        font-size: 12px;
    }

    .luck-content {
        gap: 10px;
    }

    .roll-button {
        width: 92px;
    }
}

/* =====================================================
   Reduced Motion
===================================================== */

@media (prefers-reduced-motion: reduce) {
    .luck-number.rolling {
        animation: none;
    }

    .roll-button {
        transition: none;
    }
}
</style>
