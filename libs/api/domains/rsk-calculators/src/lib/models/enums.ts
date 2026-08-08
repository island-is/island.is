import { registerEnumType } from '@nestjs/graphql'

export enum RskCalculatorType {
  WITHHOLDING_TAX_ON_WAGES = 'withholdingTaxOnWages',
  CHILD_BENEFIT = 'childBenefit',
}

registerEnumType(RskCalculatorType, {
  name: 'RskCalculatorType',
  description: 'The RSK (Skatturinn) calculator to use.',
})

export enum RskCalculatorFieldKind {
  NUMBER = 'number',
  SELECT = 'select',
  BOOLEAN = 'boolean',
}

registerEnumType(RskCalculatorFieldKind, {
  name: 'RskCalculatorFieldKind',
  description:
    'The kind of input control the web client should render for a calculator field.',
})
