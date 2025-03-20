// DOM Elements
const arrayContainer = document.getElementById("array-container");
const arraySizeInput = document.getElementById("array-size");
const sizeValue = document.getElementById("size-value");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");
const generateArrayBtn = document.getElementById("generate-array");
const algorithmBtns = document.querySelectorAll(".algo-btn");
const stopSortingBtn = document.getElementById("stop-sorting");
const themeToggle = document.getElementById("theme-toggle");
const timeComplexityElement = document.getElementById("time-complexity");
const spaceComplexityElement = document.getElementById("space-complexity");
const comparisonsElement = document.getElementById("comparisons");
const swapsElement = document.getElementById("swaps");
const algorithmInfoElement = document.getElementById("algorithm-info");

// Variables
let array = [];
let arraySize = arraySizeInput.value;
let animationSpeed = 101 - speedInput.value; // Invert so higher value = faster
let isSorting = false;
let stopSorting = false;
let animations = [];
let animationIndex = 0;
let selectedAlgorithm = "";
let comparisons = 0;
let swaps = 0;

// Algorithm Information
const algorithmInfo = {
  bubble: {
    name: "Bubble Sort",
    description:
      "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    timeComplexity: "O(n²)",
    bestCase: "O(n) - When array is already sorted",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    stable: "Yes",
  },
  selection: {
    name: "Selection Sort",
    description:
      "An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist.",
    timeComplexity: "O(n²)",
    bestCase: "O(n²)",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    stable: "No",
  },
  insertion: {
    name: "Insertion Sort",
    description:
      "A simple sorting algorithm that builds the final sorted array one item at a time. It is efficient for small data sets and is often used as part of more sophisticated algorithms.",
    timeComplexity: "O(n²)",
    bestCase: "O(n) - When array is already sorted",
    worstCase: "O(n²)",
    spaceComplexity: "O(1)",
    stable: "Yes",
  },
  merge: {
    name: "Merge Sort",
    description:
      "An efficient, stable, comparison-based, divide and conquer sorting algorithm. It divides the array into equal halves, sorts them recursively, and then merges the sorted halves.",
    timeComplexity: "O(n log n)",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: "Yes",
  },
  quick: {
    name: "Quick Sort",
    description:
      "An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It picks an element as a pivot and partitions the array around the pivot.",
    timeComplexity: "O(n log n)",
    bestCase: "O(n log n)",
    worstCase:
      "O(n²) - When the pivot is consistently the smallest or largest element",
    spaceComplexity: "O(log n)",
    stable: "No",
  },
  heap: {
    name: "Heap Sort",
    description:
      "A comparison-based sorting algorithm that uses a binary heap data structure. It builds a max-heap from the input data and then repeatedly extracts the maximum element.",
    timeComplexity: "O(n log n)",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
    spaceComplexity: "O(1)",
    stable: "No",
  },
};

// Initialize the application
function init() {
  // Check for saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
  }

  // Event listeners
  arraySizeInput.addEventListener("input", handleArraySizeChange);
  speedInput.addEventListener("input", handleSpeedChange);
  generateArrayBtn.addEventListener("click", generateNewArray);
  algorithmBtns.forEach((btn) => {
    btn.addEventListener("click", handleAlgorithmSelect);
  });
  stopSortingBtn.addEventListener("click", handleStopSorting);
  themeToggle.addEventListener("change", handleThemeToggle);

  // Initial array generation
  generateNewArray();
}

// Generate a new random array
function generateNewArray() {
  if (isSorting) return;

  arraySize = arraySizeInput.value;
  resetMetrics();
  array = [];

  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }

  renderArray();
}

// Render the array as bars
function renderArray() {
  arrayContainer.innerHTML = "";

  const maxValue = Math.max(...array);
  const containerHeight = arrayContainer.clientHeight;
  const barWidth = Math.max(2, arrayContainer.clientWidth / arraySize - 2);

  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "array-bar";
    bar.style.height = `${(value / maxValue) * (containerHeight - 10)}px`;
    bar.style.width = `${barWidth}px`;
    arrayContainer.appendChild(bar);
  });
}

