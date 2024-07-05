export class Utils {
    // converts a 1d array of numbers to a 2d array of numbers
    public static convertTo2DArray(map: number[], rows: number, cols: number): number[][] {
        const twoDArray: number[][] = [];
        for (let i = 0; i < rows; i++) {
            twoDArray[i] = map.slice(i * cols, (i + 1) * cols);
        }
        return twoDArray;
    }
}