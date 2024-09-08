// Function.prototype.myCall = function (thisArg, ...args) {
//
//     const key = Symbol('key')
//     thisArg[key] = this;
//
//     console.log(args)
//     const res = thisArg[key](...args);
//     delete thisArg.f;
//     return res;
// }
//
// let person = {
//     name: 'rock'
// }
//
// Function.prototype.myApply = function (thisArg, args) {
//     const key = Symbol('key');
//     thisArg[key] = this;
//     const res = thisArg[key](...args);
//     delete thisArg[key];
//     return res;
// }
//
//
// Function.prototype.bind = function(thisArg, ...args) {
//     return (...reArgs) => {
//         return this.call(thisArg, ...args, ...reArgs);
//     }
// }
//
// function func(numA, numB) {
//     console.log(this);
//     console.log(numA);
//     console.log(numB);
//     return numA + numB
// }
//
// const res = func.myCall(person, 2, 8);
// console.log('return: ', res)
//
// var s1 = Symbol('rock');
// var s2 = Symbol('rock');
//
// console.log(s1 === s2)

// 继承

// class Person {
//     name
//
//     constructor(name) {
//         this.name = name;
//         this.foods = ['flower', 'apple']
//     }
//
//     sayHi() {
//         console.log(this.name)
//     }
//
//     sayHello() {
//         console.log('hello')
//         console.log(this)
//     }
//
//     say = () => {
//         console.log(this.name)
//     }
//
// }
//
// // 寄生组合式继承
//
// function Person2(name) {
//     this.name = name;
//
// }
//
// Person2.prototype.sayHi = function () {
//     console.log(`${this.name}`)
// }
//
// function Student(name) {
//     Person2.call(this, name)
// }
//
// const prototype = Object.create(Person2.prototype, {
//     constructor: {
//         value: Student
//     }
// });
//
// Student.prototype = prototype;
//
// const student2 = new Student("ITBlackHorse");
// console.log(student2)

// fetch  浏览器内置API ,基于Promise ,用法和axios 类似,功能更为简单..

// axios 基于Promise的请求客户端再浏览器和node中均可以使用，使用假币案，功能强大

// ajax  XMLHttpRequest

// class Stack {
//     constructor() {
//         this.items = [];
//     }
//
//
//     push(element) {
//         this.items.push(element);
//     }
//
//
//     peek() {
//         return this.items[0];
//     }
//
//     pop(element) {
//         if (!this.isEmpty()) {
//             return this.items.pop();
//         }
//         return "stack is empty"
//     }
//
//
//     isEmpty() {
//         return this.items.length === 0;
//     }
//
//     size() {
//         return this.items.length;
//     }
//
//
//     clear() {
//         this.items = [];
//     }
//
//     print() {
//         console.log(this.items.toString());
//     }
// }
//
//
// const stack = new Stack();
//
// stack.push(1)
// stack.push(2)
// stack.push(3)
// stack.push(4)
// stack.print()
//
// stack.clear()
// stack.print()
// console.log(stack.isEmpty());

class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = new Node("head");
    this.size = 0;
  }

  insertAt(element, index) {
    if (index < 0 || index > this.size) {
      return false;
    }

    const added = new Node(element);
    let current = this.head;
    let i = 0;
    while (i < index) {
      current = current.next;
      i++;
    }
    added.next = current.next;
    current.next = added;
    this.size++;
    return true;
  }

  remove(element) {
    let current = this.head;
    let prev = null;
    while (current) {
      if (current.element === element) {
        prev.next = current.next;
        this.size--;
        return current.element;
      }
      prev = current;
      current = current.next;
    }

    return null;
  }

  getSize() {
    return this.size;
  }

  print() {
    let current = this.head.next;
    let res = "";
    while (current) {
      res += current.element + " ";
      current = current.next;
    }

    console.log(res);
  }
}
//
//
// const ll = new LinkedList();
// ll.insertAt(10, 0)
// ll.insertAt(20, 1)
// ll.insertAt(30, 2)
// ll.print()
// ll.remove(20);
// ll.print();
// console.log(ll.getSize());

// function fibonacci(n) {
//     if (n <= 1) {
//         return n;
//     }
//
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }
//
//
// for (let i = 0; i < 10; i++) {
//     console.log(fibonacci(i))
// }
//
// console.log(fibonacci(20))

/**
 * MaxHeap
 */

class MaxHeap {
  constructor(arr = []) {
    this.heap = arr;
    console.log(this.lastLeafNode());
  }

  heapify() {
    for (let i = this.lastLeafNode(); i >= 0; i--) {
      this.down(i);
    }
  }

  add(element) {
    this.up(element);
    return true;
  }

  // 移除
  poll() {
    let top = this.heap[0];
    this.swap(0, this.heap.length - 1);
    this.heap.pop();
    this.down(0);
    return top;
  }

  remove(index) {
    const deleted = this.heap(index);
    swap(index, this.heap.length - 1);
    this.heap.pop();
    this.down(index);
    return deleted;
  }

  replace(element) {
    this.heap[0] = element;
    this.down(0);
  }

  peek() {
    return this.heap.length ? this.heap[0] : "null";
  }

  up(element) {
    let child = this.heap.length;
    while (child > 0) {
      let parent = (child - 1) >>> 1;
      if (element > this.heap[parent]) {
        this.heap[child] = this.heap[parent];
      } else {
        break;
      }
      child = parent;
    }
    this.heap[child] = element;
  }

