const aa = "hello";

// 动态规划
function UniquePaths(m, n) {
    let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));

    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }

    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    return dp[m - 1][n - 1];
}

// 降维处理
function UniquePaths2(m, n) {
    let dp = new Array(n).fill(1);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }

    return dp[n - 1];
}

console.log(UniquePaths(3, 7));
console.log(UniquePaths2(3, 7));

// TODO: 1217
function minCostToMoveChips(position) {
    let oddCount = 0;
    let evenCount = 0;

    for (const pos of position) {
        if (pos % 2 === 0) {
            evenCount++;
        } else {
            oddCount++;
        }
    }

    return Math.min(oddCount, evenCount);
}

// TODO: 1218
function longestSubsequence(arr, difference) {
    let map = new Map();
    let max = 0;

    for (const num of arr) {
        map.set(num, (map.get(num - difference) || 0) + 1);
        max = Math.max(max, map.get(num));
    }

    return max;
}

function longestSubsequence(arr, difference) {
    const dp = new Map();
    let maxLength = 0;

    for (const num of arr) {
        const prev = num - difference;
        const length = (dp.get(prev) || 0) + 1;
        dp.set(num.length);
        maxLength = Math.max(maxLength, length);
    }

    return maxLength;
}

// TODO: 1219

function UniquePaths2(m, n) {
    let dp = new Array(n).fill(1);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }
    return dp[n - 1];
}

// TODO: 1220
function countVowelPermutation(n) {
    const MOD = 10 ** 9 + 7;
    const dp = Array.form({ length: n + 1 }, () => Array(5).fill(0));

    for (let j = 0; j < 5; j++) {
        dp[1][j] = 1;
    }

    for (let i = 2; i < n; i++) {
        dp[i][0] = dp[i - 1][1] % MOD;
        dp[i][1] = (dp[i - 1][0] + dp[i - 1][2]) % MOD; // 'e' 后面只能跟 'a' 或 'i'
        dp[i][2] =
            (dp[i - 1][0] + dp[i - 1][1] + dp[i - 1][3] + dp[i - 1][4]) % MOD; // 'i' 后面不能跟 'i'
        dp[i][3] = (dp[i - 1][2] + dp[i - 1][4]) % MOD; // 'o' 后面只能跟 'i' 或 'u'
        dp[i][4] = dp[i - 1][0] % MOD; // 'u' 后面只能跟 'a'
    }

    const result = (dp[n][0] + dp[n][1] + dp[n][2] + dp[n][3] + dp[n][4]) % MOD;
    return result;
}

// TODO: 1221
function balancedStringSplit(s) {
    let count = 0;
    let result = 0;

    for (const char of s) {
        if (char === "L") {
            count++;
        } else if (char === "R") {
            count--;
        }

        if (count === 0) {
            result++;
        }
    }

    return result;
}

// TODO: 1222
function queensAttackTheKing(queens, king) {
    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0], // 上下左右
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1], // 四个对角线
    ];
    const queenSet = new Set(queens.map((q) => q.toString()));
    const result = [];

    for (const [dx, dy] of directions) {
        let x = king[0] + dx;
        let y = king[1] + dy;
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (queenSet.has([x, y].toString())) {
                result.push([x, y]);
                break;
            }
            x += dx;
            y += dy;
        }
    }

    return result;
}

// TODO: 1223
const MOD = 10 ** 9 + 7;

function dieSimulator(n, rollMax) {
    // dp[i][j] 表示投掷 i 次，最后一次是数字 j 的有效序列数目
    const dp = Array.from({ length: n + 1 }, () => Array(6).fill(0));

    // 初始状态：投掷 1 次的每个结果
    for (let j = 0; j < 6; j++) {
        dp[1][j] = 1;
    }

    // 从第 2 次开始，动态计算
    for (let i = 2; i <= n; i++) {
        for (let j = 0; j < 6; j++) {
            // 为了计算 dp[i][j]，我们需要考虑上次投掷点数不是 j 的情况
            for (let k = 1; k <= rollMax[j]; k++) {
                if (i - k >= 0) {
                    let sum = 0;
                    // 累加上次不是 j 的点数
                    for (let prev = 0; prev < 6; prev++) {
                        if (prev !== j) {
                            sum = (sum + dp[i - k][prev]) % MOD;
                        }
                    }
                    dp[i][j] = (dp[i][j] + sum) % MOD;
                }
            }
        }
    }

    // 结果是 dp[n][0..5] 的总和
    let result = 0;
    for (let j = 0; j < 6; j++) {
        result = (result + dp[n][j]) % MOD;
    }

    return result;
}

