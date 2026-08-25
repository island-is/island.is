import { registerEnumType } from '@nestjs/graphql'

export enum RskCalculatorType {
  WITHHOLDING_TAX_ON_WAGES = 'withholdingTaxOnWages',
  CHILD_BENEFIT = 'childBenefit',
  VEHICLE_TAX = 'vehicleTax',
  VEHICLE_BENEFIT = 'vehicleBenefit',
}

registerEnumType(RskCalculatorType, {
  name: 'RskCalculatorType',
  description: 'The RSK (Skatturinn) calculator to use.',
})

export enum RskCalculatorFieldKind {
  NUMBER = 'number',
  SELECT = 'select',
  BOOLEAN = 'boolean',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
}

registerEnumType(RskCalculatorFieldKind, {
  name: 'RskCalculatorFieldKind',
  description:
    'The kind of input control the web client should render for a calculator field.',
})
