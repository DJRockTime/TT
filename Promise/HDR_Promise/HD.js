// import { information } from "./A.js";
// console.log(information);

class HD {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.status = HD.PENDING;
    this.value = null;
    this.callbacks = [];

    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (value) => {
    this.status = HD.FULFILLED;
    this.value = value;

    setTimeout(() => {
      this.callbacks.map((callback) => {
        callback.onFulfilled(value);
      });
    });
  };

  reject = (reason) => {
    this.status = HD.REJECTED;
    this.value = reason;
    setTimeout(() => {
      this.callbacks.map((callback) => {
        callback.onRejected(reason);
      });
    });
  };

  then = (onFulfilled, onRejected) => {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }

    if (typeof onRejected !== "function") {
      onRejected = () => this.value;
    }

    let p = new HD((resolve, reject) => {
      // 成功
      if (this.status === HD.FULFILLED) {
        setTimeout(() => {
          let result = onFulfilled(this.value);
          this.parse(p, result, resolve, reject);
        });
      }

      //   拒绝
      if (this.status === HD.REJECTED) {
        setTimeout(() => {
          let result = onRejected(this.value);
          this.parse(p, result, resolve, reject);
        });
      }

      //   等待
      if (this.status === HD.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            let result = onFulfilled(value);
            this.parse(p, result, resolve, reject);
          },

          onRejected: (value) => {
            let result = onRejected(value);
            this.parse(p, result, resolve, reject);
          },
        });
      }
    });

    return p;
  };

  parse = (p, result, resolve, reject) => {
    if (p === result) {
      throw new TypeError("Chaining cycle detected");
    }
    try {
      if (result instanceof HD) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  };

  static resolve(value) {
    return new HD((resolve, reject) => {
      if (value instanceof HD) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(value) {
    return new HD((resolve, reject) => {
      reject(value);
    });
  }
}
