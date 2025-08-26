import { useState } from 'react'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m,
  amountFormat,
  periodFormat,
  formatDate,
  NestedTable,
} from '@island.is/portals/my-pages/core'
import sortBy from 'lodash/sortBy'
import { ExpandRow, ExpandHeader } from '@island.is/portals/my-pages/core'
import { m as messages } from '../../lib/messages'
import { CustomerRecordsDetails } from '../../lib/types'

const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: Array<CustomerRecordsDetails>
}

const FinanceTransactionsTable = ({ recordsArray }: Props) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const totalPages =
    recordsArray.length > ITEMS_ON_PAGE
      ? Math.ceil(recordsArray.length / ITEMS_ON_PAGE)
      : 0
  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.date) },
            { value: formatMessage(m.chargeType) },
            { value: formatMessage(m.feeItem) },
            { value: formatMessage(messages.feeBase) },
            { value: formatMessage(m.period) },
            { value: formatMessage(m.amount), align: 'right' },
          ]}
        />
        <T.Body>
          {sortBy(recordsArray, (item) => {
            return item.createDate
          })
            .reverse()
            .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
            .map((record) => (
              <ExpandRow
                key={`${record.createTime}-${record.createDate}-${record.accountReference}-${record.reference}-${record.amount}`}
                data={[
                  { value: formatDate(record.createDate) },
                  { value: record.chargeType },
                  { value: record.itemCode },
                  { value: record.chargeItemSubject },
                  { value: periodFormat(record.period) },
                  { value: amountFormat(record.amount), align: 'right' },
                ]}
              >
                <NestedTable
                  data={[
                    {
                      title: formatMessage(m.effectiveDate),
                      value: formatDate(record.valueDate),
                    },
                    {
                      title: formatMessage(m.performingOrganization),
                      value: record.performingOrganization,
                    },
                    {
                      title: formatMessage(m.guardian),
                      value: record.collectingOrganization,
                    },
                    {
                      title: formatMessage(m.recordCategory),
                      value: record.category,
                    },
                    {
                      title: formatMessage(m.recordAction),
                      value: record.subCategory,
                    },
                    ...(record.actionCategory
                      ? [
                          {
                            title: formatMessage(m.actionCategory),
                            value: record.actionCategory,
                          },
                        ]
                      : []),
                    {
                      title: formatMessage(m.reference),
                      value: record.reference,
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

export default FinanceTransactionsTable
