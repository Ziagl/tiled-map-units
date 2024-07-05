import { Utils } from "./models/Utils";

export class UnitManager
{
    private _map:number[][][] = []; // 2D array with different layers (3rd dimension)
    private _map_layers:number = 0;
    private _map_columns:number = 0;
    //private _map_rows:number = 0;

    constructor(map:number[], layers:number, rows:number, columns:number) {
        // create maps for each possible layer (sea, land,air)
        const layerSize = rows * columns;
        for(let i = 0; i < layers; ++i) {
            const layer = Utils.convertTo2DArray(map.slice(i * layerSize, (i + 1) * layerSize), rows, columns);
            this._map.push(layer);
        }
        this._map_layers = layers;
        this._map_columns = columns;
        //this._map_rows = rows;
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