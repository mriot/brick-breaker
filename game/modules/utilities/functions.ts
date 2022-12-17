export const randNum: any = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const randInt: any = (min: number, max: number) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

export const xorNum: any = (numArr: any) => {
    return numArr[Math.floor(Math.random() * numArr.length)]
}