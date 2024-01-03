export enum Actions {
  CREATE_OWNER = 'createOwner',
  SEND_APPLICATION = 'sendApplication',
  getVehicles = 'getVehicles',
}

export enum AnswerValidationConstants {
  VEHICLES = 'vehicles',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  APPROVED = 'approved',
}

// Got these codes from Samgöngustofa
export enum FuelCodes {
  // NON_ENGINE ='0',
  // PETROL = '1',
  // DISEL = '2,'
  ELECTRICITY = '3',
  HYDROGEN = '5',
  PETROL_PLUGIN = 'D',
  DISEL_PLUGIN = 'E',
  HYDROGEN_ELECTRICITY = 'F',
  HYDROGEN_PLUGIN = 'G',
}
