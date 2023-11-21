import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat, formatDate } from '@island.is/service-portal/core'
import { ExpandRow } from '@island.is/service-portal/core'

import { m as messages } from '../../lib/messages'
import {
  useGetHmsLoansPaymenthistoryLazyQuery,
  useGetHmsLoansPaymenthistoryQuery,
} from '../../screens/FinanceLoans/FinanceLoans.generated'

interface Props {
  loanId: number
}

export const FinanceLoansPaymenthistory = ({ loanId }: Props) => {
  const { formatMessage } = useLocale()
  /*
  const [
    getHmsLoansPaymenthistory,
    {
      data: loanPaymentsData,
      loading: loanPaymentsLoading,
      error: loanPaymentsError,
      called: loanPaymentsCalled,
    },
  ] = useGetHmsLoansPaymenthistoryLazyQuery({
    variables: {
      input: {
        loanId,
      },
    },
  })*/

  const {
    data: loanPaymentsData,
    loading: loanPaymentsLoading,
    error: loanPaymentsError,
    called: loanPaymentsCalled,
  } = useGetHmsLoansPaymenthistoryQuery({
    variables: {
      input: {
        loanId,
      },
    },
  })

  return (
    <T.Table>
      <T.Head>
        <T.HeadData>
          <Text fontWeight="semiBold" variant="small">
            {formatMessage(messages.paymentDate)}
          </Text>
        </T.HeadData>
        <T.HeadData>
          <Text fontWeight="semiBold" variant="small">
            {formatMessage(messages.transactionDate)}
          </Text>
        </T.HeadData>
        <T.HeadData align="right">
          <Text fontWeight="semiBold" variant="small">
            {formatMessage(messages.payment)}
          </Text>
        </T.HeadData>
      </T.Head>
      <T.Body>
        {loanPaymentsData?.hmsLoansPaymenthistory?.map((payment) => (
          <T.Row key={payment.paymentDate}>
            <T.Data>{formatDate(payment.paymentDate)}</T.Data>
            <T.Data>{formatDate(payment.transactionDate)}</T.Data>
            <T.Data align="right">{amountFormat(payment.paymentAmount)}</T.Data>
            <T.Data align="right">
              {amountFormat(payment.defaultInterest)}
            </T.Data>
            <T.Data align="right">{amountFormat(payment.costPayment)}</T.Data>
            <T.Data align="right">
              {amountFormat(payment.priceImprovementPayment)}
            </T.Data>
            <T.Data align="right">
              {amountFormat(payment.priceImprovementInterest)}
            </T.Data>
            <T.Data align="right">{amountFormat(payment.interest)}</T.Data>
            <T.Data align="right">{amountFormat(payment.totalPayment)}</T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
