
/**
* Returns the average of two numbers.
*
* @remarks
* This method is part of the {@link core-library#Statistics | Statistics subsystem}.
*
* @param x - The first input number
* @param y - The second input number
* @returns The arithmetic mean of `x` and `y`
*
* @beta
*/

export function getRandomInt(min:number=1000, max:number=9999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }


/**
* Returns the average of two numbers.
*
* @remarks
* This method is part of the {@link core-library#Statistics | Statistics subsystem}.
*
* @param x - The first input number
* @param y - The second input number
* @returns The arithmetic mean of `x` and `y`
*
* @beta
*/

export const round = (num:number) => Math.round((num + Number.EPSILON) * 100) / 100
