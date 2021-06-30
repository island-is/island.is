import { useEffect, useState } from 'react'
import { PaymentType } from '../../dataProviders/tempAPITypes'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const PLAN_AMOUNT = 200000

export type MockPaymentPlan = {
  ssn: string
  type: PaymentType
  schedule: {
    dueDate: string
    payment: number
    remaining: number
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
          payment:
            prevRemaining < amount && prevRemaining > 0
              ? prevRemaining
              : amount,
          remaining: remaining < 0 ? 0 : remaining,
        }
      })
    : months
    ? [...Array(months)].map((_key, index) => ({
        dueDate: `01.${1 + index}.2021`,
        payment: Math.round(PLAN_AMOUNT / months),
        remaining: Math.round(
          PLAN_AMOUNT - (PLAN_AMOUNT / months) * (index + 1),
        ),
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
