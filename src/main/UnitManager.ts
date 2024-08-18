import { CubeCoordinates, HexOffset, Orientation, defineHex } from 'honeycomb-grid';
import { IUnit } from './interfaces/IUnit';
import { Utils } from '@ziagl/tiled-map-utils';
import { TileType } from './enums/TileType';
import { UnitFactory } from './models/UnitFactory';

export class UnitManager {
  private _unitStore: Map<number, IUnit>;
  private _lastUnitStoreId: number = 0;
  private _map: number[][][] = []; // 2D array with different layers (3rd dimension)
  private _map_layers: number = 0;
  private _map_columns: number = 0;
  private _hexDefinition;
  private _factory: UnitFactory;

  constructor(
    map: number[],
    layers: number,
    rows: number,
    columns: number,
    notPassableTiles: number[][],
    unitDefinitions: IUnit[] = [],
  ) {
    // create maps for each possible layer (sea, land, air)
    const layerSize = rows * columns;
    for (let i = 0; i < layers; ++i) {
      let mapArray = new Array<number>();
      map.slice(i * layerSize, (i + 1) * layerSize).forEach((value) => {
        if (notPassableTiles !== undefined && notPassableTiles.length == layers && notPassableTiles[i] !== undefined) {
          if (notPassableTiles[i]?.includes(value)) {
            mapArray.push(TileType.UNPASSABLE);
          } else {
            mapArray.push(TileType.EMPTY);
          }
        } else {
          mapArray.push(TileType.EMPTY);
        }
      });
      const layer = Utils.convertTo2DArray(mapArray, rows, columns);
      this._map.push(layer);
    }
    this._map_layers = layers;
    this._map_columns = columns;

    // initilize definition to convert offset -> cube coordinates
    const hexSetting = { offset: -1 as HexOffset, orientation: Orientation.POINTY };
    this._hexDefinition = defineHex(hexSetting);

    // initialize unit store
    this._unitStore = new Map<number, IUnit>();

    // create factory
    this._factory = new UnitFactory(unitDefinitions);
  }

  /**
   * creates a new unit at given layer, returns false if not possible
   * @param unit unit to create
   * @returns true if unit was created, false if layer is invalid or position is already occupied
   */
  public createUnit(unit: IUnit): boolean {
    // early exit if layer is not valid
    if (unit.unitLayer < 0 || unit.unitLayer >= this._map_layers) {
      return false;
    }
    // early exit if layer position is already occupied
    const unitId = Utils.getUnitIdOnPosition(unit.unitPosition, this._map[unit.unitLayer]!, this._hexDefinition);
    if (unitId != TileType.EMPTY) {
      return false;
    }
    this._factory.createUnit(unit);
    // add unit to store
    this._lastUnitStoreId = this._lastUnitStoreId + 1;
    unit.unitId = this._lastUnitStoreId;
    this._unitStore.set(unit.unitId, unit);
    Utils.setUnitIdOnPosition(unit.unitPosition, this._map[unit.unitLayer]!, this._hexDefinition, unit.unitId);
    return true;
  }

  /**
   * removes unit with given unit id from map
   * @param unitId id of unit
   * @returns true if unit was removed, false if unit was not found
   */
  public removeUnit(unitId: number): boolean {
    const unit = this._unitStore.get(unitId);
    if (unit === undefined) {
      return false;
    }
    this._unitStore.delete(unitId);
    Utils.setUnitIdOnPosition(unit.unitPosition, this._map[unit.unitPosition.s]!, this._hexDefinition, TileType.EMPTY);
    return true;
  }

  /**
   * move unit (must compute path first and is slower as moveUnitByPath)
   * @param unitId id of unit
   * @param destination destination coordinates
   * @returns true if unit was moved, false if unit was not found or destination is not passable
   */
  public moveUnit(unitId: number, destination: CubeCoordinates): boolean {
    const unit = this._unitStore.get(unitId);
    if (unit === undefined) {
      return false;
    }
    // early exit if destination is not passable
    const unitIdOnDestination = Utils.getUnitIdOnPosition(destination, this._map[unit.unitLayer]!, this._hexDefinition);
    if (unitIdOnDestination !== TileType.EMPTY) {
      return false;
    }
    // remove unit from old position
    Utils.setUnitIdOnPosition(unit.unitPosition, this._map[unit.unitLayer]!, this._hexDefinition, TileType.EMPTY);
    // set unit to new position
    Utils.setUnitIdOnPosition(destination, this._map[unit.unitLayer]!, this._hexDefinition, unitId);
    unit.unitPosition = destination;
    return true;
  }

