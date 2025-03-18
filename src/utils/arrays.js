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
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b
) {
  const sequence = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);
  for (let index = 0; index < newArray.length; index++) {
    // TODO: removal case
    // TODO: noop case
    // TODO: addition case
    // TODO: move case
  }
  // TODO: remove extra items
  return sequence;
}

export function cleanArray(arr) {
  return arr.filter((elem) => elem != null);
}

export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
  };
}
