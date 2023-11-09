import { useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat } from '@island.is/service-portal/core'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandRow, ExpandHeader } from '@island.is/service-portal/core'
import { GetHmsLoansLoanOverviewQuery } from '../../screens/FinanceLoans/FinanceLoans.generated'
import { m } from '../../lib/messages'
import { FinanceLoansTableDetail } from './FinanceLoansTableDetail'

const ITEMS_ON_PAGE = 20

interface Props {
  loanOverview: Exclude<
    GetHmsLoansLoanOverviewQuery['getHmsLoansLoanOverview'],
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
                key={`${loan.masterloanid}`}
                data={[
                  { value: loan.masterloanid ?? '' },
                  { value: loan.vextir ?? '' },
                  {
                    value: format(
                      new Date(loan.fyrstiGjalddagi),
                      dateFormat.is,
                    ),
                  },
                  {
                    value: amountFormat(loan.upphaflegFjarhaed ?? 0),
                    align: 'right',
                  },
                ]}
              >
                <FinanceLoansTableDetail
                  data={[
                    {
                      title: 'Fastanúmer',
                      value: null,
                    },
                    {
                      title: 'Veðstaður',
                      value: loan.vedstadir?.[0]?.vedstadurHeiti,
                    },
                    {
                      title: 'Númer leggs',
                      value: null,
                    },
                    {
                      title: 'Gjaldmiðill',
                      value: 'ISK',
                    },
                    {
                      title: 'Fyrsti vaxtadagur',
                      value: loan.fyrstiVaxtadagur,
                    },
                    {
                      title: 'Næsti gjalddagi',
                      value: loan.naestiGjalddagi,
                    },
                    {
                      title: 'Síðasti gjalddagi',
                      value: loan.sidastiGjalddagi,
                    },
                    {
                      title: 'Elsti ógreiddi gjalddagi',
                      value: loan.elstiOgreiddiGjalddagi,
                    },
                  ]}
                />

                <FinanceLoansTableDetail
                  data={[
                    {
                      title: 'Fjöldi gjalddaga',
                      value: loan.fjoldiGjalddaga,
                    },
                    {
                      title: 'Fjöldi gjalddaga á ári',
                      value: loan.fjoldiGjalddagaAAri,
                    },
                    {
                      title: 'Fjöldi gjalddaga eftir',
                      value: loan.fjoldiGjalddagaEftir,
                    },
                    {
                      title: 'Greiðslujöfnun',
                      value: loan.greidslujofnun,
                    },
                    {
                      title: 'Uppgreiðsluákvæði',
                      value: loan.uppGrAkvaedi,
                    },
                    {
                      title: 'Breytilegir vextir',
                      value: loan.breytilegir,
                    },
                    {
                      title: 'Tegund vísitölu',
                      value: loan.tegVisitolu,
                    },
                    {
                      title: 'Grunnvísitala',
                      value: loan.grunnVisitala,
                    },
                    {
                      title: 'Staða á jöfnunarreikning',
                      value: loan.stadaJofnun,
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
                      value: loan.nafnverdOgjaldfallid,
                    },
                    {
                      title: 'Áfallnir vextir með verðbótum',
                      value: loan.afallnirVxtVb,
                    },
                    {
                      title: 'Eftirstöðvar með verðbótum miðað við skil',
                      value: loan.eftirstodvarMVSkil,
                    },
                    {
                      title: 'Uppgreiðsluþóknun',
                      value: loan.uppgreidslugjald,
                    },
                    {
                      title: 'Uppgreiðlsuverðmæti',
                      value: loan.uppgreidsluverdmaeti,
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