// 示例
console.log(dieSimulator(2, [1, 1, 2, 2, 2, 3])); // 输出: 34
console.log(dieSimulator(2, [1, 1, 1, 1, 1, 1])); // 输出: 30
console.log(dieSimulator(3, [1, 1, 1, 2, 2, 3])); // 输出: 181

// TODO: 1224
function maxEqualFreq(nums) {
    const count = new Map(); // 记录每个数字的出现次数
    const freq = new Map(); // 记录每个出现次数的频率
    let maxFreq = 0; // 当前最大的出现次数
    let result = 0;

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const prevCount = count.get(num) || 0;
        const newCount = prevCount + 1;
        count.set(num, newCount);

        // 更新频率表
        if (prevCount > 0) {
            freq.set(prevCount, (freq.get(prevCount) || 0) - 1);
            if (freq.get(prevCount) === 0) {
                freq.delete(prevCount);
            }
        }
        freq.set(newCount, (freq.get(newCount) || 0) + 1);

        maxFreq = Math.max(maxFreq, newCount);

        // 检查是否满足条件
        const condition1 = maxFreq === 1;
        const condition2 = freq.get(maxFreq) * maxFreq === i + 1;
        const condition3 =
            freq.get(maxFreq) * maxFreq +
                freq.get(maxFreq - 1) * (maxFreq - 1) ===
            i + 1;
        const condition4 = freq.get(maxFreq) * maxFreq + 1 === i + 1;

        if (condition1 || condition2 || condition3 || condition4) {
            result = i + 1;
        }
    }

    return result;
}

// 示例测试
console.log(maxEqualFreq([2, 2, 1, 1, 5, 3, 3, 5])); // 输出: 7
console.log(maxEqualFreq([1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5])); // 输出: 13

// TODO: 1219   3208

function countAlternatingGroups(colors, k) {
    const n = colors.length;
    let count = 0;

    for (let i = 0; i < n; i++) {
        let isValid = true;
        for (let j = 0; j < k; j++) {
            const current = colors[(i + j) % n];
            const next = colors[(i + j + 1) % n];
            if (j < k - 1 && current === next) {
                isValid = false;
                break;
            }
        }
        if (isValid) {
            count++;
        }
    }

    return count;
}

// 示例测试
console.log(countAlternatingGroups([0, 1, 0, 1, 0], 3)); // 输出: 3
console.log(countAlternatingGroups([0, 1, 0, 0, 1, 0, 1], 6)); // 输出: 2
console.log(countAlternatingGroups([1, 1, 0, 1], 4)); // 输出: 0

// TODO: 1220   2073

/**
 * @param {number[]} tickets
 * @param {number} k
 * @return {number}
 */
var timeRequiredToBuy = function (tickets, k) {
    let time = 0;
    const n = tickets.length;

    while (tickets[k] > 0) {
        for (let i = 0; i < n; i++) {
            if (tickets[i] > 0) {
                tickets[i]--;
                time++;
                if (i === k && tickets[k] === 0) {
                    return time;
                }
            }
        }
    }

    return time;
};

// 示例测试
console.log(timeRequiredToBuy([2, 3, 2], 2)); // 输出: 6
console.log(timeRequiredToBuy([5, 1, 1, 1], 0)); // 输出: 8

// TODO: 1221   1388

/**
 * @param {number[]} slices
 * @return {number}
 */
var maxSizeSlices = function (slices) {
    const n = slices.length / 3;

    // 辅助函数，计算从 slices 数组中选择 n 块不相邻的披萨的最大和
    function maxSum(slices) {
        const m = slices.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                dp[i][j] = Math.max(
                    dp[i - 1][j],
                    (i > 1 ? dp[i - 2][j - 1] : 0) + slices[i - 1],
                );
            }
        }

        return dp[m][n];
    }

    // 计算两种情况的最大和
    const case1 = maxSum(slices.slice(0, slices.length - 1));
    const case2 = maxSum(slices.slice(1));

    // 返回两种情况中的最大值
    return Math.max(case1, case2);
};

