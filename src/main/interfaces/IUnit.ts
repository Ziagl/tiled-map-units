import { CubeCoordinates } from "honeycomb-grid";

export interface IUnit {
    coordinate: CubeCoordinates;
    player: number;
    type: number;
    movement: number;
    attack: number;
    defense: number;
    health: number;
    maxHealth: number;
    range: number;
    canAttack: boolean;
    canMove: boolean;
}