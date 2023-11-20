import { useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat } from '@island.is/service-portal/core'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandRow, ExpandHeader } from '@island.is/service-portal/core'
import { GetHmsLoansLoanhistoryQuery } from '../../screens/FinanceLoans/FinanceLoans.generated'
import { m } from '../../lib/messages'
import { FinanceLoansTableDetail } from './FinanceLoansTableDetail'

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

  const totalPages =
    loanOverview.length > ITEMS_ON_PAGE
      ? Math.ceil(loanOverview.length / ITEMS_ON_PAGE)
      : 0
  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.loanNumber) },
            { value: formatMessage(m.interests) },
            { value: formatMessage(m.firstPaymentDate) },
            { value: formatMessage(m.originalAmount) },
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
                  { value: loan.interest ?? '' },
                  {
                    value: format(
                      new Date(loan.firstPaymentDate),
                      dateFormat.is,
                    ),
                  },
                  {
                    value: amountFormat(loan.originalLoanAmount ?? 0),
                    align: 'right',
                  },
                ]}
              >
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
                      value: loan.firstInterestDate,
                    },
                    {
                      title: 'Næsti gjalddagi',
                      value: loan.nextPaymentDate,
                    },
                    {
                      title: 'Síðasti gjalddagi',
                      value: loan.lastPaymentDate,
                    },
                    {
                      title: 'Elsti ógreiddi gjalddagi',
                      value: loan.lastUnpaidInvoiceDate,
                    },
                  ]}
                />

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
                      value: loan.remainingBalanceWithoutDebt,
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
                      value: loan.statusSettlementPayment,
                    },
                  ]}
                />

                <FinanceLoansTableDetail
                  data={[
                    {
                      title: 'Áætluð greiðlsubyrði á mánuði',
                      value: null,
                    },
                    {
                      title: 'Útreiknað ógreitt',
                      value: null,
                    },
                    {
                      title: 'Nafnverðseftirstöðvar',
                      value: loan.balanceWithoutInterestPriceImprovements,
                    },
                    {
                      title: 'Áfallnir vextir með verðbótum',
                      value: loan.accruedInterestPriceImprovements,
                    },
                    {
                      title: 'Eftirstöðvar með verðbótum miðað við skil',
                      value: loan.remainingBalanceWithoutDebt,
                    },
                    {
                      title: 'Uppgreiðsluþóknun',
                      value: loan.repaymentFee,
                    },
                    {
                      title: 'Uppgreiðlsuverðmæti',
                      value: loan.loanAmountWithRepayment,
                    },
                  ]}
                />
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