  down(parent) {
    let max = parent;
    let left = parent * 2 + 1;
    let right = left + 1;

    if (left < this.heap.length && this.heap[left] > this.heap[max]) {
      max = left;
    }

    if (right < this.heap.length && this.heap[right] > this.heap[max]) {
      max = right;
    }

    if (max !== parent) {
      //  找到了更大的孩子
      let temp = this.heap[max];
      this.heap[max] = this.heap[parent];
      this.heap[parent] = temp;
      this.down(max);
    }
  }

  leftLeaf(parent) {
    return parent * 2 + 1;
  }

  rightLeaf(parent) {
    return parent * 2 + 2;
  }

  lastLeafNode() {
    return (this.size() >> 1) - 1;
  }

  size() {
    return this.heap.length;
  }

  print() {
    console.log(this.heap);
  }

  swap(i, j) {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
//
//
// const heap = new MaxHeap([1, 2, 3, 4, 5, 6, 7]);
//
//
// heap.heapify();
// heap.print()
//
// heap.poll()
// heap.print()
//
// heap.add(7)
//
// heap.print()
//
//
// heap.add(8)
// heap.print()

Vue.directive("throttle", {
  bind: (el, binding) => {
    let throttleTime = binding.value;
    if (!throttleTime) {
      throttleTime = 2000;
    }

    let cbFunc;

    el.addEventListener("click", (event) => {
      if (!cbFunc) {
        cbFunc = setTimeout(() => {
          cbFunc = null;
        }, throttleTime);
      }
    });
  },
});

/**
 *  分数背包问题
 */

let total = 10;
let arr333 = [1, 2, 3, 4, 11, 23, 32, 66, 0, 5, 7];
console.log(arr.sort((a, b) => a - b).reverse());

let a = [4, 8, 2, 6, 1];
let b = [24, 160, 4000, 108, 4000];

let res = [];
for (let i = 0; i < a.length; i++) {
  let weight = a[i];
  let price = b[i];
  res.push({
    ["weight"]: weight,
    ["price"]: price,
    ["unit"]: price / weight,
  });
}
res.sort((a, b) => b.price - a.price);

let max = 0;
for (let i = 0; i < a.length; i++) {
  if (total > res[i].weight) {
    max += res[i].price;
    total -= res[i].weight;
  } else {
    max += total * res[i].unit;
    break;
  }
}

console.log(max);

/**
 * 卡特兰数
 */

// function solution(n) {
//   const dp = new Array(n + 1).fill(0);

//   dp[0] = 1;
//   dp[1] = 1;

//   for (let j = 2; j < n + 1; j++) {
//       for (let i = 0; i < j; i++) {
//           dp[j] += dp[i] * dp[j - 1 - i];

//       }
//   }

//   return dp[n];
// }
// console.log(solution(3));

// function solution(n) {
//   const dp = new Array(n + 1).fill(0);

//   dp[0] = [""];
//   dp[1] = ["()"];

//   for (let j = 2; j < n + 1; j++) {
//       dp[j] = [];
//       for (let i = 0; i < j; i++) {
//           console.log(`(${i}, ${j - 1 - i})`)
//           // dp[j] += dp[i] * dp[j - 1 - i];
//           for (const k1 of dp[i]) {
//               for (const k2 of dp[j - 1 - i]) {
//                   dp[j].push("(" + k1 + ")" + k2)
//               }
//           }
//       }
//   }
//   console.log(dp[n])
// }

// solution(3)

// [ '()()()', '()(())', '(())()', '(()())', '((()))' ]

/**
 * 链表
 */

class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  addFirst(value) {
    this.head = new Node(value, this.head);
  }

  addLast(value) {
    const last = this.findLast();
    if (last === null) {
      this.addFirst(value);
      return;
    }

    last.next = new Node(value, null);
  }

  findLast() {
    if (this.head === null) return null;

    let p;
    for (p = this.head; p.next !== null; p = p.next) {}
    return p;
  }

  findNodeByIndex(index) {
    let i = 0;
    for (let p = this.head; p !== null; p = p.next, i++) {
      if (i === index) {
        return p;
      }
    }

    return -1; // Not Found
  }

  get(index) {
    const node = this.findNodeByIndex(index);
    if (node === null) {
      console.log(`Not Found`);
      return null;
    }

    return node.value;
  }

  insert(index, value) {
    if (index === 0) {
      this.addFirst(value);
      return;
    }

    const prev = this.findNodeByIndex(index - 1);
    if (prev === null) {
      console.log(`Not Found`);
      return;
    }
    const inserted = new Node(value, prev.next);
    prev.next = inserted;
  }

  removeFirst() {
    if (this.head === null) {
      console.log("\x1b[31m%s\x1b[0m", "Illegal");
      return;
    }
    this.head = this.head.next;
  }

  remove(index) {
    if (index === 0) {
      this.removeFirst();
      return;
    }

    const prev = this.findNodeByIndex(index - 1);
    if (prev === null) {
      throw new Error("Illegal");
    }

    const removed = prev.next; // 被删除节点
    if (removed === null) {
      throw new Error("Illegal");
    }
    prev.next = removed.next;
  }

  loop1() {
    let p = this.head;
    while (p !== null) {
      console.log(p.value);
      p = p.next;
    }
  }

  loop2() {
    for (let p = this.head; p !== null; p = p.next) {
      console.log(p.value);
    }
  }
}

const list = new LinkedList();
list.addFirst(1);
list.addFirst(2);
list.addFirst(3);
list.addFirst(4);

list.loop1();

/**
 * 带哨兵的节点
 */
class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = new Node(913, null); // 头指针指向哨兵
  }

  addFirst(value) {
    this.insert(0, value);
  }

  addLast(value) {
    const last = this.findLast(); // last最差都会找到哨兵
    last.next = new Node(value, null);
  }

  findLast() {
    let p;
    for (p = this.head; p.next !== null; p = p.next) {}
    return p;
  }

  findNodeByIndex(index) {
    let i = -1;
    for (let p = this.head; p !== null; p = p.next, i++) {
      if (i === index) {
        return p;
      }
    }

    return -1; // Not Found
  }

  get(index) {
    const node = this.findNodeByIndex(index);
    if (node === null) {
      console.log(`Not Found`);
      throw new Error(`index Illegal`);
    }

    return node.value;
  }

  insert(index, value) {
    const prev = this.findNodeByIndex(index - 1);
    if (prev === null) {
      throw new Error("Illegal");
    }
    const inserted = new Node(value, prev.next);
    prev.next = inserted;
  }

  removeFirst() {
    this.remove(0);
  }

  remove(index) {
    const prev = this.findNodeByIndex(index - 1);
    if (prev === null) {
      throw new Error("Illegal");
    }

    const removed = prev.next; // 被删除节点
    if (removed === null) {
      throw new Error("Illegal");
    }
    prev.next = removed.next;
  }

  loop1() {
    let p = this.head.next;
    while (p !== null) {
      console.log(p.value);
      p = p.next;
    }
  }

  loop2() {
    for (let p = this.head.next; p !== null; p = p.next) {
      console.log(p.value);
    }
  }

  loop3(p) {
    if (p === null) {
      return;
    }
    console.log(p.value);
    loop3(p.next);
  }
}

