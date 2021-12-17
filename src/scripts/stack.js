export default class Stack {
    itemArr = []
    top = 0
    maxSize = 5

    constructor(maxSize = 0) {
        if (maxSize !== 0) {
            this.maxSize = maxSize
        }
    }

    push(el) {
        if (this.itemArr.length === this.maxSize) {
            this.itemArr.shift()
            this.top = this.maxSize - 1
        }
        return this.itemArr[this.top++] = el;
    }

    pop() {
        if (this.itemArr.length === 0) return false
        return this.itemArr.splice(--this.top, 1)[0]
    }

    peek() {
        return this.itemArr[this.top - 1];
    }

    size() {
        return this.itemArr.length;
    }

    clear() {
        this.top = 0;
        this.itemArr = [];
        return this.itemArr;
    }
}