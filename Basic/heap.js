function heapSort(arr) {
  let len = arr.length;

  if (!Array.isArray(arr) || length <= 1) return;
  buildMaxHeap(arr);

  for (let i = len - 1; i > 0; i--) {
    swap(arr, 0, i);
    adjustMaxHeap(arr, 0, i);

    return arr;
  }
}

function adjustMaxHeap(arr, index, heapSize) {
  let iMax, iLeft, iRight;

  while (true) {
    iMax = index;
    iLeft = 2 * index + 1;
    iRight = 2 * index + 2;

    if (iLeft < heapSize && array[iMax] < array[iLeft]) {
      iMax = iLeft;
    }
  }
}

function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