const list2 = new LinkedList();
list2.addLast(1);
list2.addLast(2);
list2.addLast(3);
list2.addLast(4);
list2.insert(0, 5);
list2.addFirst(10);

list2.loop1();
console.log(list2.get(2) + "**");
// console.log('\x1b[31m%s\x1b[0m', 'Illegal')
console.log("--------------------------");

list2.loop2();

/**
 * hashmap
 */

let s = "abcabcbb";

const map = new Map();

let begin = 0;
for (let end = 0; end < s.length; end++) {
  let subStr = s.charAt(end);
  if (map.has(subStr)) {
    begin = Math.max(begin, map.get(subStr) + 1);
    map.set(subStr, end);
  } else {
    map.set(subStr, end);
  }

  console.log(s.substring(begin, end + 1));
}

// let arr = ["eat", "tea", "tan", "ate", "nat", "bat"]

//     let newArr = arr.map(item => {
//         const str = item.split("");
//         str.sort((a, b) => a.localeCompare(b))
//         console.log(str)
//         return {
//             ['key']: item, ['value']: str.join(""),
//         }
//     })

//     let s = newArr.map(item => item.value);
//     let kk = [...new Set(s)]

//     let res = []
//     for (let i = 0; i < kk.length; i++) {
//         res.push(newArr.filter(item => item.value === kk[i]).map(item => item.key))
//     }

//     console.log(res)

/**
 * 冒泡排序
 */

