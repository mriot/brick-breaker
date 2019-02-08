export const randNum: any = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}