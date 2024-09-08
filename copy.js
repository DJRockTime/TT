// function combine(arr, k) {
//
//     let res = []
//
//     function dfs(curr, start) {
//
//         if (curr.length === k) {
//             res.push([...curr])
//             return;
//         }
//
//         for (let i = start; i < arr.length; i++) {
//             curr.push(arr[i])
//             dfs(curr, i + 1);
//             curr.pop()
//         }
//     }
//
//     dfs([], 0)
//     return res;
// }
//
//
// console.log(combine([1, 2, 3], 2));


// function permute(arr) {
//     let res = []
//     let stack = [];
//     let visited = [false, false, false]
//
//     function dfs(arr, visited, stack) {
//
//         if (stack.length === arr.length) {
//             res.push([...stack])
//             return;
//         }
//
//
//         for (let i = 0; i < arr.length; i++) {
//             if (!visited[arr[i]]) {
//                 stack.push(arr[i])
//                 visited[i] = true;
//                 dfs(arr, visited, stack)
//                 visited[i] = false;
//                 stack.pop();
//             }
//         }
//
//     }
//
//     dfs(arr, visited, stack)
//     return res;
// }

//
//
// console.log(permute([1, 2, 3]));

// function permute(arr) {
//     let res = [];
//     let stack = [];
//     let visited = [false, false, false];
//
//     function dfs(arr, visited, stack) {
//         if (stack.length === arr.length) {
//             res.push([...stack]);
//             return;
//         }
//
//         for (let i = 0; i < arr.length; i++) {
//             if (i > 0 && arr[i] === arr[i - 1] && !visited[i - 1]) {
//                 continue
//             }
//             if (!visited[i]) {
//                 stack.push(arr[i]);
//                 visited[i] = true;
//                 dfs(arr, visited, stack);
//                 visited[i] = false;
//                 stack.pop();
//             }
//         }
//     }
//
//     dfs(arr, visited, stack);
//     return res;
// }
//
// console.log(permute([1, 2, 3]));


// function combine2(arr, k) {
//     let res = []
//
//     function dfs(curr, start) {
//         if (curr.length === k) {
//             res.push([...curr])
//             return
//         }
//
//         for (let i = start; i < arr.length; i++) {
//             curr.push(arr[i])
//             dfs(curr, i + 1)
//             curr.pop()
//         }
//     }
//
//     dfs([], 0)
//
//     return res;
// }
//
// console.log(combine2([1, 2, 3], 2))


function permute(arr) {
    let res = []
    let stack = []
    let visited = new Array(arr.length).fill(false);

    function dfs(arr, visited, stack) {

        if (stack.length === arr.length) {
            res.push([...stack])
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            if (!visited[i]) {
                stack.push(arr[i])
                visited[i] = true
                dfs(arr, visited, stack)
                visited[i] = false
                stack.pop()
            }
        }
    }


    dfs(arr, visited, stack);
    return res
}


console.log(permute([1, 2, 3]));


class MaxHeap {
    constructor(arr = []) {
        this.heap = arr;
    }


    heapify() {
        for (let i = this.lastLeafNode(); i >= 0; i--) {
            this.siftDown(i);
        }
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


    siftDown(parent) {
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
            let temp = this.heap[max];
            this.heap[max] = this.heap[parent];
            this.heap[parent] = temp;
            this.down(max);
        }
    }


    siftUp() {

    }


    lastLeafNode() {
        return (this.heap.length - 1) >>> 1
    }
}
































































































































































































































