function bubble(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

console.log(bubble([2, 1, 3, 5, 4, 6, 0]));

/**
 * 选择排序
 * 每一轮选择最大（最小）元素，并把它交换到合适的位置
 *
 * 1. 选择轮数 a.length - 1
 * 2. 交换的所以位置 初始 a.length - 1
 *
 */

function selectSort(arr) {
  for (let right = arr.length - 1; right > 0; right--) {
    let max = right;
    for (let i = 0; i < right; i++) {
      if (arr[i] > arr[max]) {
        max = i;
      }
    }

    if (max !== right) {
      let temp = arr[max];
      arr[max] = arr[right];
      arr[right] = temp;
    }
  }

  return arr;
}

console.log(selectSort([2, 1, 3, 5, 4, 6, 0]));

/**
 * 插入排序
 * 将数组分成2部分 [0 ... low - 1] [low...a.length - 1]
 * 左边[0...low - 1]
 * 右边[low...a.length - 1]
 *
 * 每次从未排序区域取出low 位置的元素，插入到已排序区域
 *
 *
 *
 */
function insertionSort(arr, low) {
  if (low === arr.length) {
    return;
  }

  let t = arr[low];
  let i = low - 1;

  // 自右向左找到插入位置，如果比插入元素大，则不断右移动，空出插入位置
  while (i >= 0 && t < arr[i]) {
    arr[i + 1] = arr[i];
    i--;
  }

  // 找到插入位置
  if (i + 1 !== low) {
    arr[i + 1] = t;
  }

  insertionSort(arr, low + 1);
}

function insertionSort2(arr, low) {
  for (let low = 1; low < arr.length; low++) {
    let t = arr[low];
    let i = low - 1;

    // 自右向左找到插入位置，如果比插入元素大，则不断右移动，空出插入位置
    while (i >= 0 && t < arr[i]) {
      arr[i + 1] = arr[i];
      i--;
    }

    // 找到插入位置
    if (i + 1 !== low) {
      arr[i + 1] = t;
    }
  }
}

let arr = [2, 1, 3, 5, 4, 6, 0];
insertionSort2(arr, 1);
console.log(arr);

/**
 * lomuto 单边快排
 * 选择最左侧的为基准点
 * j找比基准点小的，i找比基准点大的，一旦找到，二者交换
 * 最后基准点与i交换， j 即为基准点最终索引
 */

function sort(arr) {
  singleSideQuickSort(arr, 0, arr.length - 1);
  return arr;
}

function singleSideQuickSort(arr, left, right) {
  if (left >= right) return;
  const p = partition(arr, left, right);
  singleSideQuickSort(arr, left, p - 1);
  singleSideQuickSort(arr, p + 1, right);
}

function partition(arr, left, right) {
  let basePoint = arr[right];
  let i = left;
  let j = left;

  while (j < right) {
    if (arr[j] < basePoint) {
      if (i !== j) {
        swap(arr, i, j);
      }
      i++;
    }
    j++;
  }

  swap(arr, i, right);
  return i;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

console.log(sort([2, 1, 3, 5, 0, 4]));

/**
 * 双边快排
 * i 从左边
 * j 从右边
 *
 */

function sort(arr) {
  doubleSideQuickSort(arr, 0, arr.length - 1);
  return arr;
}

function doubleSideQuickSort(arr, left, right) {
  if (left >= right) return;
  const p = partition(arr, left, right);
  doubleSideQuickSort(arr, left, p - 1);
  doubleSideQuickSort(arr, p + 1, right);
}

function partition(arr, left, right) {
  let basePoint = arr[left];
  let i = left;
  let j = right;

  while (i < j) {
    while (i < j && arr[j] > basePoint) {
      j--;
    }
    while (i < j && arr[i] <= basePoint) {
      i++;
    }
    swap(arr, i, j);
  }

  swap(arr, left, i);

  return i;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

console.log(sort([2, 1, 3, 5, 0, 4]));

/**
 * 计数排序
 * 1. 找到最大值，创建一个大小为 最大值 + 1， 的count数组
 * 2. count 数组的索引对应原数组的元素，用来统计该元素额出现次数
 * 3. 遍历count数组，更具count数组的索引以及出现次数，生成排序后的内容，count 数组的索引是：已排序好的
 *
 */

function countingSort(arr) {
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  let counts = new Array(max - min + 1).fill(0);

  for (const v of arr) {
    counts[v - min]++;
  }
  console.log(counts);

  let k = 0;
  for (let i = 0; i < counts.length; i++) {
    // i 代表原始数组元素count[i] ,元素出现的次数
    while (counts[i] > 0) {
      arr[k++] = i + min;
      counts[i]--;
    }
  }

  console.log(arr);
}

countingSort([5, 1, 1, 3, 0, -1, -2]);

/**
 * 桶排序
 * 准备空桶
 */

let ages = [20, 18, 28, 66, 25, 31, 67, 30];

function bucketSort(arr) {
  let buckets = new Array(10).fill(0).map((item) => []);
  console.log(buckets);

  for (let age of ages) {
    buckets[Math.floor(age / 10)].push(age);
  }

  let k = 0;
  for (const bucket of buckets) {
    const sorted = bucket.sort((a, b) => a - b);
    for (const v of sorted) {
      ages[k++] = v;
    }
  }

  console.log(buckets);
  console.log(arr);
}

bucketSort(ages);

/**
 * 桶排序转换成计数排序
 * 优化算法性能
 */

function countingAndBucketSort(arr) {
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  let buckets = new Array(max - min + 1).fill(0).map((item) => []);
  console.log(buckets);

  for (let v of arr) {
    buckets[v - min].push(v);
  }

  let k = 0;
  for (const bucket of buckets) {
    const sorted = bucket.sort((a, b) => a - b);
    for (const v of sorted) {
      arr[k++] = v;
    }
  }

  console.log(buckets);
  console.log(arr);
}

countingAndBucketSort([9, 0, 5, 1, 3, 2, 4, 6, 8, 7]);

/**
 *
 * countingAndBucketSort
 * 添加 range 参数
 *
 */

function countingAndBucketSort(arr, range) {
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  let buckets = new Array(Math.floor((max - min) / range) + 1)
    .fill(0)
    .map((item) => []);
  console.log(buckets);

  for (let v of arr) {
    buckets[Math.floor((v - min) / range)].push(v);
  }

  let k = 0;
  for (const bucket of buckets) {
    const sorted = bucket.sort((a, b) => a - b);
    for (const v of sorted) {
      arr[k++] = v;
    }
  }

  console.log(buckets);
  console.log(arr);
}

countingAndBucketSort([9, 0, 5, 1, 3, 2, 4, 6, 8, 7], 3);

/**
 * 基数排序
 * 先根据个位排序，在根据百位排序
 *
 */

/**
 * 基数排序
 * 先根据个位排序，在根据百位排序
 * 12345678
 */

let nums = [
  "15812345678",
  "15112345678",
  "13512345678",
  "13812345678",
  "13912345678",
  "15912345678",
];

function radixSortLSD(arr, len) {
  const buckets = new Array(10).fill("");
  for (let i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  for (let i = len - 1; i >= 0; i--) {
    // '0' -> 48   '1' -> 49
    for (let s of arr) {
      // console.log(s.charAt(2) - '0')
      buckets[Math.floor(s.charAt(i) - "0")].push(s);
    }

    let k = 0;
    for (let bucket of buckets) {
      for (let i = 0; i < bucket.length; i++) {
        arr[k++] = bucket[i];
      }
      bucket.length = 0;
    }
    console.log(arr);
  }
}

radixSortLSD(nums, 11);

/**
 * LeetCode1122
 */

let arr1 = [3, 2, 1, 2, 2, 1, 2, 5, 4];
let arr2 = [2, 3, 1];

function LeetCode1122(arr1, arr2) {
  let count = new Array(20).fill(0);

  for (const [i, v] of arr1.entries()) {
    count[v]++;
  }

  console.log(count);

  let res = new Array(arr1.length).fill(0);
  let k = 0;

  for (const [i, v] of arr2.entries()) {
    while (count[v] > 0) {
      res[k++] = v;
      count[v]--;
    }
  }

  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      res[k++] = i;
      count[i]--;
    }
  }

  return res;
}

console.log(LeetCode1122(arr1, arr2));

let nums2 = [2, 3, 1, 3, 2];

function leetCode1636(arr) {
  let count = new Array(201).fill(0);

  for (const v of arr) {
    count[v + 100]++;
  }
  console.error(count);

  // 比较器、安频率升序、再按数值降序
  nums2.sort((a, b) => {
    let af = count[a + 100];
    let bf = count[b + 100];
    if (af < bf) {
      return -1;
    } else if (af > bf) {
      return 1;
    } else {
      return b - a;
    }
  });

  console.log(nums2);
}

leetCode1636(nums2);

let nums3 = [9, 1, 3, 5];

function maximumGap(nums) {
  if (nums.length < 2) {
    return 0;
  }

  nums.sort((a, b) => a - b);

  console.log(nums);

  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 > nums.length - 1) break;
    max = Math.max(max, nums[i + 1] - nums[i]);
  }

  console.log(max);
}

