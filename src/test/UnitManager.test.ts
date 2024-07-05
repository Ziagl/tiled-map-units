import { UnitManager } from "../main";

test('initialize', () => {
    const exampleSeaMap:number [] = Array(16).fill(0);
    const exampleLandMap:number [] = Array(16).fill(1);  
    const exampleAirMap:number [] = Array(16).fill(2);
    const unitManager = new UnitManager([...exampleSeaMap, ...exampleLandMap, ...exampleAirMap], 3, 4, 4);
    const output = unitManager.print();
    expect(output).toContain('Layer 1');
    expect(output).toContain('Layer 2');
    expect(output).toContain('Layer 3');
});
test('markNonPassableFields', () => {
    const exampleSeaMap:number [] = Array(16).fill(0);
    const exampleLandMap:number [] = Array(16).fill(1);  
    const exampleAirMap:number [] = Array(16).fill(2);
    const unitManager = new UnitManager([...exampleSeaMap, ...exampleLandMap, ...exampleAirMap], 3, 4, 4);
    const success = unitManager.markNonPassableFields([0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], 0);
    expect(success).toBe(true);
    const output = unitManager.print();
    expect(output).toContain('0 -1 -1 0');
});