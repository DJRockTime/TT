export default function runAsyncTask(callback) {
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