maximumGap(nums3);

/**
 * 截取字符串最大K
 */

let str = "ababbc";

function longestSubstring(str, k) {
  let counts = new Array(26).fill(0);
  let ss = str.split("");

  let kk = ss.reduce((curr, next) => {
    let count = curr[next] ?? 0;
    return {
      ...curr,
      [next]: count + 1,
    };
  }, {});

  let list = [];
  for (const k in kk) {
    list.push({ ["key"]: k, ["value"]: kk[k] });
  }

  let res = list.filter((i) => i.value > k)[0]["key"];
  let res2 =
    str.substring(0, str.lastIndexOf(res) + 1) +
    " " +
    str.substring(str.lastIndexOf(res) + 1);
  console.log(res2);
}

longestSubstring(str, 2);

/**
 * 选择排序
 */

function selectSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let max = i;
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[max]) {
        max = j;
      }
    }

    if (max !== i) {
      let temp = arr[max];
      arr[max] = arr[i];
      arr[i] = temp;
    }
  }
}

let arr3 = [6, 2, 1, 0, 3, 5, 4];
selectSort(arr3);
console.log(arr3);

/**
 * 堆排序
 */
// 建立大顶堆
class MaxHeap {
  constructor(arr = []) {
    this.heap = arr;
    this.sort();
  }

  sort() {
    this.heapify(this.heap);
    for (let right = this.heap.length - 1; right > 0; right--) {
      let temp = this.heap[0];
      this.heap[0] = this.heap[right];
      this.heap[right] = temp;
      this.down(0, right);
    }
    console.log(this.heap);
  }

  heapify(arr) {
    let len = arr.length;
    for (let i = (len >>> 1) - 1; i > 0; i--) {
      this.down(i, len);
    }
  }

  down(parent, size) {
    while (true) {
      let left = parent * 2 + 1;
      let right = left + 1;

      let max = parent;
      if (left < size && this.heap[left] > this.heap[max]) {
        max = left;
      }

      if (right < size && this.heap[right] > this.heap[max]) {
        max = right;
      }

      if (max === parent) {
        break;
      }

      let temp = this.heap[max];
      this.heap[max] = this.heap[parent];
      this.heap[parent] = temp;

      parent = max;
    }
  }
}

let heap = new MaxHeap([7, 5, 1, 2, 3, 4, 6]);

/**
 *   插入排序
 *   左边[0 ... low - 1]          已排序区
 *   右边[low ... a.length - 1]   未排序区域
 */

function sort(arr) {
  for (let low = 1; low < arr.length - 1; low++) {
    let t = arr[low];
    let i = low - 1;

    // 自右向左找插入位置，如果待插入元素大，则不断右移，空出插入位置
    while (i >= 0 && t < arr[i]) {
      arr[i + 1] = arr[i];
      i--;
    }

    // 找到插入位置
    if (i + 1 !== low) {
      arr[i + 1] = t;
    }
  }
}

// let arr = [7, 5, 1, 2, 3, 4, 6]
// sort(arr)
// console.log(arr)

/**
 * 希尔排序
 * 分组 分组实现插入，每组元素间隙成为Gap
 * 每轮排序后的gap逐渐变小，直至gap变为1
 */

function shellSort(arr) {
  for (let gap = arr.length >> 1; gap >= 1; gap = gap >> 1) {
    for (let low = gap; low < arr.length - gap; low++) {
      let t = arr[low];
      let i = low - gap;

      // 自右向左找插入位置，如果待插入元素大，则不断右移，空出插入位置
      while (i >= 0 && t < arr[i]) {
        arr[i + gap] = arr[i];
        i -= gap;
      }

      // 找到插入位置
      if (i + 1 !== low) {
        arr[i + gap] = t;
      }
    }
  }
}

let arr4 = [7, 5, 1, 2, 3, 4, 6];
shellSort(arr4);
console.log(arr4);

// let arr = [1, 2, 3, 4, 5, 1, 2, 1, 3, 1, 5, 4]

// let newArr = arr.reduce((curr, next) => {
//     let count = curr[next] ?? 0;
//     return {
//         ...curr, [next]: count + 1,
//     }
// })

// console.log(newArr)

// let list = []
// for (const key in newArr) {
//     list.push({
//         ['key']: key, ['value']: newArr[key]
//     })
// }

