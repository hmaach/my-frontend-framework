import { DOM_TYPES } from "./dom.js";

export class NodeComparator {
    static areNodesEqual(nodeOne, nodeTwo) {
        if (nodeOne.type !== nodeTwo.type) {
            return false;
        }
        if (nodeOne.type === DOM_TYPES.ELEMENT) {
            const { tag: tagOne } = nodeOne;
            const { tag: tagTwo } = nodeTwo;
            return tagOne === tagTwo;
        }
        return true;
    }
}

export const { areNodesEqual } = NodeComparator;