// 示例测试
console.log(maxSizeSlices([1, 2, 3, 4, 5, 6])); // 输出: 10
console.log(maxSizeSlices([8, 9, 8, 6, 1, 1])); // 输出: 16

// TODO: 1222   1315

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumEvenGrandparent = function (root) {
    let sum = 0;

    function dfs(node, parent, grandparent) {
        if (!node) return;

        if (grandparent && grandparent.val % 2 === 0) {
            sum += node.val;
        }

        dfs(node.left, node, parent);
        dfs(node.right, node, parent);
    }

    dfs(root, null, null);
    return sum;
};

// 示例测试
const root = new TreeNode(
    6,
    new TreeNode(
        7,
        new TreeNode(2, new TreeNode(9), null),
        new TreeNode(7, new TreeNode(1), new TreeNode(4)),
    ),
    new TreeNode(8, new TreeNode(1), new TreeNode(3, null, new TreeNode(5))),
);

console.log(sumEvenGrandparent(root)); // 输出: 18

// TODO: 1223   39

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
    const result = [];

    function backtrack(remaining, start, combination) {
        if (remaining === 0) {
            result.push([...combination]);
            return;
        }
        if (remaining < 0) {
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            combination.push(candidates[i]);
            backtrack(remaining - candidates[i], i, combination);
            combination.pop();
        }
    }

    backtrack(target, 0, []);
    return result;
};

// 示例测试
console.log(combinationSum([2, 3, 6, 7], 7)); // 输出: [[2, 2, 3], [7]]
console.log(combinationSum([2, 3, 5], 8)); // 输出: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
console.log(combinationSum([2], 1)); // 输出: []

// TODO: 1224   3397

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxDistinctElements = function (nums, k) {
    const set = new Set();

    for (const num of nums) {
        for (let i = -k; i <= k; i++) {
            set.add(num + i);
        }
    }

    return set.size;
};

// 示例测试
console.log(maxDistinctElements([1, 2, 2, 3, 3, 4], 2)); // 输出: 6
console.log(maxDistinctElements([4, 4, 4, 4], 1)); // 输出: 3

// TODO: 1225   1705

/**
 * @param {number[]} apples
 * @param {number[]} days
 * @return {number}
 */
var eatenApples = function (apples, days) {
    const heap = new MinPriorityQueue({ priority: (a) => a[0] });
    let day = 0;
    let eaten = 0;

    while (day < apples.length || heap.size() > 0) {
        // 如果当天有新的苹果长出，将它们的腐烂日期和数量加入优先队列
        if (day < apples.length && apples[day] > 0) {
            heap.enqueue([day + days[day], apples[day]]);
        }

        // 移除优先队列中所有已经腐烂的苹果
        while (heap.size() > 0 && heap.front().element[0] <= day) {
            heap.dequeue();
        }

        // 如果优先队列不为空，吃掉一个最早腐烂的苹果
        if (heap.size() > 0) {
            const [rotDay, count] = heap.dequeue().element;
            if (count > 1) {
                heap.enqueue([rotDay, count - 1]);
            }
            eaten++;
        }

        day++;
    }

    return eaten;
};

// 示例测试
console.log(eatenApples([1, 2, 3, 5, 2], [3, 2, 1, 4, 2])); // 输出: 7
console.log(eatenApples([3, 0, 0, 0, 0, 2], [3, 0, 0, 0, 0, 2])); // 输出: 5

// TODO: 1226   2260

/**
 * @param {number[]} cards
 * @return {number} // 滑动窗口
 */
var minimumCardPickup = function (cards) {
    const lastSeen = new Map();
    let minLength = Infinity;

    for (let i = 0; i < cards.length; i++) {
        if (lastSeen.has(cards[i])) {
            const prevIndex = lastSeen.get(cards[i]);
            minLength = Math.min(minLength, i - prevIndex + 1);
        }
        lastSeen.set(cards[i], i);
    }

    return minLength === Infinity ? -1 : minLength;
};

// 示例测试
console.log(minimumCardPickup([3, 4, 2, 3, 4, 7])); // 输出: 4
console.log(minimumCardPickup([1, 0, 5, 3])); // 输出: -1

// TODO: 1227   3083

/**
 * @param {string} s
 * @return {boolean} // 哈希表
 */
