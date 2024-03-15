import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat, formatDate } from '@island.is/service-portal/core'
import * as styles from './FinanceLoans.css'
import { m as messages } from '../../lib/messages'
import { useGetHmsLoansPaymentHistoryLazyQuery } from '../../screens/FinanceLoans/FinanceLoans.generated'
import { useEffect, useState } from 'react'

interface Props {
  loanId: number
}

export const FinanceLoansPaymentHistory = ({ loanId }: Props) => {
  const { formatMessage } = useLocale()
  const [historyOpen, setHistoryOpen] = useState(false)

  const [
    getHmsLoansPaymentHistory,
    {
      data: loanPaymentsData,
      loading: loanPaymentsLoading,
      error: loanPaymentsError,
      called: loanPaymentsCalled,
    },
  ] = useGetHmsLoansPaymentHistoryLazyQuery({
    variables: {
      input: {
        loanId,
      },
    },
  })

  useEffect(() => {
    if (historyOpen && !loanPaymentsCalled) {
      getHmsLoansPaymentHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen, loanPaymentsCalled])

  return (
    <>
      <Box padding={2}>
        <Button
          variant="text"
          as="button"
          type="button"
          size="small"
          icon="arrowDown"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          {formatMessage(
            historyOpen
              ? messages.closeLoanPayments
              : messages.openLoanPayments,
          )}
        </Button>
      </Box>
      <Box padding={2} paddingBottom={4} className={styles.scrollBox}>
        {loanPaymentsError ? (
          <AlertMessage
            type="error"
            title={formatMessage(m.errorTitle)}
            message={formatMessage(m.errorFetch)}
          />
        ) : historyOpen && loanPaymentsLoading ? (
          <SkeletonLoader height={40} repeat={6} />
        ) : historyOpen && loanPaymentsData ? (
          <T.Table box={{ className: styles.zebraTable }}>
            <T.Head>
              <T.Row>
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
              </T.Row>
            </T.Head>
            <T.Body>
              {loanPaymentsData?.hmsLoansPaymentHistory?.map((payment) => (
                <T.Row key={payment.paymentDate}>
                  <T.Data>{formatDate(payment.paymentDate)}</T.Data>
                  <T.Data>{formatDate(payment.transactionDate)}</T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.paymentAmount)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.defaultInterest)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.costPayment)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.priceImprovementPayment)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.priceImprovementInterest)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.interest)}
                  </T.Data>
                  <T.Data align="right">
                    {amountFormat(payment.totalPayment)}
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        ) : null}
      </Box>
    </>
  )
}
