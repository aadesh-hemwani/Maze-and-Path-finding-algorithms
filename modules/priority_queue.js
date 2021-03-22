export default class PriorityQueue {
    constructor() {
        this.data = [];
    }
    enqueue(element, priority) {
        if (this.data.length === 0) {
            this.data.push([element, priority]);
        }
        else {
            let added = false;
            let n = this.data.length;
            for (let i = 0; i < n; ++i) {
                if (priority < this.data[i][1]) {
                    this.data.splice(i, 0, [element, priority]);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.data.push([element, priority]);
            }
        }
    }
    dequeue() {
        if (this.data.length !== 0) {
            let pop = this.data.shift();
            return pop[0];
        }

    }
    peek() {
        if (this.data.length !== 0)
            return this.data[0][0];
    }
}