var isSubstringPresent = function (s) {
    const substrings = new Set();

    // 记录字符串 s 中所有长度为 2 的子字符串
    for (let i = 0; i < s.length - 1; i++) {
        substrings.add(s.substring(i, i + 2));
    }

    // 反转字符串 s
    const reversedS = s.split("").reverse().join("");

    // 检查反转字符串中的长度为 2 的子字符串是否存在于哈希表中
    for (let i = 0; i < reversedS.length - 1; i++) {
        if (substrings.has(reversedS.substring(i, i + 2))) {
            return true;
        }
    }

    return false;
};

// 示例测试
console.log(isSubstringPresent("leetcode")); // 输出: true
console.log(isSubstringPresent("abcba")); // 输出: true
console.log(isSubstringPresent("abcd")); // 输出: false

// TODO: 1228   3394

/**
 * @param {number} n
 * @param {number[][]} rectangles
 * @return {boolean}
 */
var checkValidCuts = function (n, rectangles) {
    // 收集所有矩形的上下边界（y 坐标）
    const yCoords = new Set();
    const xCoords = new Set();
    for (const [startx, starty, endx, endy] of rectangles) {
        yCoords.add(starty);
        yCoords.add(endy);
        xCoords.add(startx);
        xCoords.add(endx);
    }

    // 将边界排序
    const ySorted = Array.from(yCoords).sort((a, b) => a - b);
    const xSorted = Array.from(xCoords).sort((a, b) => a - b);

    // 检查水平切割
    if (checkCuts(ySorted, rectangles, "horizontal")) {
        return true;
    }

    // 检查垂直切割
    if (checkCuts(xSorted, rectangles, "vertical")) {
        return true;
    }

    return false;
};

function checkCuts(coords, rectangles, direction) {
    for (let i = 1; i < coords.length - 1; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const cut1 = coords[i];
            const cut2 = coords[j];
            const parts = [0, 0, 0];

            for (const [startx, starty, endx, endy] of rectangles) {
                if (direction === "horizontal") {
                    if (endy <= cut1) {
                        parts[0]++;
                    } else if (starty >= cut2) {
                        parts[2]++;
                    } else {
                        parts[1]++;
                    }
                } else {
                    if (endx <= cut1) {
                        parts[0]++;
                    } else if (startx >= cut2) {
                        parts[2]++;
                    } else {
                        parts[1]++;
                    }
                }
            }

            if (parts[0] > 0 && parts[1] > 0 && parts[2] > 0) {
                return true;
            }
        }
    }
    return false;
}

// 示例测试
console.log(
    checkValidCuts(5, [
        [1, 0, 5, 2],
        [0, 2, 2, 4],
        [3, 2, 5, 3],
        [0, 4, 4, 5],
    ]),
); // 输出: true
console.log(
    checkValidCuts(4, [
        [0, 0, 1, 1],
        [2, 0, 3, 4],
        [0, 2, 2, 3],
        [3, 0, 4, 3],
    ]),
); // 输出: true
console.log(
    checkValidCuts(4, [
        [0, 2, 2, 4],
        [1, 0, 3, 2],
        [2, 2, 3, 4],
        [3, 0, 4, 2],
        [3, 2, 4, 4],
    ]),
); // 输出: false

// TODO: 1229   3393

/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number}  dp
 */
var countPathsWithXorValue = function (grid, k) {
    const MOD = 10 ** 9 + 7;
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array.from({ length: m }, () =>
        Array.from({ length: n }, () => Array(16).fill(0)),
    );

    dp[0][0][grid[0][0]] = 1;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let xor = 0; xor < 16; xor++) {
                if (i > 0) {
                    dp[i][j][xor ^ grid[i][j]] =
                        (dp[i][j][xor ^ grid[i][j]] + dp[i - 1][j][xor]) % MOD;
                }
                if (j > 0) {
                    dp[i][j][xor ^ grid[i][j]] =
                        (dp[i][j][xor ^ grid[i][j]] + dp[i][j - 1][xor]) % MOD;
                }
            }
        }
    }

    return dp[m - 1][n - 1][k];
};

// 示例测试
console.log(
    countPathsWithXorValue(
        [
            [2, 1, 5],
            [7, 10, 0],
            [12, 6, 4],
        ],
        11,
    ),
); // 输出: 3
console.log(
    countPathsWithXorValue(
        [
            [1, 3, 3, 3],
            [0, 3, 3, 2],
            [3, 0, 1, 1],
        ],
        2,
    ),
); // 输出: 5
console.log(
    countPathsWithXorValue(
        [
            [1, 1, 1, 2],
            [3, 0, 3, 2],
            [3, 0, 2, 2],
        ],
        10,
    ),
); // 输出: 0