// Handle array size change
function handleArraySizeChange() {
  if (isSorting) return;
  arraySize = arraySizeInput.value;
  sizeValue.textContent = arraySize;
  generateNewArray();
}

// Handle speed change
function handleSpeedChange() {
  animationSpeed = 101 - speedInput.value;
  speedValue.textContent = speedInput.value;
}

// Handle algorithm selection
function handleAlgorithmSelect(e) {
  if (isSorting) return;

  selectedAlgorithm = e.target.dataset.algorithm;

  // Update active button
  algorithmBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
  e.target.classList.add("active");

  // Update algorithm info
  updateAlgorithmInfo(selectedAlgorithm);

  // Run the sorting algorithm
  startSorting();
}

// Update algorithm information panel
function updateAlgorithmInfo(algorithm) {
  const info = algorithmInfo[algorithm];

  // Update complexity display
  timeComplexityElement.textContent = info.timeComplexity;
  spaceComplexityElement.textContent = info.spaceComplexity;

  // Update the detailed info panel
  algorithmInfoElement.innerHTML = `
        <p><strong>${info.name}</strong>: ${info.description}</p>
        <ul>
            <li><strong>Average Time Complexity:</strong> ${info.timeComplexity}</li>
            <li><strong>Best Case:</strong> ${info.bestCase}</li>
            <li><strong>Worst Case:</strong> ${info.worstCase}</li>
            <li><strong>Space Complexity:</strong> ${info.spaceComplexity}</li>
            <li><strong>Stable:</strong> ${info.stable}</li>
        </ul>
    `;
}

// Start the sorting process
function startSorting() {
  if (isSorting) return;

  isSorting = true;
  stopSorting = false;
  stopSortingBtn.disabled = false;
  generateArrayBtn.disabled = true;
  arraySizeInput.disabled = true;
  algorithmBtns.forEach((btn) => (btn.disabled = true));

  resetMetrics();
  animations = [];

  // Run the selected algorithm
  switch (selectedAlgorithm) {
    case "bubble":
      bubbleSort();
      break;
    case "selection":
      selectionSort();
      break;
    case "insertion":
      insertionSort();
      break;
    case "merge":
      const auxiliaryArray = [...array];
      mergeSort(0, array.length - 1, auxiliaryArray);
      break;
    case "quick":
      quickSort(0, array.length - 1);
      break;
    case "heap":
      heapSort();
      break;
  }

  // Run the animations
  runAnimations();
}

// Handle stop sorting
function handleStopSorting() {
  stopSorting = true;
  stopSortingBtn.disabled = true;
}

// Handle theme toggle
function handleThemeToggle() {
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
}

// Reset metrics
function resetMetrics() {
  comparisons = 0;
  swaps = 0;
  comparisonsElement.textContent = "0";
  swapsElement.textContent = "0";
}

// Update metrics
function updateMetrics() {
  comparisonsElement.textContent = comparisons;
  swapsElement.textContent = swaps;
}

// Run the animations
function runAnimations() {
  animationIndex = 0;

  function animate() {
    if (stopSorting || animationIndex >= animations.length) {
      finishSorting();
      return;
    }

    const bars = document.querySelectorAll(".array-bar");
    const [type, indices, values] = animations[animationIndex];

    switch (type) {
      case "compare":
        // Set comparing color
        indices.forEach((index) => {
          bars[index].classList.add("comparing");
        });

        // Reset after delay
        setTimeout(() => {
          indices.forEach((index) => {
            bars[index].classList.remove("comparing");
          });
        }, animationSpeed);
        break;

      case "swap":
        // Swap heights
        const [i, j] = indices;
        bars[i].style.height = `${
          (values[0] / Math.max(...array)) * (arrayContainer.clientHeight - 10)
        }px`;
        bars[j].style.height = `${
          (values[1] / Math.max(...array)) * (arrayContainer.clientHeight - 10)
        }px`;

        // Highlight the swapped bars
        bars[i].classList.add("current");
        bars[j].classList.add("current");

        // Reset after delay
        setTimeout(() => {
          bars[i].classList.remove("current");
          bars[j].classList.remove("current");
        }, animationSpeed);
        break;

      case "overwrite":
        // Update a single position
        const [index] = indices;
        const [value] = values;
        bars[index].style.height = `${
          (value / Math.max(...array)) * (arrayContainer.clientHeight - 10)
        }px`;
        bars[index].classList.add("current");

        // Reset after delay
        setTimeout(() => {
          bars[index].classList.remove("current");
        }, animationSpeed);
        break;

      case "pivot":
        // Highlight pivot
        const pivotIndex = indices[0];
        bars[pivotIndex].classList.add("pivot");

        // Reset after delay
        setTimeout(() => {
          bars[pivotIndex].classList.remove("pivot");
        }, animationSpeed);
        break;

      case "sorted":
        // Mark as sorted
        indices.forEach((index) => {
          bars[index].classList.add("sorted");
        });
        break;
    }

    animationIndex++;
    setTimeout(animate, animationSpeed);
  }

  animate();
}

