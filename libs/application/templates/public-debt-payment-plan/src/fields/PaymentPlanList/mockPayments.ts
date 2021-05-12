import { useState } from 'react'
import { useEffectOnce } from 'react-use'

export type Payment = {
  id: string
  ssn: string
  type: 'S' | 'O' | 'N' | 'M'
  paymentSchedule: string
  organization: string
  totalAmount: number
}

export const mockPayments: Payment[] = [
  {
    id: '123',
    ssn: '0123456789',
    type: 'S',
    paymentSchedule: 'Sektir og sakarkostnaður',
    organization: 'Skatturinn',
    totalAmount: 50000,
  },
  {
    id: '321',
    ssn: '9876542310',
    type: 'O',
    paymentSchedule: 'Ofgreiddar bætur',
    organization: 'Skatturinn',
    totalAmount: 30000,
  },
  {
    id: '222',
    ssn: '6549873210',
    type: 'N',
    paymentSchedule: 'Launaafdráttur',
    organization: 'Sýslumaðurinn á Norðurlandi vestra',
    totalAmount: 100000,
  },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useMockPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const loading = payments.length === 0

  const mockFetchPayments = async () => {
    await sleep(500)
    setPayments(mockPayments)
  }

  useEffectOnce(() => {
    mockFetchPayments()
  })

  return {
    payments,
    loading,
  }
}
