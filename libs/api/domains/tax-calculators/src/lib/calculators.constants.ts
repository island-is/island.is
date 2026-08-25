import { TaxCalculatorType } from './models/enums'
import { CalculatorModule } from './utils/calculatorModule'
import { withholdingTaxCalculator } from './calculators/withholding-tax'
import { childBenefitCalculator } from './calculators/child-benefit'
import { vehicleTaxCalculator } from './calculators/vehicle-tax'
import { vehicleBenefitCalculator } from './calculators/vehicle-benefit'
import { vehicleDepreciationCalculator } from './calculators/vehicle-depreciation'
import { interestBenefitCalculator } from './calculators/interest-benefit'

export const calculatorsByType: Record<TaxCalculatorType, CalculatorModule> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: withholdingTaxCalculator,
  [TaxCalculatorType.CHILD_BENEFIT]: childBenefitCalculator,
  [TaxCalculatorType.VEHICLE_TAX]: vehicleTaxCalculator,
  [TaxCalculatorType.VEHICLE_BENEFIT]: vehicleBenefitCalculator,
  [TaxCalculatorType.VEHICLE_DEPRECIATION]: vehicleDepreciationCalculator,
  [TaxCalculatorType.INTEREST_BENEFIT]: interestBenefitCalculator,
}
