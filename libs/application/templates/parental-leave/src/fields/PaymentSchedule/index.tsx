import React, { FC } from 'react'
import { format } from 'date-fns'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import Table from '../components/Table'

interface Payment {
  date: string
  tax: number
  pensionContribution: number
  amount: number
}

const payments: Payment[] = [
  {
    date: '2020-12-01T00:00:00.000Z',
    pensionContribution: 12400,
    tax: 67000,
    amount: 389000,
  },
  {
    date: '2021-01-01T00:00:00.000Z',
    pensionContribution: 14800,
    tax: 77500,
    amount: 405300,
  },
  {
    date: '2021-02-01T00:00:00.000Z',
    pensionContribution: 14800,
    tax: 77500,
    amount: 405300,
  },
  {
    date: '2021-03-01T00:00:00.000Z',
    pensionContribution: 14800,
    tax: 77500,
    amount: 405300,
  },
  {
    date: '2021-04-01T00:00:00.000Z',
    pensionContribution: 11230,
    tax: 35000,
    amount: 119000,
  },
  {
    date: '2021-05-01T00:00:00.000Z',
    pensionContribution: 11230,
    tax: 35000,
    amount: 119000,
  },
  {
    date: '2021-06-01T00:00:00.000Z',
    pensionContribution: 11230,
    tax: 35000,
    amount: 119000,
  },
  {
    date: '2021-07-01T00:00:00.000Z',
    pensionContribution: 11230,
    tax: 35000,
    amount: 119000,
  },
  {
    date: '2021-08-01T00:00:00.000Z',
    pensionContribution: 11230,
    tax: 35000,
    amount: 119000,
  },
]

/*
 *  Takes in a number (ex: 119000) and
 *  returns a formated ISK value "119.000 kr."
 */
const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

const PaymentSchedule: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()

  const formatedPayments = payments.map((payment) => {
    const paymentDate = new Date(payment.date)
    return {
      year: paymentDate.getFullYear(),
      month: format(paymentDate, 'MMMM'),
      tax: formatIsk(payment.tax),
      pensionContribution: formatIsk(payment.pensionContribution),
      amount: formatIsk(payment.amount),
    }
  })

  const data = React.useMemo(() => [...formatedPayments], [formatedPayments])
  const columns = React.useMemo(
    () => [
      {
        Header: 'Year',
        accessor: 'year', // accessor is the "key" in the data
      } as const,
      {
        Header: 'Month',
        accessor: 'month',
      } as const,
      {
        Header: 'Pension Fund',
        accessor: 'pensionContribution',
      } as const,
      {
        Header: 'Tax',
        accessor: 'tax',
      } as const,
      {
        Header: 'Paid Amount',
        accessor: 'amount',
      } as const,
    ],
    [],
  )

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginY={3}>
        <Table columns={columns} data={data} truncate />
      </Box>
    </Box>
  )
}

export default PaymentSchedule
