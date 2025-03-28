import { DOM_TYPES } from "./dom.js";

export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const {
      tag: tagOne,
      props: { key: keyOne },
    } = nodeOne;
    const {
      tag: tagTwo,
      props: { key: keyTwo },
    } = nodeTwo;
    return tagOne === tagTwo && keyOne === keyTwo;
  }

  if (nodeOne.type === DOM_TYPES.COMPONENT) {
    const {
      tag: componentOne,
      props: { key: keyOne },
    } = nodeOne;
    const {
      tag: componentTwo,
      props: { key: keyTwo },
    } = nodeTwo;
    return componentOne === componentTwo && keyOne === keyTwo;
  }
  return true;
}
