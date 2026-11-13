import type {
  KilometerFee,
  KilometerFeePeriod,
} from '@island.is/clients/rsk/kilometer-fee'

const FIRST_REGISTRATION = { year: 2024, month: 3 }
const REVERSAL_THRESHOLD = 200
const ESTIMATED_FEE = 4000

const SETTLEMENTS: Array<
  Pick<
    KilometerFeePeriod,
    'settlementPayment' | 'difference' | 'differenceOutcome'
  >
> = [
  {
    settlementPayment: 4600,
    difference: 600,
    differenceOutcome: 'Billed',
  },
  {
    settlementPayment: 3500,
    difference: -500,
    differenceOutcome: 'Refunded',
  },
  {
    settlementPayment: 4050,
    difference: 50,
    differenceOutcome: 'Reversed',
  },
]

export const getMockKilometerFee = (
  permno: string,
  year: number,
): KilometerFee => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const periods: KilometerFeePeriod[] = []

  if (year >= FIRST_REGISTRATION.year && year <= currentYear) {
    const firstMonth = year === 2024 ? 3 : 1
    const lastMonth = year === currentYear ? currentMonth : 12

    for (let month = firstMonth; month <= lastMonth; month++) {
      const index = month - firstMonth
      const isUnsettled = year === currentYear && month === lastMonth
      const settlement = SETTLEMENTS[index % 3]

      periods.push({
        year,
        month,
        provisionalPayment: ESTIMATED_FEE,
        settlementPayment: isUnsettled ? null : settlement.settlementPayment,
        difference: isUnsettled ? null : settlement.difference,
        differenceOutcome: isUnsettled ? null : settlement.differenceOutcome,
        description: null,
      })
    }
  }

  return {
    permno,
    firstRegistration: FIRST_REGISTRATION,
    periods,
    provisionalPaymentTotal: periods.reduce(
      (total, period) => total + period.provisionalPayment,
      0,
    ),
    settlementPaymentTotal: periods.reduce(
      (total, period) => total + (period.settlementPayment ?? 0),
      0,
    ),
    reversalThreshold: REVERSAL_THRESHOLD,
  }
}
