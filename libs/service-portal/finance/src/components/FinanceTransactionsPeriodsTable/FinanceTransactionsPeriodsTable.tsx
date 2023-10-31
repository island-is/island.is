import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandRow, ExpandHeader } from '@island.is/service-portal/core'
import FinanceTransactionsDetail from '../FinanceTransactionsDetail/FinanceTransactionsDetail'
import { GetChargeTypesDetailsByYearQuery } from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'

const ITEMS_ON_PAGE = 20

interface Props {
  records: GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']['chargeType']
}

const FinanceTransactionsPeriodsTable: FC<React.PropsWithChildren<Props>> = ({
  records,
}) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const totalPages =
    records.length > ITEMS_ON_PAGE
      ? Math.ceil(records.length / ITEMS_ON_PAGE)
      : 0
  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.chargeType) },
            { value: formatMessage(m.feeBase) },
            { value: formatMessage(m.feeBaseDescription) },
            { value: formatMessage(m.lastMovement) },
          ]}
        />
        <T.Body>
          {sortBy(records, (item) => {
            return item.lastMovementDate
          })
            .reverse()
            .map((record) => (
              <ExpandRow
                key={`${record.ID}-${record.chargeItemSubjects}-${record.lastMovementDate}`}
                data={[
                  { value: record.name },
                  { value: record.chargeItemSubjects },
                  { value: record.chargeItemSubjectDescription },
                  {
                    value: format(
                      new Date(record.lastMovementDate),
                      dateFormat.is,
                    ),
                  },
                ]}
              >
                Foo
                {/*
                <FinanceTransactionsDetail
                  data={[
                    {
                      title: formatMessage(m.effectiveDate),
                      value: format(new Date(record.valueDate), dateFormat.is),
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
                */}
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

export default FinanceTransactionsPeriodsTable