// TODO: 1230   1366

/**
 * @param {string[]} votes
 * @return {string}
 */
var rankTeams = function (votes) {
    const n = votes[0].length;
    const rankings = {};

    // 初始化哈希表
    for (const vote of votes) {
        for (let i = 0; i < n; i++) {
            const team = vote[i];
            if (!rankings[team]) {
                rankings[team] = Array(n).fill(0);
            }
            rankings[team][i]++;
        }
    }

    // 将团队按票数进行排序
    const teams = Object.keys(rankings);
    teams.sort((a, b) => {
        for (let i = 0; i < n; i++) {
            if (rankings[a][i] !== rankings[b][i]) {
                return rankings[b][i] - rankings[a][i];
            }
        }
        return a.localeCompare(b);
    });

    return teams.join("");
};

// 示例测试
console.log(rankTeams(["ABC", "ACB", "ABC", "ACB", "ACB"])); // 输出: "ACB"
console.log(rankTeams(["WXYZ", "XYZW"])); // 输出: "XWYZ"
console.log(rankTeams(["ZMNAGUEDSJYLBOPHRQICWFXTVK"])); // 输出: "ZMNAGUEDSJYLBOPHRQICWFXTVK"

// TODO: 1231   3403

/**
 * @param {string} word
 * @param {number} numFriends
 * @return {string}
 */
var answerString = function (word, numFriends) {
    const box = new Set();
    const n = word.length;

    function backtrack(start, parts) {
        if (parts.length === numFriends) {
            if (start === n) {
                for (const part of parts) {
                    box.add(part);
                }
            }
            return;
        }

        for (let i = start + 1; i <= n; i++) {
            parts.push(word.substring(start, i));
            backtrack(i, parts);
            parts.pop();
        }
    }

    backtrack(0, []);

    return Array.from(box).sort().pop();
};

// 示例测试
console.log(answerString("dbca", 2)); // 输出: "dbc"
console.log(answerString("gggg", 4)); // 输出: "g"

// TODO: 0102   729

class MyCalendar {
    constructor() {
        this.bookings = [];
    }

    /**
     * @param {number} startTime
     * @param {number} endTime
     * @return {boolean}
     */
    book(startTime, endTime) {
        for (const [start, end] of this.bookings) {
            if (startTime < end && endTime > start) {
                return false;
            }
        }
        this.bookings.push([startTime, endTime]);
        return true;
    }
}

// 示例测试
const myCalendar = new MyCalendar();
console.log(myCalendar.book(10, 20)); // 输出: true
console.log(myCalendar.book(15, 25)); // 输出: false
console.log(myCalendar.book(20, 30)); // 输出: true

// TODO: 0103   2865

/**
 * @param {number[]} heights
 * @return {number}
 */
var maximumSumOfHeights = function (heights) {
    const n = heights.length;
    let maxSum = 0;

    for (let peak = 0; peak < n; peak++) {
        let sum = heights[peak];
        let minHeight = heights[peak];

        // 向左扩展
        for (let i = peak - 1; i >= 0; i--) {
            minHeight = Math.min(minHeight, heights[i]);
            sum += minHeight;
        }

        minHeight = heights[peak];

        // 向右扩展
        for (let i = peak + 1; i < n; i++) {
            minHeight = Math.min(minHeight, heights[i]);
            sum += minHeight;
        }

        maxSum = Math.max(maxSum, sum);
    }

    return maxSum;
};

// 示例测试
console.log(maximumSumOfHeights([5, 3, 4, 1, 1])); // 输出: 13
console.log(maximumSumOfHeights([6, 5, 3, 9, 2, 7])); // 输出: 22
console.log(maximumSumOfHeights([3, 2, 5, 5, 2, 3])); // 输出: 18

// TODO: 0104   2280

/**
 * @param {number[][]} stockPrices
 * @return {number}
 */
