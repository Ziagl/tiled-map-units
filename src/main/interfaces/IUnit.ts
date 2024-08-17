import { CubeCoordinates } from 'honeycomb-grid';
import { UnitType } from '../enums/UnitType';

export interface IUnit {
  // base
  unitId: number; // id = index in unit store
  unitPlayer: number; // id of player this unit belongs to
  unitType: UnitType; // the type of this unit (value of an enum?)
  unitHealth: number; // current health points
  unitMaxHealth: number; // maximum health points
  unitMovement: number; // current movement points
  unitMaxMovement: number; // maximum movement points (affects movement range)
  // position
  unitPosition: CubeCoordinates; // its position on the map
  unitLayer: number; // index of layer this unit is on
  // stats
  unitAttack: number; // attack points (damage in fight)
  unitDefense: number; // defence points (how much damage is reduced)
  unitRange: number; // attack range (how far can this unit attack)
  // flags
  unitCanAttack: boolean; // can this unit attack?
  // economy
  unitProductionCost: number; // amount of production needed to build this unit
  unitPurchaseCost: number; // amount of gold needed to purchase this unit
}
