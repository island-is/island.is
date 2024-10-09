import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import capitalize from 'lodash/capitalize'
import {
  m,
  amountFormat,
  formatDate,
  NestedTable,
  displayMonthOrYear,
} from '@island.is/portals/my-pages/core'
import { ExpandRow, ExpandHeader } from '@island.is/portals/my-pages/core'
import { hb, m as messages } from '../../lib/messages'
import {
  HousingBenefitsPayment,
  HousingBenefitsPayments,
} from '@island.is/api/schema'
import { HousingBenefitsFooter } from './HousingBenefitsFooter'

interface Props {
  payments: HousingBenefitsPayments
  page: number
  itemsOnPage: number
  setPage: (n: number) => void
}

const HousingBenefitsTable = ({
  payments,
  page,
  itemsOnPage,
  setPage,
}: Props) => {
  const { formatMessage, lang } = useLocale()

  const recordsArray = payments.data

  const totalPages =
    payments.totalCount > itemsOnPage
      ? Math.ceil(payments.totalCount / itemsOnPage)
      : 0

  const yearTransactionType = (record: HousingBenefitsPayment) => {
    try {
      const message =
        /^\d+$/.test(record?.month ?? '') &&
        record.transactionType &&
        formatMessage(hb.transaction?.[record.transactionType])
      return message ? ' - ' + message : ''
    } catch (e) {
      return ''
    }
  }

  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.dateShort) },
            { value: formatMessage(messages.hbRentMonth) },
            { value: formatMessage(messages.hbPaymentBeforeDebt) },
            { value: formatMessage(messages.hbDebtPaidOff) },
            { value: formatMessage(messages.hbPaidOut) },
            { value: formatMessage(messages.hbDebtStatus), align: 'right' },
          ]}
        />
        <T.Body>
          {recordsArray.map((record) => (
            <ExpandRow
              key={record.nr}
              data={[
                { value: formatDate(record.dateTransfer) },
                {
                  value: record.month
                    ? `${capitalize(
                        displayMonthOrYear(record.month, lang),
                      )}${yearTransactionType(record)}`
                    : '',
                },
                { value: amountFormat(record.paymentBeforeDebt) },
                { value: amountFormat(record.paidOfDebt) },
                { value: amountFormat(record.paymentActual) },
                { value: amountFormat(record.remainDebt), align: 'right' },
              ]}
            >
              <NestedTable
                data={[
                  {
                    title: formatMessage(messages.hbNumberOfDays),
                    value: record.noDays ?? '',
                  },
                  {
                    title: formatMessage(messages.hbPaymentNumber),
                    value: record.nr ?? '',
                  },
                  {
                    title: formatMessage(messages.hbTotalIncome),
                    value: amountFormat(record.totalIncome),
                  },
                  {
                    title: formatMessage(messages.hbName),
                    value: record.name ?? '',
                  },
                  {
                    title: formatMessage(messages.hbBenefit),
                    value: record.benefit ?? '',
                  },
                  {
                    title: formatMessage(messages.hbBanknumber),
                    value: record.bankAccountMerged ?? '',
                  },
                  {
                    title: formatMessage(messages.hbReductionIncome),
                    value: amountFormat(record.reductionIncome),
                  },
                  {
                    title: formatMessage(messages.hbDateOfBankTransfer),
                    value: formatDate(record.dateTransfer),
                  },
                  {
                    title: formatMessage(messages.hbReductionHousingCost),
                    value: amountFormat(record.reductionHousingCost),
                  },
                  {
                    title: formatMessage(messages.hbTypeOfCalculation),
                    value: record.calculationType
                      ? formatMessage(hb.calculation?.[record.calculationType])
                      : '',
                  },
                  {
                    title: formatMessage(messages.hbReductionAssets),
                    value: amountFormat(record.reductionAssets),
                  },
                  {
                    title: formatMessage(messages.hbTypeOfTransaction),
                    value: record.transactionType
                      ? formatMessage(hb.transaction?.[record.transactionType])
                      : '',
                  },
                  {
                    title: formatMessage(messages.hbPaymentType),
                    value:
                      record.paymentOrigin === 1
                        ? formatMessage(messages.paymentOrigin1)
                        : record.paymentOrigin === 2
                        ? formatMessage(messages.paymentOrigin2)
                        : '',
                  },
                ]}
              />
            </ExpandRow>
          ))}
        </T.Body>
        <HousingBenefitsFooter paymentArray={payments.data ?? []} />
      </T.Table>
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(p, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(p)}
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

export default HousingBenefitsTable
