import { UnitManager } from "../main";

const exampleUnit = {
    coordinate: {q: 0, r: 0, s: 0},
    type: 1,
    player: 1,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 10,
    movement: 10,
    range: 1,
    canAttack: true,
    canMove: true
}

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
<<<<<<< HEAD
});
test('createUnit', () => {
    const exampleSeaMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleSeaMap], 1, 4, 4);
    const success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    const output = unitManager.print();
    expect(output).toContain('1 0 0 0');
});
test('createUnitWrongLayer', () => {
    const exampleMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    const success = unitManager.createUnit(exampleUnit, 1);
    expect(success).toBe(false);
});
test('createUnitPositionOccupied', () => {
    let exampleMap:number [] = Array(16).fill(0);
    exampleMap[0] = 1;
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    const success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(false);
=======
>>>>>>> c2060537281e6d51fcb9ece53a11f4f515dd6a69
});