# TT
this is new wallpaper store


<template>
    <div>hello</div>

    <button @click="handleClickToTarget">Click</button>
    <h1 ref="h1Ref"></h1>
    <article ref="articleRef">
        <section ref="sectionRef" class="type-txt" v-for="item in appList">
            {{ item.id + " " + item.value }}
        </section>
    </article>
</template>

<script setup lang="ts">
import { getCurrentInstance, onUnmounted, ref, useTemplateRef } from "vue";
import Typed from "typed.js";
const { proxy } = getCurrentInstance() as any;

const articleRefEL = useTemplateRef("articleRef") as any;
const sectionRefEL = useTemplateRef("sectionRef") as any;
const h1RefEl = useTemplateRef("h1Ref") as any;
const appList = ref([{ id: 0, value: "hello" }] as any);
const type1 = ref();

const options = ref({
    strings: ["Hello World!", "Welcome to the Vue + Typed.js example."],
    typeSpeed: 50, // 打字速度
    // backSpeed: 50, // 删除速度
    // backDelay: 1000, // 删除后延迟
    // loop: true, // 循环
});
let i = 0;
const handleClickToTarget = () => {
    console.log("🍃 ~ articleRefEL:", articleRefEL.value.lastElementChild);
    appList.value.push({ id: i + 1, value: "hello" });
    i++;
    // articleRefEL.value.scrollTo(
    //     0,
    //     articleRefEL.value.lastElementChild.offsetTop,
    // );

    console.log(articleRefEL.value.lastElementChild.offsetTop);
    console.log(articleRefEL.value.firstElementChild.offsetTop);

    proxy.$anime({
        targets: articleRefEL.value,
        scrollTop: articleRefEL.value.lastElementChild?.offsetTop,
        duration: 2000, // 动画持续时间
        easing: "easeOutQuart", // 缓动函数
        // update: function () {
        //     articleRefEL.value.scrollTo(0, proxy.$anime.get("scrollTop"));
        // },
    });
    type1.value = new Typed(h1RefEl.value, options.value);

    setTimeout(() => {
        appList.value.push({
            id: i + 1,
            value: "Tailwind doesn’t include a large set of aspect ratio values out of the box since it’s easier to just use arbitrary values. See the arbitrary values section for more information.",
        });
        proxy.$anime({
            targets: articleRefEL.value,
            scrollTop: articleRefEL.value.lastElementChild?.offsetTop,
            duration: 2000, // 动画持续时间
            easing: "easeOutQuart", // 缓动函数
            // update: function () {
            //     articleRefEL.value.scrollTo(0, proxy.$anime.get("scrollTop"));
            // },
        });
    }, 1000);
    i++;
};

proxy.$http
    .get("http://localhost:8000/user") // 确保 URL 指向 FastAPI 服务
    .then((response: any) => {
        console.log(response.data);
    })
    .catch((error: any) => {
        console.error(error);
    });

onUnmounted(() => {
    type1.value && type1.value.destroy();
});


<template>
  <article ref="articleRef">
    <section
      v-for="(item, index) in appList"
      :key="item.id"
      :ref="'sectionRef' + index" <!-- 动态生成 ref -->
      class="type-txt"
    >
      {{ item.id + " " + item.value }}
    </section>
  </article>
</template>

<script>
import Typed from 'typed.js';

export default {
  name: 'TypedComponent',
  data() {
    return {
      appList: [
        { id: 1, value: 'Hello World!' },
        { id: 2, value: 'Welcome to the Vue + Typed.js example.' },
        { id: 3, value: 'This is a dynamic typing effect.' },
      ],
    };
  },
  mounted() {
    this.appList.forEach((item, index) => {
      const options = {
        strings: [item.id + " " + item.value], // 每个 section 对应的文本
        typeSpeed: 100, // 打字速度
        backSpeed: 50,   // 删除速度
        backDelay: 1000, // 删除后延迟
        loop: false,     // 不循环
      };

      // 初始化 Typed.js
      const typed = new Typed(this.$refs['sectionRef' + index][0], options);
    });
  },
  beforeDestroy() {
    // 在这里清理 Typed 实例
    this.appList.forEach((item, index) => {
      if (this.$refs['sectionRef' + index]) {
        this.$refs['sectionRef' + index].forEach(ref => {
          if (ref.typed) {
            ref.typed.destroy(); // 销毁实例
          }
        });
      }
    });
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
}
</style>

</script>

<style scoped>
article {
    width: 500px;
    height: 800px;
    overflow-y: auto;
    margin: 0 auto;
    border: 1px solid #000;
}

section {
    width: 100%;
    height: 300px;
    background: #e2e2e2;
    margin: 10px 0;
}
</style>
