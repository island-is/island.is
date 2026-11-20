import type {
  DifferenceOutcome,
  KilometerFee,
} from '@island.is/clients/rsk/kilometer-fee'

import { MileageFeeDifferenceOutcome } from '../models/v3/enums'
import { MileageFee } from '../models/v3/mileageFee.model'

const differenceOutcomeMap: Record<
  DifferenceOutcome,
  MileageFeeDifferenceOutcome
> = {
  Refunded: MileageFeeDifferenceOutcome.REFUNDED,
  Billed: MileageFeeDifferenceOutcome.BILLED,
  Reversed: MileageFeeDifferenceOutcome.REVERSED,
}

const FIRST_FEE_YEAR = 2024

const getYears = (firstRegistrationYear: number): number[] => {
  const currentYear = new Date().getFullYear()
  const firstYear = Math.max(firstRegistrationYear, FIRST_FEE_YEAR)
  const years: number[] = []
  for (let year = currentYear; year >= firstYear; year--) {
    years.push(year)
  }
  return years
}

export const mapMileageFee = (
  fee: KilometerFee,
  year: number,
  downloadServiceBaseUrl: string,
): MileageFee => ({
  years: getYears(fee.firstRegistration.year),
  periods: fee.periods.map((period) => ({
    year: period.year,
    month: period.month,
    estimatedFee: period.provisionalPayment,
    confirmedFee: period.settlementPayment ?? undefined,
    difference: period.difference ?? undefined,
    differenceOutcome: period.differenceOutcome
      ? differenceOutcomeMap[period.differenceOutcome]
      : undefined,
  })),
  estimatedFeeTotal: fee.provisionalPaymentTotal,
  confirmedFeeTotal: fee.settlementPaymentTotal,
  reversalThreshold: fee.reversalThreshold,
  downloadServiceUrl: `${downloadServiceBaseUrl}/download/v1/vehicles/mileage-fee/${encodeURIComponent(
    fee.permno,
  )}/${year}/excel`,
})