// let res = list.reduce((curr, next) => {
//     return next.value > curr.value ?  next : curr
// }, list[0])

// console.log(res.value)

/**
 * 归并排序  分治
 */

// let arr = [9, 3, 7, 2, 8, 5, 1, 4]

// function sort(arr) {
//     split(arr, 0, arr.length - 1);
// }

// function sort2(arr) {
//     let len = arr.length;
//     let newArr = new Array(len).fill(0);
//     for (let width = 1; width < len; width *= 2) {
//         for (let left = 0; left < len; left += 2 * width) {
//             let right = Math.min(left + 2 * width - 1, len - 1);
//             console.log(width, left, right)
//             let m = Math.min(left + width - 1, len - 1);
//         }
//     }
// }

// function merge(arr1, arr2) {

//     const mergedArray = [];
//     let i = 0; // 指向 arr1 的指针
//     let j = 0; // 指向 arr2 的指针

//     while (i < arr1.length && j < arr2.length) {
//         if (arr1[i] < arr2[j]) {
//             mergedArray.push(arr1[i]);
//             i++;
//         } else {
//             mergedArray.push(arr2[j]);
//             j++;
//         }
//     }

//     // 将剩余的元素添加到结果数组中
//     while (i < arr1.length) {
//         mergedArray.push(arr1[i]);
//         i++;
//     }

//     while (j < arr2.length) {
//         mergedArray.push(arr2[j]);
//         j++;
//     }

//     return mergedArray;
// }

// function split(arr, left, right) {
//     let ex = arr.slice(left, right + 1);
//     console.log(ex)
//     // 2. 治
//     if (left === right) {
//         return;
//     }

//     // 1. 分
//     let m = (left + right) >> 1;
//     split(arr, left, m);
//     split(arr, m + 1, right);
// }

// sort(arr);
// sort2(arr);

/**
 * 计数排序
 * 解决负数问题
 */

function sort(arr) {
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  let count = new Array(max - min + 1).fill(0);
  for (const v of arr) {
    count[v - min]++;
  }

  let k = 0;
  for (let i = 0; i < count.length; i++) {
    // 1 i + min 代表原始数组元素count[i]]    2元素出现次数
    while (count[i] > 0) {
      arr[k++] = i + min;
      count[i]--;
    }
  }

  console.log(arr);
}

sort([5, 1, 1, 3, 0, -1]);

/**
 *  桶排序
 */

// let arr = [20, 18, 28, 66, 25, 31, 67, 30];

//     let buckets = new Array(arr.length).fill(0).map(i => [])

//     for (const v of arr) {
//         buckets[Math.floor(v / 10)].push(v);
//     }

//     let res = buckets.map(item => {
//         item.sort((a, b) => a - b)
//         return item
//     })

//     console.log(res.flat())

/**
 * 图
 * 顶点  边
 */

class Vertex {
  constructor(name = "", edges = []) {
    this.name = name;
    this.edges = edges;
    this.visited = false;
  }
}

class Edge {
  constructor(linked = null, weight = 1) {
    this.linked = linked;
    this.weight = weight;
  }
}

const v1 = new Vertex("v1");
const v2 = new Vertex("v2");
const v3 = new Vertex("v3");
const v4 = new Vertex("v4");
const v5 = new Vertex("v5");
const v6 = new Vertex("v6");

v1.edges = [new Edge(v3, 9), new Edge(v2, 7), new Edge(v6, 14)];
v2.edges = [new Edge(v4, 15)];
v3.edges = [new Edge(v4, 11), new Edge(v6, 2)];
v4.edges = [new Edge(v5, 6)];
v6.edges = [new Edge(v5, 9)];

function rDfs(v) {
  v.visited = true;
  console.log(v.name);
  for (const edge of v.edges) {
    if (!edge.linked?.visited) {
      rDfs(edge.linked);
    }
  }
}

function dfs(v) {
  let stack = [];
  stack.push(v);
  while (stack.length) {
    const pop = stack.pop();
    pop.visited = true;
    console.log(pop.name);
    for (const edge of pop.edges) {
      if (!edge.linked.visited) {
        stack.push(edge.linked);
      }
    }
  }
}

function bfs(v) {
  let queue = [];
  queue.push(v);
  v.visited = true;
  while (queue.length) {
    const poll = queue.shift();
    console.log(poll.name);
    for (const edge of poll.edges) {
      if (!edge.linked.visited) {
        edge.linked.visited = true;
        queue.push(edge.linked);
      }
    }
  }
}

bfs(v1);

class DisjointSet {
  constructor(size) {
    this.set = new Array(size).fill(0);
    this.size = new Array(size).fill(1);
    for (let i = 0; i < size; i++) {
      this.set[i] = i; // 索引对应顶点  元素用来表示与之有关系的顶点
    }
  }

  find(x) {
    if (x === this.set[x]) {
      return x;
    }
    return (this.set[x] = this.find(this.set[x]));
  }

  union(x, y) {
    if (this.size[x] < this.size[y]) {
      this.set[x] = y;
      this.size[y] = this.size[x] + this.size[y];
    } else {
      this.set[y] = x;
      this.size[x] = this.size[x] + this.size[y];
    }
  }
}

// 并查集

const set = new DisjointSet(7);
console.log(set);
// set.union(0, 1) // 0 是老大
// set.union(1, 2)
// set.union(2, 3)
// set.union(3, 4)
// set.union(4, 5)
// set.union(5, 6)

console.log("---------------");
set.union(1, 2);
set.union(3, 4);
set.union(1, 3);

