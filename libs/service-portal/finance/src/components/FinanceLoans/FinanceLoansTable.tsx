import { useState } from 'react'
import {
  Table as T,
  Box,
  Pagination,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat, formatDate } from '@island.is/service-portal/core'
import { ExpandRow, ExpandHeader } from '@island.is/service-portal/core'
import {
  GetHmsLoansLoanhistoryQuery,
  useGetHmsLoansLoanhistoryPdfLazyQuery,
} from '../../screens/FinanceLoans/FinanceLoans.generated'
import { m } from '../../lib/messages'
import { FinanceLoansTableDetail } from './FinanceLoansTableDetail'
import { FinanceLoansPaymenthistory } from './FinanceLoansPaymenthistory'
import * as styles from './FinanceLoans.css'
const ITEMS_ON_PAGE = 20

interface Props {
  loanOverview: Exclude<
    GetHmsLoansLoanhistoryQuery['hmsLoansLoanhistory'],
    null | undefined
  >
}

export const FinanceLoansTable = ({ loanOverview }: Props) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const [getHmsLoansLoanhistoryPdf] = useGetHmsLoansLoanhistoryPdfLazyQuery({
    onCompleted: (data) => {
      console.log({ data })
    },
  })

  const totalPages =
    loanOverview.length > ITEMS_ON_PAGE
      ? Math.ceil(loanOverview.length / ITEMS_ON_PAGE)
      : 0

  console.log({ loan: loanOverview[0] })

  return (
    <>
      <Button
        onClick={() => {
          getHmsLoansLoanhistoryPdf()
        }}
      >
        {formatMessage(m.download)}
      </Button>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.loanNumber) },
            { value: formatMessage(m.interests), align: 'right' },
            { value: formatMessage(m.firstPaymentDate), align: 'right' },
            { value: formatMessage(m.originalAmount), align: 'right' },
          ]}
        />
        <T.Body>
          {loanOverview
            .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
            .map((loan) => (
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
              >
                <Box background="blue100">
                  <Box marginBottom={2} paddingTop={4} paddingLeft={2}>
                    <Text fontWeight="semiBold">Lán {loan.loanId}</Text>
                  </Box>
                  <GridContainer className={styles.detailsGrid}>
                    <GridRow>
                      <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                        <FinanceLoansTableDetail
                          data={[
                            {
                              title: 'Fastanúmer',
                              value: loan.propertyId,
                            },
                            {
                              title: 'Veðstaður',
                              value: loan.propertyAddress,
                            },
                            {
                              title: 'Númer leggs',
                              value: loan.municipalityNumber,
                            },
                            {
                              title: 'Gjaldmiðill',
                              value: 'ISK',
                            },
                            {
                              title: 'Fyrsti vaxtadagur',
                              value: formatDate(loan.firstInterestDate),
                            },
                            {
                              title: 'Næsti gjalddagi',
                              value: formatDate(loan.nextPaymentDate),
                            },
                            {
                              title: 'Síðasti gjalddagi',
                              value: formatDate(loan.lastPaymentDate),
                            },
                            {
                              title: 'Elsti ógreiddi gjalddagi',
                              value: formatDate(loan.lastUnpaidInvoiceDate),
                            },
                          ]}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                        <FinanceLoansTableDetail
                          data={[
                            {
                              title: 'Fjöldi gjalddaga',
                              value: loan.totalNumberOfPayments,
                            },
                            {
                              title: 'Fjöldi gjalddaga á ári',
                              value: loan.numberOfPaymentPerYear,
                            },
                            {
                              title: 'Fjöldi gjalddaga eftir',
                              value: loan.numberOfPaymentDatesRemaining,
                            },
                            {
                              title: 'Greiðslujöfnun',
                              value: amountFormat(
                                loan.remainingBalanceWithoutDebt,
                              ),
                            },
                            {
                              title: 'Uppgreiðsluákvæði',
                              value: loan.paymentFee,
                            },
                            {
                              title: 'Breytilegir vextir',
                              value: loan.variableInterest,
                            },
                            {
                              title: 'Tegund vísitölu',
                              value: loan.priceIndexType,
                            },
                            {
                              title: 'Grunnvísitala',
                              value: loan.baseIndex,
                            },
                            {
                              title: 'Staða á jöfnunarreikning',
                              value: amountFormat(loan.statusSettlementPayment),
                            },
                          ]}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                        <FinanceLoansTableDetail
                          data={[
                            {
                              title: 'Áætluð greiðlsubyrði á mánuði',
                              value: null, //loan.,
                            },
                            {
                              title: 'Útreiknað ógreitt',
                              value: null, //loan.,
                            },
                            {
                              title: 'Nafnverðseftirstöðvar',
                              value: amountFormat(
                                loan.balanceWithoutInterestPriceImprovements,
                              ),
                            },
                            {
                              title: 'Áfallnir vextir með verðbótum',
                              value: amountFormat(
                                loan.accruedInterestPriceImprovements,
                              ),
                            },
                            {
                              title:
                                'Eftirstöðvar með verðbótum miðað við skil',
                              value: amountFormat(
                                loan.remainingBalanceWithoutDebt,
                              ),
                            },
                            {
                              title: 'Uppgreiðsluþóknun',
                              value: amountFormat(loan.repaymentFee),
                            },
                            {
                              title: 'Uppgreiðlsuverðmæti',
                              value: amountFormat(loan.loanAmountWithRepayment),
                            },
                          ]}
                        />
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                  {loan.loanId && (
                    <FinanceLoansPaymenthistory loanId={loan.loanId} />
                  )}
                </Box>
              </ExpandRow>
            ))}
        </T.Body>
      </T.Table>
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}
