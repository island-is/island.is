import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { dateFormat } from '@island.is/shared/constants'
import amountFormat from '../../utils/amountFormat'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import { CustomerRecordsDetails } from '../../screens/FinanceTransactions/FinanceTransactionsData.types'
import FinanceTransactionsDetail from '../FinanceTransactionsDetail/FinanceTransactionsDetail'

const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: Array<CustomerRecordsDetails>
}

const FinanceTransactionsTable: FC<Props> = ({ recordsArray }) => {
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
            formatMessage(m.date),
            formatMessage(m.effectiveDate),
            formatMessage(m.guardian),
            formatMessage(m.feeItem),
            formatMessage(m.amount),
          ]}
        />
        <T.Body>
          {recordsArray
            .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
            .map((record) => (
              <ExpandRow
                key={`${record.createTime}-${record.referenceToLevy}`}
                data={[
                  format(new Date(record.createDate), dateFormat.is),
                  format(new Date(record.valueDate), dateFormat.is),
                  record.collectingOrganization,
                  record.itemCode,
                  amountFormat(record.amount),
                ]}
              >
                <FinanceTransactionsDetail
                  data={[
                    {
                      title: formatMessage(m.performingOrganization),
                      value: record.performingOrganization,
                    },
                    {
                      title: formatMessage(m.feeBase),
                      value: record.chargeItemSubject,
                    },
                    {
                      title: formatMessage(m.period),
                      value: record.period,
                    },
                    {
                      title: formatMessage(m.chargeType),
                      value: record.chargeType,
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
