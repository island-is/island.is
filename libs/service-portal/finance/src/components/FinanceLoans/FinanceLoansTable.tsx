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
  GetHmsLoansLoanHistoryQuery,
  useGetHmsLoansLoanHistoryPdfLazyQuery,
} from '../../screens/FinanceLoans/FinanceLoans.generated'
import { m as messages } from '../../lib/messages'
import { FinanceLoansTableDetail } from './FinanceLoansTableDetail'
import { FinanceLoansPaymentHistory } from './FinanceLoansPaymenthistory'
import * as styles from './FinanceLoans.css'

interface Props {
  loanOverview: Exclude<
    GetHmsLoansLoanHistoryQuery['hmsLoansLoanHistory'],
    null | undefined
  >
}

export const FinanceLoansTable = ({ loanOverview }: Props) => {
  const { formatMessage } = useLocale()

  const [
    getHmsLoansLoanHistoryPdf,
    { loading: loanhistoryPdfLoading, error: loanhistoryPdfError },
  ] = useGetHmsLoansLoanHistoryPdfLazyQuery({
    onCompleted: (data) => {
      if (data.hmsLoansLoanHistoryPdf?.data) {
        downloadLink(
          data.hmsLoansLoanHistoryPdf.data,
          data.hmsLoansLoanHistoryPdf.mime ?? 'application/pdf',
          data.hmsLoansLoanHistoryPdf.name ?? 'lanayfirlit.pdf',
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
            getHmsLoansLoanHistoryPdf()
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
                            title: 'Fyrsti vaxtadagur',
                            value: formatDate(loan.firstInterestDate) || '-',
                          },
                          {
                            title: 'Fyrsti gjalddagi',
                            value: formatDate(loan.firstPaymentDate) || '-',
                          },
                          {
                            title: 'Næsti gjalddagi',
                            value: formatDate(loan.nextPaymentDate) || '-',
                          },
                          {
                            title: 'Síðasti gjalddagi',
                            value: formatDate(loan.lastPaymentDate) || '-',
                          },
                          {
                            title: 'Elsti ógreiddi gjalddagi',
                            value:
                              formatDate(loan.lastUnpaidInvoiceDate) || '-',
                          },
                          {
                            title: 'Fjöldi gjalddaga',
                            value: loan.totalNumberOfPayments || '-',
                          },
                          {
                            title: 'Fjöldi gjalddaga á ári',
                            value: loan.numberOfPaymentPerYear || '-',
                          },
                          {
                            title: 'Fjöldi gjalddaga eftir',
                            value: loan.numberOfPaymentDatesRemaining || '-',
                          },
                          {
                            title: 'Lántakandi',
                            value: loan.name || '-',
                          },
                        ]}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                      <FinanceLoansTableDetail
                        data={[
                          {
                            title: 'Hlutdeildarlán',
                            value: loan.affiliateLoan,
                          },
                          {
                            title: 'Greiðslujöfnun',
                            value: loan.balancePayment || '-',
                          },
                          {
                            title: 'Uppgreiðsluákvæði',
                            value: loan.paymentFee || '-',
                          },
                          {
                            title: 'Breytilegir vextir',
                            value: loan.variableInterest || '-',
                          },
                          {
                            title: 'Tegund vísitölu',
                            value: loan.priceIndexType || '-',
                          },
                          {
                            title: 'Grunnvísitala',
                            value: loan.baseIndex || '-',
                          },
                          {
                            title: 'Staða á jöfnunarreikning',
                            value:
                              amountFormat(loan.statusSettlementPayment) || '-',
                          },
                          {
                            title: 'Kröfuhafi',
                            value: loan.creditor || '-',
                          },
                          {
                            title:
                              loan.coPayers?.length && loan.coPayers.length > 1
                                ? 'Meðgreiðendur'
                                : 'Meðgreiðandi',
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
                            title: 'Áætluð greiðslubyrði á mánuði',
                            value: amountFormat(loan.lastPaymentAmount),
                          },
                          {
                            title: 'Útreiknað ógreitt',
                            value: amountFormat(loan.totalDueAmount) || '-',
                          },
                          {
                            title: 'Nafnverðseftirstöðvar mv. skil',
                            value:
                              amountFormat(
                                loan.balanceWithoutInterestPriceImprovements,
                              ) || '-',
                          },
                          {
                            title: 'Áfallnir vextir með verðbótum',
                            value:
                              amountFormat(
                                loan.accruedInterestPriceImprovements,
                              ) || '-',
                          },
                          {
                            title: 'Eftirstöðvar með verðbótum miðað við skil',
                            value:
                              amountFormat(loan.remainingBalanceWithoutDebt) ||
                              '-',
                          },
                          {
                            title: 'Uppgreiðsluþóknun',
                            value: amountFormat(loan.repaymentFee) || '-',
                          },
                          {
                            title: 'Uppgreiðsluverðmæti',
                            value:
                              amountFormat(loan.loanAmountWithRepayment) || '-',
                          },
                          {
                            title: 'Veðstaður',
                            value:
                              loan.properties
                                ?.map((p) => p.propertyAddress)
                                .join(', ') || '-',
                          },
                          {
                            title: 'Fastanúmer',
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
