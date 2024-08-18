import { IUnit } from '../interfaces/IUnit';

export class UnitFactory {
  private unitDefinitions: IUnit[] = [];

  constructor(unitDefinitions: IUnit[]) {
    this.unitDefinitions = unitDefinitions;
  }

  public createUnit(unit: IUnit) {
    const unitDefinition = this.unitDefinitions.find((unitDefinition) => unitDefinition.unitType === unit.unitType);
    if (unitDefinition != undefined) {
      unit.unitMaxMovement = unitDefinition.unitMaxMovement ?? 0;
      unit.unitAttack = unitDefinition.unitAttack ?? 0;
      unit.unitDefense = unitDefinition.unitDefense ?? 0;
      unit.unitRange = unitDefinition.unitRange ?? 0;
      unit.unitCanAttack = unitDefinition.unitCanAttack ?? false;
      unit.unitProductionCost = unitDefinition.unitProductionCost ?? 0;
      unit.unitPurchaseCost = unitDefinition.unitPurchaseCost ?? 0;
    }
  }
}