  /**
   * move unit by path
   * @param unitId id of unit
   * @param path path to destination
   * @returns true if unit was moved, false if unit was not found, path is empty, path is too long or start is not given unit
   */
  public moveUnitByPath(unitId: number, path: CubeCoordinates[]): boolean {
    const unit = this._unitStore.get(unitId);
    if (unit === undefined) {
      return false;
    }
    // early exit if  path is empty
    if (path.length === 0) {
      return false;
    }
    // early exit if path is too long for correct movement
    if (path.length - 1 > unit.unitMovement) {
      return false;
    }
    // early exit if start is not given unit
    const unitIdOnStart = Utils.getUnitIdOnPosition(path[0]!, this._map[unit.unitLayer]!, this._hexDefinition);
    if (unitIdOnStart !== unitId) {
      return false;
    }
    // early exit if destination is not passable
    const unitIdOnDestination = Utils.getUnitIdOnPosition(
      path[path.length - 1]!,
      this._map[unit.unitLayer]!,
      this._hexDefinition,
    );
    if (unitIdOnDestination !== TileType.EMPTY) {
      return false;
    }
    // remove unit from old position
    Utils.setUnitIdOnPosition(unit.unitPosition, this._map[unit.unitLayer]!, this._hexDefinition, TileType.EMPTY);
    // set unit to new position
    Utils.setUnitIdOnPosition(path[path.length - 1]!, this._map[unit.unitLayer]!, this._hexDefinition, unitId);
    unit.unitPosition = path[path.length - 1]!;
    unit.unitMovement = unit.unitMovement - (path.length - 1);
    return true;
  }

  /**
   * get unit by id
   * @param unitId id of unit
   * @returns unit if found, undefined if not found
   */
  public getUnitById(unitId: number): IUnit | undefined {
    return this._unitStore.get(unitId);
  }

  /**
   * get all units on this coordinates for given player
   * @param coords coordinates to search for
   * @param playerId player id to search for
   * @returns array of units on this coordinates for given player, if no unit was found, empty array
   */
  public getUnitsByCoordinates(coords: CubeCoordinates, playerId: number): IUnit[] {
    let foundUnits: IUnit[] = [];
    for (let layer = 0; layer < this._map_layers; ++layer) {
      const unitId = Utils.getUnitIdOnPosition(coords, this._map[layer]!, this._hexDefinition);
      if (unitId !== TileType.EMPTY && unitId !== TileType.UNPASSABLE) {
        const unit = this._unitStore.get(unitId);
        if (unit && unit.unitPlayer === playerId) {
          foundUnits.push(unit);
        }
      }
    }
    return foundUnits;
  }

  /**
   * all units of given player number
   * @param playerId player id to search for
   * @returns array of units for given player, if no unit was found, empty array
   */
  public getUnitsOfPlayer(playerId: number): IUnit[] {
    let units: IUnit[] = [];
    this._unitStore.forEach((unit) => {
      if (unit.unitPlayer === playerId) {
        units.push(unit);
      }
    });
    return units;
  }

  /**
   * print generated map structured (one row as one line)
   * @returns string representation of map
   */
  public print(): string {
    let response: string = '';
    for (let l = 0; l < this._map_layers; ++l) {
      response += 'Layer ' + (l + 1) + '\n';
      for (let i = 0; i < this._map_columns; ++i) {
        // @ts-ignore
        const row = this._map[l][i];
        // @ts-ignore
        response += row.join(' ');
        if (l < this._map_layers - 1 || i < this._map_columns - 1) {
          response += '\n';
        }
      }
    }
    return response;
  }
}