// Finish sorting
function finishSorting() {
  // Mark all bars as sorted
  const bars = document.querySelectorAll(".array-bar");
  bars.forEach((bar) => {
    bar.classList.add("sorted");
  });

  // Reset state
  isSorting = false;
  stopSortingBtn.disabled = true;
  generateArrayBtn.disabled = false;
  arraySizeInput.disabled = false;
  algorithmBtns.forEach((btn) => (btn.disabled = false));
}

// Bubble Sort Algorithm
function bubbleSort() {
  const n = array.length;
  const arrCopy = [...array];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Add comparison animation
      animations.push(["compare", [j, j + 1], []]);
      comparisons++;

      if (arrCopy[j] > arrCopy[j + 1]) {
        // Swap elements
        [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];

        // Add swap animation
        animations.push(["swap", [j, j + 1], [arrCopy[j], arrCopy[j + 1]]]);
        swaps++;
      }
    }

    // Mark as sorted
    animations.push(["sorted", [n - i - 1], []]);
  }

  // Mark the first element as sorted
  animations.push(["sorted", [0], []]);

  // Update the original array
  array = [...arrCopy];
  updateMetrics();
}

// Selection Sort Algorithm
function selectionSort() {
  const n = array.length;
  const arrCopy = [...array];

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      // Add comparison animation
      animations.push(["compare", [minIndex, j], []]);
      comparisons++;

      if (arrCopy[j] < arrCopy[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      // Swap elements
      [arrCopy[i], arrCopy[minIndex]] = [arrCopy[minIndex], arrCopy[i]];

      // Add swap animation
      animations.push(["swap", [i, minIndex], [arrCopy[i], arrCopy[minIndex]]]);
      swaps++;
    }

    // Mark as sorted
    animations.push(["sorted", [i], []]);
  }

  // Mark the last element as sorted
  animations.push(["sorted", [n - 1], []]);

  // Update the original array
  array = [...arrCopy];
  updateMetrics();
}

// Insertion Sort Algorithm
function insertionSort() {
  const n = array.length;
  const arrCopy = [...array];

  for (let i = 1; i < n; i++) {
    const key = arrCopy[i];
    let j = i - 1;

    // Mark current element
    animations.push(["compare", [i], []]);

    while (j >= 0 && arrCopy[j] > key) {
      // Add comparison animation
      animations.push(["compare", [j, j + 1], []]);
      comparisons++;

      // Move elements
      arrCopy[j + 1] = arrCopy[j];

      // Add animation for moving element
      animations.push(["overwrite", [j + 1], [arrCopy[j + 1]]]);
      swaps++;

      j--;
    }

    arrCopy[j + 1] = key;

    // Add animation for inserting key
    animations.push(["overwrite", [j + 1], [key]]);

    // Mark elements as sorted up to current position
    for (let k = 0; k <= i; k++) {
      animations.push(["sorted", [k], []]);
    }
  }

  // Update the original array
  array = [...arrCopy];
  updateMetrics();
}

