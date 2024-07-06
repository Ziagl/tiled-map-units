import { CubeCoordinates } from "honeycomb-grid";

export interface IUnit {
    // base
    unitPosition: CubeCoordinates;  // its position on the map
    unitPlayer: number;             // id of player this unit belongs to
    unitType: number;               // the type of this unit (value of an enum?)
    unitHealth: number;             // current health points
    unitMaxHealth: number;          // maximum health points              
    // stats
    unitMovement: number;           // movement points (affects movement range)
    unitAttack: number;             // attack points (damage in fight)
    unitDefense: number;            // defence points (how much damage is reduced)
    unitRange: number;              // attack range (how far can this unit attack)
    // flags
    canAttack: boolean;             // can this unit attack?
    canMove: boolean;               // can this unit move?
}