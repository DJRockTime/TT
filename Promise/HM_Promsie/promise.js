// import runAsyncTask from "runAsyncTask";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function runAsyncTask(callback) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback);
  } else if (typeof MutationObserver === "function") {
    const obs = new MutationObserver(callback);
    const divNode = document.createElement("div");
    obs.observe(divNode, { childList: true });
    divNode.innerText = "Async";
  } else {
    setTimeout(callback, 0);
  }
}

class HWPromise {
  state = PENDING;

  result = undefined;

  #handlers = []; // [{ onFulfilled, onRejected}]

  constructor(func) {
    const resolve = (result) => {
      this.state = FULFILLED;
      this.result = result;
      this.#handlers.forEach(({ onFulfilled }) => {
        onFulfilled(this.result);
      });
    };

    const reject = (result) => {
      this.state = REJECTED;
      this.result = result;
      this.#handlers.forEach(({ onRejected }) => {
        onRejected(this.result);
      });
    };

    func(resolve, reject);
  }

  /* 
    THEN
  */
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (x) => x;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (x) => {
            throw x;
          };

    const p2 = new HWPromise((resolve, reject) => {
      //函数封装
      function callback(type) {
        try {
          const x = type(this.result);
          if (x === p2) {
            throw new TypeError(
              "Chaining cycle detected for promise #<Promise>",
            );
          }

          if (x instanceof HWPromise) {
            x.then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              },
            );
          }
          resolve(x);
        } catch (error) {
          reject(error);
        }
      }

      if (this.state === FULFILLED) {
        runAsyncTask(() => {
          callback(onFulfilled);
        });
      } else if (this.state === REJECTED) {
        runAsyncTask(() => {
          callback(onRejected);
          // onRejected(this.result);
        });
      } else if (this.state === PENDING) {
        this.#handlers.push({
          onFulfilled: () => {
            runAsyncTask(() => {
              callback(onFulfilled);
            });
          },
          onRejected: () => {
            runAsyncTask(() => {
              callback(onRejected);
            });
          },
        });
      }
    });

    return p2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(onFinally, onFinally);
  }

  static resolve(value) {
    if (value instanceof HWPromise) {
      return value;
    }
    const p = new HWPromise((resolve) => {
      resolve(value);
    });
    return p;
  }

  static reject(value) {
    const p = new HWPromise((undefined, reject) => {
      reject(value);
    });
    return p;
  }

  static race(promises) {
    return new HWPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      promises.forEach((p) => {
        HWPromise.resolve(p).then(
          (res) => {
            resolve(res);
          },
          (err) => reject(err),
        );
      });
    });
  }

  static all(promises) {
    return new HWPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      promises.length === 0 && resolve(promises);

      const result = [];
      let count = 0;
      promises.forEach((p, i) => {
        HWPromise.resolve(p).then(
          (res) => {
            result[i] = res;
            count++;
            count == promises.length && resolve(result);
          },
          (err) => reject(err),
        );
      });
    });
  }

  static allSettled(promises) {
    return new HWPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Arguments is not iterable"));
      }

      // 空数组处理
      promises.length === 0 && resolve(promises);

      // 非空数组处理
      const result = [];
      let count = 0;
      promises.forEach((p, i) => {
        HWPromise.resolve(p).then(
          (res) => {
            result[i] = {
              status: FULFILLED,
              value: res,
            };
            count++;
            count === promises.length && resolve(result);
          },
          (err) => {
            result[i] = {
              status: REJECTED,
              reason: err,
            };
            count++;
            count === promises.length && resolve(result);
          },
        );
      });
    });
  }

  static any(promises) {
    return new HWPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Arguments is not iterable"));
      }

      // 空数组处理
      promises.length === 0 &&
        reject(new AggregateError(promises, "All promises where rejected"));

      // 非空数组处理
      const errors = [];
      let count = 0;
      promises.forEach((p, i) => {
        HWPromise.resolve(p).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            errors[i] = err;
            count++;
            count === promises.length &&
              reject(new AggregateError(errors, "All promises where rejected"));
          },
        );
      });
    });
  }
}
