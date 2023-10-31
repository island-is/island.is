import { Box, Text, Table as T, Pagination } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
import * as styles from './FinanceTransactionsPeriodsTableDetail.css'
import { GetChargeItemSubjectsByYearQuery } from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { amountFormat, periodFormat } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy'

interface Props {
  data: GetChargeItemSubjectsByYearQuery['getChargeItemSubjectsByYear']['chargeItemSubjects']
}

const ITEMS_ON_PAGE = 5

const FinanceTransactionsPeriodsTableDetail = ({ data }: Props) => {
  console.log({ data })
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const subjects = useMemo(() => {
    return sortBy(data, (item) => {
      return item.lastMoveDate
    }).reverse()
  }, [data])

  const totalPages =
    data.length > ITEMS_ON_PAGE ? Math.ceil(data.length / ITEMS_ON_PAGE) : 0

  return (
    <Box padding={2} background="blue100">
      {subjects
        .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
        .map((item) => (
          <Box
            className={styles.innerCol}
            key={item.chargeItemSubject}
            padding={2}
          >
            <Box>
              <Text fontWeight="semiBold" variant="medium" as="span">
                {formatMessage(m.feeBase)} -{' '}
              </Text>
              <Text variant="medium" as="span">
                {item.chargeItemSubject}
              </Text>
            </Box>

            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData></T.HeadData>
                  <T.HeadData>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.period)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.explanationNote)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.lastMovement)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData align="right">
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.financeStatus)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {item.periods.map((period, i) => (
                  <T.Row key={`${period.period}-${i}-${period.lastMoveDate}`}>
                    <T.Data></T.Data>
                    <T.Data>{periodFormat(period.period)}</T.Data>
                    <T.Data>{period.description}</T.Data>
                    <T.Data>
                      {format(new Date(period.lastMoveDate), dateFormat.is)}
                    </T.Data>
                    <T.Data align="right">
                      {amountFormat(Number(period.amount))}
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
              <T.Foot>
                <T.Row>
                  <T.Data colSpan={3}>
                    <Text variant="small" fontWeight="semiBold">
                      {formatMessage(m.total)}
                    </Text>
                  </T.Data>
                  <T.Data colSpan={2} align="right">
                    <Text variant="small" fontWeight="semiBold">
                      {amountFormat(item.totalAmount)}
                    </Text>
                  </T.Data>
                </T.Row>
              </T.Foot>
            </T.Table>
          </Box>
        ))}
      {totalPages > 0 ? (
        <Box padding={2} paddingTop={8}>
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
    </Box>
  )
}

export default FinanceTransactionsPeriodsTableDetail
