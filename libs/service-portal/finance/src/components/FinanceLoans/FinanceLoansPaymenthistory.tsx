import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat, formatDate } from '@island.is/service-portal/core'
import * as styles from './FinanceLoans.css'
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
    <Box padding={2} paddingBottom={4}>
      <T.Table box={{ className: styles.zebraTable }}>
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
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(messages.defaultInterest)}
            </Text>
          </T.HeadData>
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(messages.costPayment)}
            </Text>
          </T.HeadData>
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(messages.priceImprovementPayment)}
            </Text>
          </T.HeadData>
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(messages.priceImprovementInterest)}
            </Text>
          </T.HeadData>
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(messages.interests)}
            </Text>
          </T.HeadData>
          <T.HeadData align="right">
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(m.total)}
            </Text>
          </T.HeadData>
        </T.Head>
        <T.Body>
          {loanPaymentsData?.hmsLoansPaymenthistory?.map((payment) => (
            <T.Row key={payment.paymentDate}>
              <T.Data>{formatDate(payment.paymentDate)}</T.Data>
              <T.Data>{formatDate(payment.transactionDate)}</T.Data>
              <T.Data align="right">
                {amountFormat(payment.paymentAmount)}
              </T.Data>
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
              <T.Data align="right">
                {amountFormat(payment.totalPayment)}
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
