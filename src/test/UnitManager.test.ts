import { UnitManager } from "../main";

const exampleUnit = {
    unitId: 0,
    unitPosition: {q: 0, r: 0, s: 0},
    unitPlayer: 1,
    unitType: 1,
    unitHealth: 100,
    unitMaxHealth: 100,
    unitMovement: 10,
    unitAttack: 10,
    unitDefense: 10,
    unitRange: 1,
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
});
test('createUnit', () => {
    const exampleSeaMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleSeaMap], 1, 4, 4);
    const success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    const output = unitManager.print();
    expect(output).toContain('1 0 0 0');
});
test('createUnitAndSetId', () => {
    const exampleSeaMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleSeaMap], 1, 4, 4);
    let exampleUnitTest = {...exampleUnit};
    const success = unitManager.createUnit(exampleUnitTest, 0);
    expect(success).toBe(true);
    expect(exampleUnitTest.unitId).toBeGreaterThan(0);
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
});
test('createUnitAddTwoUnitsOnSameTile', () => {
    let exampleMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    let success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(false);
});
test('getUnitsOfPlayer', () => {
    let exampleMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    let success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    let exampleUnit2 = {...exampleUnit};
    exampleUnit2.unitPosition = {q: 1, r: 0, s: -1};
    success = unitManager.createUnit(exampleUnit2, 0);
    expect(success).toBe(true);
    let exampleUnit3 = {...exampleUnit};
    exampleUnit3.unitPosition = {q: 1, r: 1, s: -2};
    exampleUnit3.unitPlayer = 2;
    success = unitManager.createUnit(exampleUnit3, 0);
    expect(success).toBe(true);
    const units = unitManager.getUnitsOfPlayer(1);
    expect(units.length).toBe(2);
});
test('deleteUnit', () => {
    let exampleMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    let success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    let units = unitManager.getUnitsOfPlayer(exampleUnit.unitPlayer);
    expect(units.length).toBe(1);
    success = unitManager.removeUnit(exampleUnit.unitId);
    expect(success).toBe(true);
    units = unitManager.getUnitsOfPlayer(exampleUnit.unitPlayer);
    expect(units.length).toBe(0);
});
test('getUnitsByCoordinates', () => {
    let exampleMap:number [] = Array(16).fill(0);
    const unitManager = new UnitManager([...exampleMap], 1, 4, 4);
    let success = unitManager.createUnit(exampleUnit, 0);
    expect(success).toBe(true);
    let otherUnit = exampleUnit;
    otherUnit.unitPosition = {q: 1, r: 1, s: -2};
    success = unitManager.createUnit(otherUnit, 0);
    expect(success).toBe(true);
    let units = unitManager.getUnitsByCoordinates({q: 1, r: 1, s: -2}, 1);
    expect(units.length).toBe(1);
    units = unitManager.getUnitsByCoordinates({q: 1, r: 1, s: -2}, 2);
    expect(units.length).toBe(0);
    units = unitManager.getUnitsByCoordinates({q: 0, r: 0, s: 0}, 1);
    expect(units.length).toBe(0);
});