console.log(set);
// set.find(6);

set.union(0, 1);
console.log(set);

/**
 * 单边快排  lomuto
 * base 基准点
 * 分区
 */

//  function sort(arr) {
//   quick(arr, 0, arr.length - 1)
// }

// function quick(arr, left, right) {
//   if (left >= right) return;
//   const baseIndex = partition(arr, left, right);
//   quick(arr, left, baseIndex - 1);
//   quick(arr, baseIndex + 1, right);
// }

// function partition(arr, left, right) {
//   let pivot = arr[right];
//   let i = left
//   let j = left;
//   while (j < right) {
//       if (arr[j] < pivot) {
//           if (i !== j) {
//               swap(arr, i, j);
//           }
//           i++;
//       }
//       j++
//   }
//   swap(arr, i, right);
//   return i
// }

// function swap(arr, i, j) {
//   let temp = arr[i];
//   arr[i] = arr[j];
//   arr[j] = temp;
// }

// let arr = [5, 3, 7, 2, 9, 8, 1, 4]
// sort(arr)
// console.log(arr)

/**
 * 双边快排
 */

// function sort(arr) {
//   quick(arr, 0, arr.length - 1)
// }

// function quick(arr, left, right) {
//   if (left >= right) return;
//   const baseIndex = partition(arr, left, right);
//   quick(arr, left, baseIndex - 1);
//   quick(arr, baseIndex + 1, right);
// }

// function partition(arr, left, right) {
//   let pivot = arr[left]
//   let i = left;
//   let j = right;

//   while (i < j) {

//       /**
//        * 这里有个细节，
//        * 两个while的先手顺序
//        * 必须先从右向左
//        * 然后再从左向右
//        *
//        * 里面的循环条件 i < j 的条件不能少
//        * 要先处理 j， 再处理 i
//        *
//        */

//       while (i < j && arr[j] > pivot) {
//           j--;
//       }

//       while (i < j && arr[i] <= pivot) {
//           i++;
//       }
//       swap(arr, i, j);
//   }

//   swap(arr, left, i);
//   return i;

// }

// function swap(arr, i, j) {
//   let temp = arr[i]
//   arr[i] = arr[j];
//   arr[j] = temp;
// }

// let arr = [5, 3, 7, 2, 9, 8, 1, 4]
// sort(arr)
// console.log(arr)

/**
 * 双边快排
 */

//  function sort(arr) {
//   quick(arr, 0, arr.length - 1)
// }

// function sort2(arr) {
//   quick2(arr, 0, arr.length - 1)
// }

// function quick(arr, left, right) {
//   if (left >= right) return;
//   const baseIndex = partition(arr, left, right);
//   quick(arr, left, baseIndex - 1);
//   quick(arr, baseIndex + 1, right);
// }

// function quick2(arr, left, right) {
//   if (left >= right) return;
//   const baseIndex = partition2(arr, left, right);
//   quick2(arr, left, baseIndex - 1);
//   quick2(arr, baseIndex + 1, right);
// }

// function partition(arr, left, right) {

//   // 优化算法- 找一个随机区间

//   let pivot = arr[left]
//   let i = left;
//   let j = right;

//   while (i < j) {

//       /**
//        * 这里有个细节，
//        * 两个while的先手顺序
//        * 必须先从右向左
//        * 然后再从左向右
//        *
//        * 里面的循环条件 i < j 的条件不能少
//        * 要先处理 j， 再处理 i
//        *
//        */

//       while (i < j && arr[j] > pivot) {
//           j--;
//       }

//       while (i < j && arr[i] <= pivot) {
//           i++;
//       }
//       swap(arr, i, j);
//   }

//   swap(arr, left, i);
//   return i;

// }

// function partition2(arr, left, right) {
//   let pv = arr[left];
//   let i = left + 1;
//   let j = right;

//   while (i <= j) {
//       while (i <= j && arr[i] < pv) {
//           i++
//       }
//       while (i <= j && arr[j] > pv) {
//           j--

//       }
//       if (i <= j) {
//           swap(arr, i, j);
//           i++;
//           j--;
//       }
//   }

//   swap(arr, j, left);
//   return j;
// }

// function swap(arr, i, j) {
//   let temp = arr[i]
//   arr[i] = arr[j];
//   arr[j] = temp;
// }

// let arr = [5, 3, 7, 2, 9, 8, 1, 4]
// sort2(arr)
// console.log(arr)

// 给定一个字符串，里边可能包含“()”, “[]”, “{}”括号，请编写程序检查该字符串的括号是否闭合。例如，
// 1."()" yes
// 2.")(" no;
// 3."(()" no;
// 4."{}()" yes;
// 5."{()}" yes;
// 6."{(})" no.

//   function checkBracketClosed(str) {
//     let stack = []
//     for (let e of str) {
//         if (e === '(') {
//             stack.push(")")
//         } else if (e === "{") {
//             stack.push("}")
//         }

//         if (e === ")" && stack.length) {
//             let pop = stack.pop()
//             if (pop !== ")") {
//                 console.log('No')
//                 return
//             }
//         }

//         if (e === "}" && stack.length) {
//             let pop = stack.pop()
//             if (pop !== "}") {
//                 console.log('No')
//                 return
//             }
//         }
//     }

//     if (stack.length) {
//         console.log('No')
//     } else {
//         console.log('yes')
//     }
// }

// checkBracketClosed("{(})")

// let nums = [2, 7, 11, 15];
// let target = 9;

// let nums = [3, 2, 4]
// let target = 6

// function permutation(arr, k) {
//     let res = []

