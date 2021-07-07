import { useEffect, useState } from 'react'
import { PaymentType } from '../../dataProviders/tempAPITypes'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

const PLAN_AMOUNT = 200000

export type MockPaymentPlan = {
  ssn: string
  type: PaymentType
  schedule: {
    dueDate: string
    payment: string
    remaining: string
    interestRates: string
    totalPayment: string
  }[]
}

const getMockData = (amount?: number, months?: number): MockPaymentPlan => ({
  ssn: '1507922319',
  type: PaymentType.M,
  schedule: amount
    ? [...Array(Math.ceil(PLAN_AMOUNT / amount))].map((_key, index) => {
        const remaining = PLAN_AMOUNT - amount * (index + 1)
        const prevRemaining = PLAN_AMOUNT - amount * index

        return {
          dueDate: `01.${1 + index}.2021`,
          remaining: remaining < 0 ? formatIsk(0) : formatIsk(remaining),
          payment:
            prevRemaining < amount && prevRemaining > 0
              ? formatIsk(prevRemaining)
              : formatIsk(amount),
          interestRates: formatIsk(0),
          totalPayment: formatIsk(9076),
        }
      })
    : months
    ? [...Array(months)].map((_key, index) => ({
        dueDate: `01.${1 + index}.2021`,
        remaining: formatIsk(
          Math.round(PLAN_AMOUNT - (PLAN_AMOUNT / months) * (index + 1)),
        ),
        payment: formatIsk(Math.round(PLAN_AMOUNT / months)),
        interestRates: formatIsk(0),
        totalPayment: formatIsk(9076),
      }))
    : [],
})

export const useMockPaymentPlan = (
  nationalId?: string,
  type?: PaymentType,
  amountPerMonth?: number,
  numberOfMonths?: number,
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<MockPaymentPlan | null>(null)

  const mockFetch = async (amount?: number, months?: number) => {
    setIsLoading(true)
    await sleep(500)
    setData(getMockData(amount, months))
    setIsLoading(false)
  }

  useEffect(() => {
    if (nationalId && type && (amountPerMonth || numberOfMonths))
      mockFetch(amountPerMonth, numberOfMonths)
  }, [nationalId, type, amountPerMonth, numberOfMonths])

  return {
    isLoading,
    data,
  }
}