var minimumLines = function (stockPrices) {
    if (stockPrices.length === 1) return 0;

    // 对 stockPrices 按 dayi 进行排序
    stockPrices.sort((a, b) => a[0] - b[0]);

    let lines = 1;

    for (let i = 2; i < stockPrices.length; i++) {
        const [x1, y1] = stockPrices[i - 2];
        const [x2, y2] = stockPrices[i - 1];
        const [x3, y3] = stockPrices[i];

        // 计算斜率 (y2 - y1) / (x2 - x1) 和 (y3 - y2) / (x3 - x2)
        // 使用乘法避免浮点数精度问题
        if ((y2 - y1) * (x3 - x2) !== (y3 - y2) * (x2 - x1)) {
            lines++;
        }
    }

    return lines;
};

// 示例测试
console.log(
    minimumLines([
        [1, 7],
        [2, 6],
        [3, 5],
        [4, 4],
        [5, 4],
        [6, 3],
        [7, 2],
        [8, 1],
    ]),
); // 输出: 3
console.log(
    minimumLines([
        [3, 4],
        [1, 2],
        [7, 8],
        [2, 3],
    ]),
); // 输出: 1

// TODO: 0105   3404

/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfSubsequences = function (nums) {
    let count = 0;
    const n = nums.length;

    for (let p = 0; p < n - 6; p++) {
        for (let q = p + 2; q < n - 4; q++) {
            for (let r = q + 2; r < n - 2; r++) {
                for (let s = r + 2; s < n; s++) {
                    if (nums[p] * nums[r] === nums[q] * nums[s]) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
};

// 示例测试
console.log(numberOfSubsequences([1, 2, 3, 4, 3, 6, 1])); // 输出: 1
console.log(numberOfSubsequences([3, 4, 3, 4, 3, 4, 3, 4])); // 输出: 3

// TODO: 0106   2043 ***

/**
 * @param {number[]} balance
 */
var Bank = function (balance) {
    this.balance = balance;
};

/**
 * @param {number} account1
 * @param {number} account2
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.transfer = function (account1, account2, money) {
    if (
        this.isValidAccount(account1) &&
        this.isValidAccount(account2) &&
        this.balance[account1 - 1] >= money
    ) {
        this.balance[account1 - 1] -= money;
        this.balance[account2 - 1] += money;
        return true;
    }
    return false;
};

/**
 * @param {number} account
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.deposit = function (account, money) {
    if (this.isValidAccount(account)) {
        this.balance[account - 1] += money;
        return true;
    }
    return false;
};

/**
 * @param {number} account
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.withdraw = function (account, money) {
    if (this.isValidAccount(account) && this.balance[account - 1] >= money) {
        this.balance[account - 1] -= money;
        return true;
    }
    return false;
};

/**
 * @param {number} account
 * @return {boolean}
 */
Bank.prototype.isValidAccount = function (account) {
    return account >= 1 && account <= this.balance.length;
};

// 示例测试
const bank = new Bank([10, 100, 20, 50, 30]);
console.log(bank.withdraw(3, 10)); // 输出: true
console.log(bank.transfer(5, 1, 20)); // 输出: true
console.log(bank.deposit(5, 20)); // 输出: true
console.log(bank.transfer(3, 4, 15)); // 输出: false
console.log(bank.withdraw(10, 50)); // 输出: false

// TODO: 0107   3412

/**
 * @param {string} s
 * @return {number}
 */
var calculateScore = function (s) {
    const mirror = {};
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const n = alphabet.length;

    // 创建镜像哈希表
    for (let i = 0; i < n; i++) {
        mirror[alphabet[i]] = alphabet[n - 1 - i];
    }

    const lastSeen = {};
    const marked = Array(s.length).fill(false);
    let score = 0;

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        const mirrorChar = mirror[char];

        if (
            lastSeen[mirrorChar] !== undefined &&
            !marked[lastSeen[mirrorChar]]
        ) {
            const j = lastSeen[mirrorChar];
            score += i - j;
            marked[i] = true;
            marked[j] = true;
        }

        lastSeen[char] = i;
    }

    return score;
};

// 示例测试
console.log(calculateScore("aczzx")); // 输出: 5
console.log(calculateScore("abcdef")); // 输出: 0

// TODO: 0108   3408 ***

class TaskManager {
    constructor(tasks) {
        this.tasks = new Map();
        this.priorityQueue = new MaxPriorityQueue({
            priority: (task) => task.priority,
        });

        for (const [userId, taskId, priority] of tasks) {
            this.add(userId, taskId, priority);
        }
    }

    /**
     * @param {number} userId
     * @param {number} taskId
     * @param {number} priority
     * @return {void}
     */
    add(userId, taskId, priority) {
        const task = { userId, taskId, priority };
        this.tasks.set(taskId, task);
        this.priorityQueue.enqueue(task);
    }

    /**
     * @param {number} taskId
     * @param {number} newPriority
     * @return {void}
     */
    edit(taskId, newPriority) {
        if (this.tasks.has(taskId)) {
            const task = this.tasks.get(taskId);
            task.priority = newPriority;
            this.priorityQueue.enqueue(task);
        }
    }

    /**
     * @param {number} taskId
     * @return {void}
     */
    rmv(taskId) {
        if (this.tasks.has(taskId)) {
            this.tasks.delete(taskId);
        }
    }

    /**
     * @return {number}
     */
    execTop() {
        while (!this.priorityQueue.isEmpty()) {
            const task = this.priorityQueue.dequeue().element;
            if (
                this.tasks.has(task.taskId) &&
                this.tasks.get(task.taskId).priority === task.priority
            ) {
                this.tasks.delete(task.taskId);
                return task.userId;
            }
        }
        return -1;
    }
}

// 示例测试
const taskManager = new TaskManager([
    [1, 101, 10],
    [2, 102, 20],
    [3, 103, 15],
]);
taskManager.add(4, 104, 5);
taskManager.edit(102, 8);
console.log(taskManager.execTop()); // 输出: 3
taskManager.rmv(101);
taskManager.add(5, 105, 15);
console.log(taskManager.execTop()); // 输出: 5

// TODO: 0109   3297

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var validSubstringCount = function (word1, word2) {
    const word2Length = word2.length;
    const word1Length = word1.length;
    const word2Freq = new Array(26).fill(0);
    const windowFreq = new Array(26).fill(0);
    let count = 0;

    // 计算 word2 中每个字符的频率
    for (const char of word2) {
        word2Freq[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // 使用滑动窗口遍历 word1 中所有长度为 word2.length 的子字符串
    for (let i = 0; i < word1Length; i++) {
        // 添加当前字符到窗口频率
        windowFreq[word1[i].charCodeAt(0) - "a".charCodeAt(0)]++;

        // 移除窗口左边界之外的字符
        if (i >= word2Length) {
            windowFreq[
                word1[i - word2Length].charCodeAt(0) - "a".charCodeAt(0)
            ]--;
        }

        // 检查窗口中的字符频率是否可以重新排列成 word2 的前缀
        if (i >= word2Length - 1 && isValidPrefix(windowFreq, word2Freq)) {
            count++;
        }
    }

    return count;
};

// 辅助函数，检查窗口中的字符频率是否可以重新排列成 word2 的前缀
function isValidPrefix(windowFreq, word2Freq) {
    for (let i = 0; i < 26; i++) {
        if (windowFreq[i] < word2Freq[i]) {
            return false;
        }
    }
    return true;
}

// 示例测试
console.log(validSubstringCount("bcca", "abc")); // 输出: 1
console.log(validSubstringCount("abcabc", "abc")); // 输出: 10
console.log(validSubstringCount("abcabc", "aaabc")); // 输出: 0

// TODO: 0110   3413

/**
 * @param {number[][]} coins
 * @param {number} k
 * @return {number}
 */
var maximumCoins = function (coins, k) {
    // 将所有区间按起始位置排序
    coins.sort((a, b) => a[0] - b[0]);

    let maxCoins = 0;
    let currentCoins = 0;
    let windowStart = 0;
    const parnoktils = [];

    // 遍历所有区间
    for (const [li, ri, ci] of coins) {
        parnoktils.push([li, ri, ci]);
    }

    // 使用滑动窗口计算每个可能的长度为 k 的连续区间的硬币数量
    for (let i = 0; i < parnoktils.length; i++) {
        const [li, ri, ci] = parnoktils[i];
        currentCoins += ci * (ri - li + 1);

        // 移动窗口的起始位置，确保窗口长度为 k
        while (parnoktils[windowStart][1] < li - k + 1) {
            const [startLi, startRi, startCi] = parnoktils[windowStart];
            currentCoins -= startCi * (startRi - startLi + 1);
            windowStart++;
        }

        // 更新最大硬币数量
        maxCoins = Math.max(maxCoins, currentCoins);
    }

    return maxCoins;
};

// 示例测试
console.log(
    maximumCoins(
        [
            [8, 10, 1],
            [1, 3, 2],
            [5, 6, 4],
        ],
        4,
    ),
); // 输出: 10
console.log(maximumCoins([[1, 10, 3]], 2)); // 输出: 6

// TODO: 0111   3409

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestSubsequence = function (nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (
                Math.abs(nums[i] - nums[j]) >=
                Math.abs(nums[j] - (nums[j - 1] || nums[j]))
            ) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
};

// 示例测试
console.log(longestSubsequence([16, 6, 3])); // 输出: 3
console.log(longestSubsequence([6, 5, 3, 4, 2, 1])); // 输出: 4
console.log(longestSubsequence([10, 20, 10, 19, 10, 20])); // 输出: 5

// TODO: 0112   1671

/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumMountainRemovals = function (nums) {
    const n = nums.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);

    // 计算左侧最长严格递增子序列长度
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                left[i] = Math.max(left[i], left[j] + 1);
            }
        }
    }

    // 计算右侧最长严格递减子序列长度
    for (let i = n - 2; i >= 0; i--) {
        for (let j = n - 1; j > i; j--) {
            if (nums[i] > nums[j]) {
                right[i] = Math.max(right[i], right[j] + 1);
            }
        }
    }

    let maxMountainLength = 0;

    // 计算最长山形子序列长度
    for (let i = 1; i < n - 1; i++) {
        if (left[i] > 1 && right[i] > 1) {
            maxMountainLength = Math.max(
                maxMountainLength,
                left[i] + right[i] - 1,
            );
        }
    }

    return n - maxMountainLength;
};

// 示例测试
console.log(minimumMountainRemovals([1, 3, 1])); // 输出: 0
console.log(minimumMountainRemovals([2, 1, 1, 5, 6, 2, 3, 1])); // 输出: 3

// TODO: 0113   1512

/**
 * @param {number[]} nums
 * @return {number}
 */
var numIdenticalPairs = function (nums) {
    const count = {};
    let goodPairs = 0;

    for (const num of nums) {
        if (count[num]) {
            goodPairs += count[num];
            count[num]++;
        } else {
            count[num] = 1;
        }
    }

    return goodPairs;
};

// 示例测试
console.log(numIdenticalPairs([1, 2, 3, 1, 1, 3])); // 输出: 4
console.log(numIdenticalPairs([1, 1, 1, 1])); // 输出: 6
console.log(numIdenticalPairs([1, 2, 3])); // 输出: 0

// TODO: 0114   3419

/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} threshold
 * @return {number}
 */