//     function dfs(stack, start) {
//         if (stack.length === k) {
//             res.push([...stack])
//             return;
//         }
//         for (let i = start; i < arr.length; i++) {
//             stack.push(arr[i]);
//             dfs(stack, i + 1)
//             stack.pop();
//         }
//     }

//     dfs([], 0);
//     return res;
// }

// const resList = permutation(nums, 2);
// const res = resList.filter(i => i[0] + i[1] === target);
// console.log([nums.findIndex(i => i === res[0][0]), nums.findIndex(i => i === res[0][1])])

// let nums = [2, 7, 9, 11]
// let target = 9

// function findTwoSum(nums, target) {
//     let map = new Map();
//     for (let i = 0; i < nums.length; i++) {
//         let x = nums[i]
//         let match = target - x;
//         if (map.has(match)) {
//             return [i, map.get(match)]
//         } else {
//             map.set(x, i)
//         }
//     }
//     return -1;
// }

// console.log(findTwoSum(nums, target));

//   function lengthOfLongestSubstring(str) {
//     let map = new Map();
//     let begin = 0;
//     let end = 0;
//     let max = 0;
//     for (let end = 0; end < str.length; end++) {
//         let c = str.charAt(end);
//         if (map.has(c)) {
//             begin = Math.max(begin, map.get(c) + 1)
//             map.set(c, end);
//         } else {
//             map.set(c, end);
//         }
//         max = Math.max(max, end - begin + 1);
//     }
//     return max
// }

// // let str = "abcabcbb";
// let str = "abba";
// console.log(lengthOfLongestSubstring(str));

//   function strGrouped() {let map = new Map()
//     let str = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
//     str.reduce((accumulator, currentValue, currentIndex) => {
//         let item = currentValue.split("").sort().join("")
//         if(map.has(item)) {
//             map.get(item).push(currentValue)
//         } else {
//             map.set(item, [currentValue])
//         }
//     }, 0)
//     console.log(map)
// }

// strGrouped()

// 存在重复元素
/**
 * nums = [1, 2, 3, 1]
 * 输出true
 *
 * nums2 = [1, 2, 3, 4]
 * 输出false
 */

// const nums = [1, 2, 3, 4]

// function checkForDuplicates(arr) {
//     let map = new Map();
//     for (let i = 0; i < arr.length; i++) {
//         if (map.has(arr[i])) {
//             return false;
//         } else {
//             map.set(arr[i], i);
//         }
//     }
//     return map.size === arr.length
// }

// console.log(checkForDuplicates(nums));

// let nums = [2, 2, 1]
// let nums2 = [4, 1, 2, 1, 2]

// function findTheLeastCountElement(arr) {
//     let res = arr.reduce((curr, next) => {
//         let count = curr[next] ?? 0;
//         return {
//             ...curr, [next]: count + 1
//         }
//     }, {})

//     for (const k in res) {
//         if (res[k] === 1) {
//             return k
//         }
//     }
//     return -1;
// }

// console.log(findTheLeastCountElement(nums2));

// let nums = [2, 2, 1]
// let nums2 = [4, 1, 2, 1, 2]

// function singleNumber(nums) {
//     let num = nums[0]
//     for (let i = 1; i < nums.length; i++) {
//         num = num ^ nums[i]
//     }
//     console.log(num)
// }

// singleNumber(nums2);

// let s = 'anagram'
// let t = 'nagaram'

// function getKey(str) {
//     let array = new Array(26).fill(0);
//     for (let i = 0; i < str.length; i++) {
//         array[str.charCodeAt(i) - 97]++
//     }
//     return array
// }

// function arrayAreEquals(s, t) {
//     return getKey(s).toString() === getKey(t).toString();
// }

// console.log(arrayAreEquals(s, t));

// let s = "leetcode"

// function findUniqChar(str) {
//     let container = new Array(26).fill(0);
//     for (let i = 0; i < str.length; i++) {
//         container[str.charCodeAt(i) - 97]++
//     }

//     for (let i = 0; i < str.length; i++) {
//         if (container[str.charCodeAt(i) - 97] === 1) {
//             console.log(str[i])
//             return i;
//         }
//     }

//     return -1;

// }

// console.log(findUniqChar(s));

function checkBracketClosed(str) {
  let stack = [];
  for (let c of str) {
    if (c === "(") {
      stack.push(")");
    } else if (c === "{") {
      stack.push("}");
    } else if (c === "[") {
      stack.push("]");
    } else {
      if (c === stack.at(-1)) {
        stack.pop();
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;
}

console.log(checkBracketClosed("({})"));

/**
 * 活动问题
 */
class Activity {
  constructor(index, start, finish) {
    this.index = index;
    this.start = start;
    this.finish = finish;
  }
}

let activities = [
  new Activity(0, 1, 3),
  new Activity(1, 2, 4),
  new Activity(2, 3, 5),
];
activities.sort((a, b) => a.finish - b.finish);
console.log(activities);

function selectActivity(act, n) {
  let res = [];
  res.push(act[0]);
  let prev = act[0];
  for (let i = 1; i < n; i++) {
    let currAct = act[i];
    if (currAct.start >= prev.finish) {
      res.push(currAct);
      prev = currAct;
    }
  }

  console.log(res);
}

selectActivity(activities, activities.length);

/**
 * 降维的斐波那契
 */

function f(n) {
  if (n === 0) return 0;

  if (n === 1) {
    return 1;
  }

  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    let c = b + a;
    a = b;
    b = c;
  }
  return b;
}

console.log(f(13));
