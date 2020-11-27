import React, { FC } from 'react'
import format from 'date-fns/format'
import { Application, formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

import { Table } from '@island.is/shared/table'
import { formatIsk } from '../parentalLeaveUtils'
import { Payment } from '../../types'

interface PaymentsTableProps {
  application: Application
  payments?: Payment[]
}

const PaymentsTable: FC<PaymentsTableProps> = ({ application, payments }) => {
  const { formatMessage } = useLocale()

  const formattedPayments =
    payments?.map((payment) => {
      const paymentDate = new Date(payment.period.from)
      return {
        year: format(paymentDate, 'yyyy'),
        month: format(paymentDate, 'MMMM'),
        taxAmount: formatIsk(payment.taxAmount),
        pensionAmount: formatIsk(payment.pensionAmount),
        ratio: payment.period.ratio,
        amount: formatIsk(payment.estimatedAmount),
      }
    }) ?? []

  const data = React.useMemo(() => [...formattedPayments], [formattedPayments])
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
        accessor: 'pensionAmount',
      } as const,
      {
        Header: formatText(m.salaryLabelTax, application, formatMessage),
        accessor: 'taxAmount',
      } as const,
      {
        Header: '%',
        accessor: 'ratio',
      } as const,
      {
        Header: formatText(m.salaryLabelPaidAmount, application, formatMessage),
        accessor: 'amount',
      } as const,
    ],
    [application, formatMessage],
  )

  return (
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
  )
}

export default PaymentsTable
