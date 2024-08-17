import { IUnit } from "../interfaces/IUnit";

const fs = require('fs');

export class UnitFactory {
    private unitDefinitions:IUnit[] = [];

    constructor(configFilePath: string) {
        this.initialize(configFilePath);
    }

    private async initialize(configFilePath: string) {
        this.unitDefinitions = await this.loadJsonFile(configFilePath) as IUnit[];
    }

    public createUnit(unit: IUnit) {
        const unitDefinition = this.unitDefinitions.find(unitDefinition => unitDefinition.unitType === unit.unitType);
        if(unitDefinition != undefined) {
            unit.unitMaxMovement = unitDefinition.unitMaxMovement;
            unit.unitAttack = unitDefinition.unitAttack;
            unit.unitDefense = unitDefinition.unitDefense;
            unit.unitRange = unitDefinition.unitRange;
            unit.unitCanAttack = unitDefinition.unitCanAttack;
            unit.unitProductionCost = unitDefinition.unitProductionCost;
            unit.unitPurchaseCost = unitDefinition.unitPurchaseCost;
        }
    }

    private async loadJsonFile(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err: any, data: string) => {
                if (err) {
                    console.log("error: " + err);
                    reject([]);
                } else {
                    try {
                        const jsonData = JSON.parse(data) as IUnit[];
                        console.log("found data " + data);
                        resolve(jsonData);
                    } catch (parseErr) {
                        console.log("parse error: "+parseErr);
                        reject([]);
                    }
                }
            });
        });
    }
}