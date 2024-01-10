import {
  Table as T,
  Box,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat, formatDate, m } from '@island.is/service-portal/core'
import {
  ExpandRow,
  ExpandHeader,
  downloadLink,
} from '@island.is/service-portal/core'
import {
  GetHmsLoansHistoryQuery,
  useGetHmsLoansHistoryPdfLazyQuery,
} from '../../screens/FinanceLoans/FinanceLoans.generated'
import { m as messages } from '../../lib/messages'
import { FinanceLoansTableDetail } from './FinanceLoansTableDetail'
import { FinanceLoansPaymentHistory } from './FinanceLoansPaymenthistory'
import * as styles from './FinanceLoans.css'

interface Props {
  loanOverview: Exclude<
    GetHmsLoansHistoryQuery['hmsLoansHistory'],
    null | undefined
  >
}

export const FinanceLoansTable = ({ loanOverview }: Props) => {
  const { formatMessage } = useLocale()

  const [
    getHmsLoansHistoryPdf,
    { loading: loanhistoryPdfLoading, error: loanhistoryPdfError },
  ] = useGetHmsLoansHistoryPdfLazyQuery({
    onCompleted: (data) => {
      if (data.hmsLoansHistoryPdf?.data) {
        downloadLink(
          data.hmsLoansHistoryPdf.data,
          data.hmsLoansHistoryPdf.mime ?? 'application/pdf',
          data.hmsLoansHistoryPdf.name ?? 'lanayfirlit.pdf',
        )
      }
    },
  })

  return (
    <>
      <Box marginBottom={4}>
        <Button
          colorScheme="default"
          icon="download"
          iconType="outline"
          size="default"
          type="button"
          variant="utility"
          disabled={loanhistoryPdfLoading}
          onClick={() => {
            getHmsLoansHistoryPdf()
          }}
        >
          {loanhistoryPdfError
            ? formatMessage(m.errorTitle)
            : formatMessage(messages.download)}
        </Button>
      </Box>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(messages.loanNumber) },
            { value: formatMessage(messages.interests), align: 'right' },
            { value: formatMessage(messages.firstPaymentDate), align: 'right' },
            { value: formatMessage(messages.originalAmount), align: 'right' },
          ]}
        />
        <T.Body>
          {loanOverview.map((loan) => (
            <ExpandRow
              key={`${loan.loanId}`}
              data={[
                { value: loan.loanId ?? '' },
                {
                  value: `${loan.interest}%`.replace('.', ','),
                  align: 'right',
                },
                {
                  value: formatDate(loan.firstPaymentDate),
                  align: 'right',
                },
                {
                  value: amountFormat(loan.originalLoanAmount),
                  align: 'right',
                },
              ]}
              startExpanded={loanOverview.length === 1}
            >
              <Box background="blue100">
                <Box marginBottom={2} paddingTop={4} paddingLeft={2}>
                  <Text fontWeight="semiBold">
                    {formatMessage(m.financeLoans)} {loan.loanId}
                  </Text>
                </Box>
                <GridContainer className={styles.detailsGrid}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                      <FinanceLoansTableDetail
                        data={[
                          {
                            title: formatMessage(messages.firstInterestDate),
                            value: formatDate(loan.firstInterestDate) || '-',
                          },
                          {
                            title: formatMessage(messages.firstPaymentDate),
                            value: formatDate(loan.firstPaymentDate) || '-',
                          },
                          {
                            title: formatMessage(messages.nextPaymentDate),
                            value: formatDate(loan.nextPaymentDate) || '-',
                          },
                          {
                            title: formatMessage(messages.lastPaymentDate),
                            value: formatDate(loan.lastPaymentDate) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.lastUnpaidInvoiceDate,
                            ),
                            value:
                              formatDate(loan.lastUnpaidInvoiceDate) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.totalNumberOfPayments,
                            ),
                            value: loan.totalNumberOfPayments || '-',
                          },
                          {
                            title: formatMessage(
                              messages.numberOfPaymentPerYear,
                            ),
                            value: loan.numberOfPaymentPerYear || '-',
                          },
                          {
                            title: formatMessage(
                              messages.numberOfPaymentDatesRemaining,
                            ),
                            value: loan.numberOfPaymentDatesRemaining || '-',
                          },
                          {
                            title: formatMessage(messages.loanOwner),
                            value: loan.name || '-',
                          },
                        ]}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                      <FinanceLoansTableDetail
                        data={[
                          {
                            title: formatMessage(messages.affiliateLoan),
                            value: loan.affiliateLoan,
                          },
                          {
                            title: formatMessage(messages.balancePayment),
                            value: loan.balancePayment || '-',
                          },
                          {
                            title: formatMessage(messages.paymentFee),
                            value: loan.paymentFee || '-',
                          },
                          {
                            title: formatMessage(messages.variableInterest),
                            value: loan.variableInterest || '-',
                          },
                          {
                            title: formatMessage(messages.priceIndexType),
                            value: loan.priceIndexType || '-',
                          },
                          {
                            title: formatMessage(messages.baseIndex),
                            value: loan.baseIndex || '-',
                          },
                          {
                            title: formatMessage(
                              messages.statusSettlementPayment,
                            ),
                            value:
                              amountFormat(loan.statusSettlementPayment) || '-',
                          },
                          {
                            title: formatMessage(messages.creditor),
                            value: loan.creditor || '-',
                          },
                          {
                            title:
                              loan.coPayers?.length && loan.coPayers.length > 1
                                ? formatMessage(messages.coPayers)
                                : formatMessage(messages.coPayer),
                            value: loan.coPayers?.length
                              ? loan.coPayers
                                  .map((c) => c.coPayerName)
                                  .join(', ')
                              : '-',
                          },
                        ]}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                      <FinanceLoansTableDetail
                        data={[
                          {
                            title: formatMessage(messages.lastPaymentAmount),
                            value: amountFormat(loan.lastPaymentAmount),
                          },
                          {
                            title: formatMessage(messages.totalDueAmount),
                            value: amountFormat(loan.totalDueAmount) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.balanceWithoutInterestPriceImprovements,
                            ),
                            value:
                              amountFormat(
                                loan.balanceWithoutInterestPriceImprovements,
                              ) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.accruedInterestPriceImprovements,
                            ),
                            value:
                              amountFormat(
                                loan.accruedInterestPriceImprovements,
                              ) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.remainingBalanceWithoutDebt,
                            ),
                            value:
                              amountFormat(loan.remainingBalanceWithoutDebt) ||
                              '-',
                          },
                          {
                            title: formatMessage(messages.repaymentFee),
                            value: amountFormat(loan.repaymentFee) || '-',
                          },
                          {
                            title: formatMessage(
                              messages.loanAmountWithRepayment,
                            ),
                            value:
                              amountFormat(loan.loanAmountWithRepayment) || '-',
                          },
                          {
                            title: formatMessage(messages.propertyAddress),
                            value:
                              loan.properties
                                ?.map((p) => p.propertyAddress)
                                .join(', ') || '-',
                          },
                          {
                            title: formatMessage(messages.propertyId),
                            value:
                              loan.properties
                                ?.map((p) => p.propertyId)
                                .join(', ') || '-',
                          },
                        ]}
                      />
                    </GridColumn>
                  </GridRow>
                </GridContainer>
                {loan.loanId && (
                  <FinanceLoansPaymentHistory loanId={loan.loanId} />
                )}
              </Box>
            </ExpandRow>
          ))}
        </T.Body>
      </T.Table>
    </>
  )
}