var minMaxWeight = function (n, edges, threshold) {
    let left = 1;
    let right = 10 ** 6;
    let result = -1;

    const claridomep = edges;

    const canSatisfy = (maxWeight) => {
        const graph = Array.from({ length: n }, () => []);
        const outDegree = Array(n).fill(0);

        for (const [u, v, w] of claridomep) {
            if (w <= maxWeight) {
                graph[u].push(v);
                outDegree[u]++;
            }
        }

        for (let i = 0; i < n; i++) {
            if (outDegree[i] > threshold) {
                return false;
            }
        }

        const visited = Array(n).fill(false);
        const queue = [0];
        visited[0] = true;
        let count = 1;

        while (queue.length > 0) {
            const node = queue.shift();
            for (const neighbor of graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                    count++;
                }
            }
        }

        return count === n;
    };

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (canSatisfy(mid)) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return result;
};

// 示例测试
console.log(
    minMaxWeight(
        5,
        [
            [1, 0, 1],
            [2, 0, 2],
            [3, 0, 1],
            [4, 3, 1],
            [2, 1, 1],
        ],
        2,
    ),
); // 输出: 1
console.log(
    minMaxWeight(
        5,
        [
            [0, 1, 1],
            [0, 2, 2],
            [0, 3, 1],
            [0, 4, 1],
            [1, 2, 1],
            [1, 4, 1],
        ],
        1,
    ),
); // 输出: -1
console.log(
    minMaxWeight(
        5,
        [
            [1, 2, 1],
            [1, 3, 3],
            [1, 4, 5],
            [2, 3, 2],
            [3, 4, 2],
            [4, 0, 1],
        ],
        1,
    ),
); // 输出: 2
console.log(
    minMaxWeight(
        5,
        [
            [1, 2, 1],
            [1, 3, 3],
            [1, 4, 5],
            [2, 3, 2],
            [4, 0, 1],
        ],
        1,
    ),
); // 输出: -1