// Merge Sort Algorithm
function mergeSort(startIdx, endIdx, auxiliaryArray) {
  if (startIdx === endIdx) return;

  const middleIdx = Math.floor((startIdx + endIdx) / 2);

  mergeSort(startIdx, middleIdx, auxiliaryArray);
  mergeSort(middleIdx + 1, endIdx, auxiliaryArray);
  merge(startIdx, middleIdx, endIdx, auxiliaryArray);
}

function merge(startIdx, middleIdx, endIdx, auxiliaryArray) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  const arrCopy = [...array];

  // Merge the two halves
  while (i <= middleIdx && j <= endIdx) {
    // Add comparison animation
    animations.push(["compare", [i, j], []]);
    comparisons++;

    if (arrCopy[i] <= arrCopy[j]) {
      // Add animation for updating value
      animations.push(["overwrite", [k], [arrCopy[i]]]);
      auxiliaryArray[k++] = arrCopy[i++];
    } else {
      // Add animation for updating value
      animations.push(["overwrite", [k], [arrCopy[j]]]);
      auxiliaryArray[k++] = arrCopy[j++];
      swaps++;
    }
  }

  // Copy remaining elements from left subarray
  while (i <= middleIdx) {
    animations.push(["overwrite", [k], [arrCopy[i]]]);
    auxiliaryArray[k++] = arrCopy[i++];
  }

  // Copy remaining elements from right subarray
  while (j <= endIdx) {
    animations.push(["overwrite", [k], [arrCopy[j]]]);
    auxiliaryArray[k++] = arrCopy[j++];
  }

  // Copy back to main array
  for (let i = startIdx; i <= endIdx; i++) {
    array[i] = auxiliaryArray[i];

    // Mark as sorted once all is merged
    if (startIdx === 0 && endIdx === array.length - 1) {
      animations.push(["sorted", [i], []]);
    }
  }

  updateMetrics();
}

// Quick Sort Algorithm
function quickSort(low, high) {
  if (low < high) {
    const pivotIndex = partition(low, high);

    quickSort(low, pivotIndex - 1);
    quickSort(pivotIndex + 1, high);
  } else if (low === high) {
    // Single element is always sorted
    animations.push(["sorted", [low], []]);
  }
}

function partition(low, high) {
  const pivot = array[high];
  let i = low - 1;

  // Mark pivot
  animations.push(["pivot", [high], []]);

  for (let j = low; j < high; j++) {
    // Add comparison animation
    animations.push(["compare", [j, high], []]);
    comparisons++;

    if (array[j] <= pivot) {
      i++;

      // Swap elements
      [array[i], array[j]] = [array[j], array[i]];

      // Only add swap animation if actually swapping different elements
      if (i !== j) {
        // Add swap animation
        animations.push(["swap", [i, j], [array[i], array[j]]]);
        swaps++;
      }
    }
  }

  // Swap pivot to its final position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  // Add swap animation
  animations.push(["swap", [i + 1, high], [array[i + 1], array[high]]]);
  swaps++;

  // Mark pivot as sorted
  animations.push(["sorted", [i + 1], []]);

  updateMetrics();
  return i + 1;
}

// Heap Sort Algorithm
function heapSort() {
  const n = array.length;
  const arrCopy = [...array];

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arrCopy, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root with last element
    [arrCopy[0], arrCopy[i]] = [arrCopy[i], arrCopy[0]];

    // Add swap animation
    animations.push(["swap", [0, i], [arrCopy[0], arrCopy[i]]]);
    swaps++;

    // Mark current position as sorted
    animations.push(["sorted", [i], []]);

    // Heapify root element
    heapify(arrCopy, i, 0);
  }

  // Mark first element as sorted
  animations.push(["sorted", [0], []]);

  // Update the original array
  array = [...arrCopy];
  updateMetrics();
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // If left child is larger than root
  if (left < n) {
    animations.push(["compare", [largest, left], []]);
    comparisons++;

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  // If right child is larger than largest so far
  if (right < n) {
    animations.push(["compare", [largest, right], []]);
    comparisons++;

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    // Swap
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // Add swap animation
    animations.push(["swap", [i, largest], [arr[i], arr[largest]]]);
    swaps++;

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", init);

// Handle window resize
window.addEventListener("resize", renderArray);
