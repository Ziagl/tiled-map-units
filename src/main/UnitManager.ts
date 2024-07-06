import { HexOffset, Orientation, defineHex } from "honeycomb-grid";
import { IUnit } from "./interfaces/IUnit";
import { Utils } from "./models/Utils";

export class UnitManager
{
    private _unitStore: Map<number, IUnit>;
    private _lastUnitStoreId: number = 0;
    private _map:number[][][] = []; // 2D array with different layers (3rd dimension)
    private _map_layers:number = 0;
    private _map_columns:number = 0;
    private _map_rows:number = 0;
    private _hexDefinition;

    constructor(map:number[], layers:number, rows:number, columns:number) {
        // create maps for each possible layer (sea, land,air)
        const layerSize = rows * columns;
        for(let i = 0; i < layers; ++i) {
            const layer = Utils.convertTo2DArray(map.slice(i * layerSize, (i + 1) * layerSize), rows, columns);
            this._map.push(layer);
        }
        this._map_layers = layers;
        this._map_columns = columns;
        this._map_rows = rows;

        // initilize definition to convert offset -> cube coordinates
        const hexSetting = {offset: -1 as HexOffset, orientation: Orientation.POINTY};
        this._hexDefinition = defineHex(hexSetting);

        // initialize unit store
        this._unitStore = new Map<number, IUnit>();
    }

    // pass an array to mask all not passable fields (value > 0 == unpassable field)
    public markNonPassableFields(map:number[], layer:number):boolean {
        // early exit if data is not correct
        if(layer < 0 || layer >= this._map_layers || map.length !== this._map_rows * this._map_columns) {
            return false;
        }
        const map2d = Utils.convertTo2DArray(map, this._map_rows, this._map_columns);
        //  modify map
        for(let i = 0; i < this._map_rows; ++i) {
            for(let j = 0; j < this._map_columns; ++j) {
                // @ts-ignore
                if(map2d[i][j] !== 0) {
                    // @ts-ignore
                    this._map[layer][i][j] = -1;
                }
            }
        }
        return true;
    }

    // creates a new unit at given layer, returns false if not possible
    public createUnit(unit:IUnit, layer:number):boolean {
        // early exit if layer is not valid
        if(layer < 0 || layer >= this._map_layers) {
            return false;
        }
        // early exit if layer position is already occupied
        let index = Utils.getUnitOnPosition(unit.unitPosition, this._map[layer]!, this._hexDefinition);
        if(index !== 0) {
            return false;
        }
        // add unit to store
        this._lastUnitStoreId = this._lastUnitStoreId + 1;
        unit.unitId = this._lastUnitStoreId;
        this._unitStore.set(unit.unitId, unit);
        Utils.setUnitOnPosition(unit.unitPosition, this._map[layer]!, this._hexDefinition, unit.unitId);
        return true;
    }

    // returns unit by id or undefined if not found
    public getUnitById(unitId:number):IUnit|undefined {
        return this._unitStore.get(unitId);
    }

    // returns all units of given player number
    public getUnitsOfPlayer(playerId:number):IUnit[] {
        let units:IUnit[] = [];
        this._unitStore.forEach(unit => {
            if(unit.unitPlayer === playerId) {
                units.push(unit);
            }
        });
        return units;
    }

    // print generated map structured (one row as one line)
    public print() :string {
        let response: string = "";
        for(let l = 0; l < this._map_layers; ++l) {
            response += 'Layer ' + (l + 1) + '\n';
            for (let i=0; i < this._map_columns; ++i) {
                // @ts-ignore
                const row = this._map[l][i];
                // @ts-ignore
                response += (row.join(' '));
                if(l < this._map_layers - 1 || i < this._map_columns - 1) {
                    response += '\n';
                }
            }
        }
        return response;
    }
}