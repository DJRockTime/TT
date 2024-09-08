class Promise {
  // 构造方法
  constructor(executor) {
    // Promise状态
    this.PromiseState = "pending";

    // Promise 结果
    this.PromiseResult = null;

    // 声明一个属性
    this.callbacks = [];

    // 保存当前的this
    const self = this;

    // resolve 函数
    function resolve(data) {
      // 判定状态
      if (self.PromiseState !== "pending") return;
      // 修改对象状态 promiseState
      self.PromiseState = "fulfilled";
      // 设置对象的结果值 promiseResult
      self.PromiseResult = data;
      // 执行成功的回调

      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onResolve(data);
        });
      });
    }

    // reject 函数
    function reject(data) {
      // 判定状态
      if (self.PromiseState !== "pending") return;
      // 修改对象状态 promiseState
      self.PromiseState = "rejected";
      // 设置对象的结果值 promiseResult
      self.PromiseResult = data;
      // 执行成功的回调

      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onReject(data);
        });
      });
    }

    // 同步调用，执行器调用函数
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onResolve, onReject) {
    const self = this;

    // 判断回调函数
    if (typeof onReject !== "function") {
      onReject = (reason) => {
        throw reason;
      };
    }

    if (typeof onResolve !== "function") {
      onResolve = (value) => {
        throw value;
      };
    }

    return new Promise((resolve, reject) => {
      function callback(type) {
        try {
          // 获取回调函数的执行结果
          let res = type(self.PromiseResult);
          if (res instanceof Promise) {
            res.then(
              (v) => {
                resolve(v);
              },
              (r) => {
                reject(r);
              },
            );
          } else {
            resolve(res);
          }
        } catch (error) {
          reject(e);
        }
      }

      // 调用回调函数
      if (this.PromiseState === "fulfilled") {
        setTimeout(() => {
          callback(onResolve);
        });
      }

      if (this.PromiseState === "rejected") {
        setTimeout(() => {
          callback(onReject);
        });
      }

      if (this.PromiseState === "pending") {
        // 保存回调函数
        this.callback.push({
          onResolve: function () {
            callback(onResolve);
          },
          onReject: function () {
            callback(onReject);
          },
        });
      }
    });
  }

  catch(onReject) {
    return this.then(undefined, onReject);
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          (v) => resolve(v),
          (r) => reject(r),
        );
      } else {
        resolve(value);
      }
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let arr = [];
      for (var i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            // 每个promise 对象都成功
            count++;

            arr[i] = v;
            if (count === promises.length) {
              // 修改状态
              resolve(arr);
            }
          },
          (r) => {
            reject(r);
          },
        );
      }
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      for (var i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            resolve(v);
          },
          (r) => {
            reject(r);
          },
        );
      }
    });
  }
}

function Promise(executor) {
  // Promise状态
  this.PromiseState = "pending";

  // Promise 结果
  this.PromiseResult = null;

  // 声明一个属性
  this.callbacks = [];

  // 保存当前的this
  const self = this;

  // resolve 函数
  function resolve(data) {
    // 判定状态
    if (self.PromiseState !== "pending") return;
    // 修改对象状态 promiseState
    self.PromiseState = "fulfilled";
    // 设置对象的结果值 promiseResult
    self.PromiseResult = data;
    // 执行成功的回调

    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onResolve(data);
      });
    });
  }

  // reject 函数
  function reject(data) {
    // 判定状态
    if (self.PromiseState !== "pending") return;
    // 修改对象状态 promiseState
    self.PromiseState = "rejected";
    // 设置对象的结果值 promiseResult
    self.PromiseResult = data;
    // 执行成功的回调

    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onReject(data);
      });
    });
  }

  // 同步调用，执行器调用函数
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// 添加then方法
Promise.prototype.then = function (onResolve, onReject) {
  const self = this;

  // 判断回调函数
  if (typeof onReject !== "function") {
    onReject = (reason) => {
      throw reason;
    };
  }

  if (typeof onResolve !== "function") {
    onResolve = (value) => {
      throw value;
    };
  }

  return new Promise((resolve, reject) => {
    function callback(type) {
      try {
        // 获取回调函数的执行结果
        let res = type(self.PromiseResult);
        if (res instanceof Promise) {
          res.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            },
          );
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(e);
      }
    }

    // 调用回调函数
    if (this.PromiseState === "fulfilled") {
      setTimeout(() => {
        callback(onResolve);
      });
    }

    if (this.PromiseState === "rejected") {
      setTimeout(() => {
        callback(onReject);
      });
    }

    if (this.PromiseState === "pending") {
      // 保存回调函数
      this.callback.push({
        onResolve: function () {
          callback(onResolve);
        },
        onReject: function () {
          callback(onReject);
        },
      });
    }
  });
};

// 添加catch方法
Promise.prototype.catch = function (onReject) {
  return this.then(undefined, onReject);
};

// 添加resolve 方法
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(
        (v) => resolve(v),
        (r) => reject(r),
      );
    } else {
      resolve(value);
    }
  });
};

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let arr = [];
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          // 每个promise 对象都成功
          count++;

          arr[i] = v;
          if (count === promises.length) {
            // 修改状态
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        },
      );
    }
  });
};

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        },
      );
    }
  });
};
