import React, { FC } from 'react'
import format from 'date-fns/format'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../lib/messages'

import { Table } from '@island.is/application/ui-components'
import { formatIsk } from '../../lib/parentalLeaveUtils'
import { Payment } from '../../types'

interface PaymentsTableProps {
  application: Application
  payments?: Payment[]
}

const PaymentsTable: FC<React.PropsWithChildren<PaymentsTableProps>> = ({
  application,
  payments,
}) => {
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
        Header: formatText(
          parentalLeaveFormMessages.shared.salaryLabelYear,
          application,
          formatMessage,
        ),
        accessor: 'year', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText(
          parentalLeaveFormMessages.shared.salaryLabelMonth,
          application,
          formatMessage,
        ),
        accessor: 'month',
      } as const,
      {
        Header: formatText(
          parentalLeaveFormMessages.shared.salaryLabelPensionFund,
          application,
          formatMessage,
        ),
        accessor: 'pensionAmount',
      } as const,
      {
        Header: formatText(
          parentalLeaveFormMessages.shared.salaryLabelTax,
          application,
          formatMessage,
        ),
        accessor: 'taxAmount',
      } as const,
      {
        Header: '%',
        accessor: 'ratio',
      } as const,
      {
        Header: formatText(
          parentalLeaveFormMessages.shared.salaryLabelPaidAmount,
          application,
          formatMessage,
        ),
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
        parentalLeaveFormMessages.shared.salaryLabelShowMore,
        application,
        formatMessage,
      )}
      showLessLabel={formatText(
        parentalLeaveFormMessages.shared.salaryLabelShowLess,
        application,
        formatMessage,
      )}
    />
  )
}

export default PaymentsTable
