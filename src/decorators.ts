/**
 * Decorator used to set minimum numbers of balls in a row needed to be destroyed
 * 
 * @param {number} min Minumum numbers of balls
 * @returns {ClassDecorator}
 */
export function minBallsInARow(min: number): ClassDecorator {
    return function (constructor: Function) {
        const original = constructor;

        const construct = (constructor: Function, args: any[]) => {
            const c: any = function (this: any) {
                let result = constructor.apply(this, args);
                this.minBallsInARow = min;
                return result;
            }

            c.prototype = constructor.prototype;
            return new c();
        }

        const newConstructor: any = function (...args: any[]) {
            return construct(original, args);
        }

        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}