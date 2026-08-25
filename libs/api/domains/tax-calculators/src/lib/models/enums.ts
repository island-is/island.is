import { registerEnumType } from '@nestjs/graphql'

export enum TaxCalculatorType {
  WITHHOLDING_TAX_ON_WAGES = 'withholdingTaxOnWages',
  CHILD_BENEFIT = 'childBenefit',
  VEHICLE_TAX = 'vehicleTax',
  VEHICLE_BENEFIT = 'vehicleBenefit',
  VEHICLE_DEPRECIATION = 'vehicleDepreciation',
  INTEREST_BENEFIT = 'interestBenefit',
}

registerEnumType(TaxCalculatorType, {
  name: 'TaxCalculatorType',
  description: 'The tax calculator to use.',
})

export enum TaxCalculatorFieldKind {
  NUMBER = 'number',
  SELECT = 'select',
  BOOLEAN = 'boolean',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
}

registerEnumType(TaxCalculatorFieldKind, {
  name: 'TaxCalculatorFieldKind',
  description:
    'The kind of input control the web client should render for a calculator field.',
})
