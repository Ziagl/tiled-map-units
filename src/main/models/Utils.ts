import { CubeCoordinates, hexToOffset } from 'honeycomb-grid';

export class Utils {
  // converts a 1d array of numbers to a 2d array of numbers
  public static convertTo2DArray(map: number[], rows: number, cols: number): number[][] {
    const twoDArray: number[][] = [];
    for (let i = 0; i < rows; i++) {
      twoDArray[i] = map.slice(i * cols, (i + 1) * cols);
    }
    return twoDArray;
  }

  // gets the stored value from unit map of given layer
  public static getUnitIdOnPosition(coordinates: CubeCoordinates, map: number[][], hexDefinition: any): number {
    const hex = new hexDefinition([coordinates.q, coordinates.r]);
    const offset = hexToOffset(hex);
    // @ts-ignore
    return map[offset.row][offset.col] ?? 0;
  }

  // sets the storage value of unit map of given layer
  public static setUnitIdOnPosition(coordinates: CubeCoordinates, map: number[][], hexDefinition: any, id: number) {
    const hex = new hexDefinition([coordinates.q, coordinates.r]);
    const offset = hexToOffset(hex);
    // @ts-ignore
    map[offset.row][offset.col] = id;
  }
}
