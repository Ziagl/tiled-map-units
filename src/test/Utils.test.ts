import { HexOffset, Orientation, defineHex } from "honeycomb-grid";
import { Utils } from "../main/models/Utils";

test('getUnitOnPosition', () => {
    const exampleLayer = [[2, 0], [0, 0]];
    const hexDefinition = defineHex({offset: -1 as HexOffset, orientation: Orientation.POINTY});
    let value = Utils.getUnitOnPosition({q: 0, r: 0, s: 0}, exampleLayer, hexDefinition);
    expect(value).toBe(2);
    value = Utils.getUnitOnPosition({q: 1, r: 0, s: 0}, exampleLayer, hexDefinition);
    expect(value).toBe(0);
});
test('setUnitOnPosition', () => {
    const exampleLayer = [[0, 0], [0, 0]];
    const hexDefinition = defineHex({offset: -1 as HexOffset, orientation: Orientation.POINTY});
    const newValue = 3;
    Utils.setUnitOnPosition({q: 0, r: 0, s: 0}, exampleLayer, hexDefinition, newValue);
    expect(exampleLayer[0]?.[0]).toBe(newValue);
});