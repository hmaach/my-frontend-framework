export const ARRAY_DIFF_OP = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop",
};

class ArrayWithOriginalIndices {
  #array = [];
  #originalIndices = [];
  #equalsFn;
  constructor(array, equalsFn) {
    this.#array = [...array];
    this.#originalIndices = array.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  isRemoval(index, newArray) {
    if (index >= this.length) {
      return false;
    }
    const item = this.#array[index];
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.#equalsFn(item, newItem)
    );
    return indexInNewArray === -1;
  }

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    };
    this.#array.splice(index, 1);
    this.#originalIndices.splice(index, 1);
    return operation;
  }

  isNoop(index, newArray) {
    if (index >= this.length) {
      return false;
    }
    const item = this.#array[index];
    const newItem = newArray[index];
    return this.#equalsFn(item, newItem);
  }

  originalIndexAt(index) {
    return this.#originalIndices[index];
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index],
    };
  }

  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1;
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i;
      }
    }
    return -1;
  }

  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    };
    this.#array.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1);
    return operation;
  }

  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex);
    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    };
    const [_item] = this.#array.splice(fromIndex, 1);
    this.#array.splice(toIndex, 0, _item);
    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndex);
    return operation;
  }

  removeItemsAfter(index) {
    const operations = [];
    while (this.length > index) {
      operations.push(this.removeItem(index));
    }
    return operations;
  }
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b
) {
  const sequence = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);
  for (let index = 0; index < newArray.length; index++) {
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index));
      index--;
      continue;
    }
    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index));
      continue;
    }
    const item = newArray[index];
    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index));
      continue;
    }
    sequence.push(array.moveItem(item, index));
  }
  sequence.push(...array.removeItemsAfter(newArray.length));
  return sequence;
}

export function cleanArray(arr) {
  return arr.filter((elem) => elem != null);
}

export function arraysDiff(oldArray, newArray) {
  const oldsCount = makeCountMap(oldArray);
  const newsCount = makeCountMap(newArray);
  const diff = mapsDiff(oldsCount, newsCount);

  const added = diff.added.flatMap((key) =>
    Array(newsCount.get(key)).fill(key)
  );

  const removed = diff.removed.flatMap((key) =>
    Array(oldsCount.get(key)).fill(key)
  );

  for (const key of diff.updated) {
    const oldCount = oldsCount.get(key);
    const newCount = newsCount.get(key);
    const delta = newCount - oldCount;

    if (delta > 0) {
      added.push(...Array(delta).fill(key));
    } else {
      removed.push(...Array(-delta).fill(key));
    }
  }

  return {
    added,
    removed,
  };
}

export function makeCountMap(array) {
  const map = new Map();

  for (const item of array) {
    map.set(item, (map.get(item) || 0) + 1);
  }

  return map;
}

export function mapsDiff(oldMap, newMap) {
  const oldKeys = Array.from(oldMap.keys());
  const newKeys = Array.from(newMap.keys());

  return {
    added: newKeys.filter((key) => !oldMap.has(key)),
    removed: oldKeys.filter((key) => !newMap.has(key)),
    updated: newKeys.filter(
      (key) => oldMap.has(key) && oldMap.get(key) !== newMap.get(key)
    ),
  };
}
