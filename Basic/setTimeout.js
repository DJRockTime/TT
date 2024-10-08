// 思路是使用递归函数，不断地去执行 setTimeout 从而达到 setInterval 的效果

function mySetInterval(fn, timeout) {
    // 控制器，控制定时器是否继续执行
    var timer = {
      flag: true
    };
  
    // 设置递归函数，模拟定时器执行。
    function interval() {
      if (timer.flag) {
        fn();
        setTimeout(interval, timeout);
      }
    }
  
    // 启动定时器
    setTimeout(interval, timeout);
  
    // 返回控制器
    return timer;
  }