import { childBenefitCalculator } from '../domains/childBenefit'
import { interestBenefitCalculator } from '../domains/interestBenefit'
import { vehicleBenefitCalculator } from '../domains/vehicleBenefit'
import { vehicleDepreciationCalculator } from '../domains/vehicleDepreciation'
import { vehicleTaxCalculator } from '../domains/vehicleTax'
import { withholdingTaxCalculator } from '../domains/withholdingTax'

export const calculatorRegistry = {
  childBenefit: childBenefitCalculator,
  vehicleTax: vehicleTaxCalculator,
  vehicleBenefit: vehicleBenefitCalculator,
  vehicleDepreciation: vehicleDepreciationCalculator,
  withholdingTax: withholdingTaxCalculator,
  interestBenefit: interestBenefitCalculator,
} as const

export type CalculatorKey = keyof typeof calculatorRegistry
