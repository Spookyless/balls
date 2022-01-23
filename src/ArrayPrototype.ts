/**
 * Extends the functionality of standard Array implementation
 */
interface Array<T> {
    /**
     * Returns random element from the Array
     * 
     * @throws Error, if the array is length 0
     */
    random(): T
    /**
     * Returns random N different elements from the Array
     * 
     * @param n Number of elements to return
     * @throws Error, if the array is shorter than n
     */
    randomN(n: number): T[]
}

Array.prototype.random = function () {
    if (this.length === 0) {
        throw new Error("Cannot return item from empty array.");
    }

    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.randomN = function (n: number) {
    if (n > this.length) {
        throw new Error("Cannot return more items than there are in the array.");
    }

    let output: any[] = [];

    while (output.length < n) {
        let random = this.random();

        if (output.includes(random) === false) {
            output.push(random);
        }
    }

    return output;
};