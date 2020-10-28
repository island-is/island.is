import React, { FC } from 'react'
import { format } from 'date-fns'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

import Table from '../components/Table'

interface Payment {
  date: string
  tax: number
  pensionContribution: number
  amount: number
}

// TODO: This will come from the formValue
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

const PaymentSchedule: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()

  const formatedPayments = payments.map((payment) => {
    const paymentDate = new Date(payment.date)
    return {
      year: format(paymentDate, 'yyyy'),
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
        Header: formatText(m.salaryLabelYear, application, formatMessage),
        accessor: 'year', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText(m.salaryLabelMonth, application, formatMessage),
        accessor: 'month',
      } as const,
      {
        Header: formatText(
          m.salaryLabelPensionFund,
          application,
          formatMessage,
        ),
        accessor: 'pensionContribution',
      } as const,
      {
        Header: formatText(m.salaryLabelTax, application, formatMessage),
        accessor: 'tax',
      } as const,
      {
        Header: formatText(m.salaryLabelPaidAmount, application, formatMessage),
        accessor: 'amount',
      } as const,
    ],
    [application, formatMessage],
  )

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginY={3}>
        <Table
          columns={columns}
          data={data}
          truncate
          showMoreLabel={formatText(
            m.salaryLabelShowMore,
            application,
            formatMessage,
          )}
          showLessLabel={formatText(
            m.salaryLabelShowLess,
            application,
            formatMessage,
          )}
        />
      </Box>
    </Box>
  )
}

export default PaymentSchedule
