import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandHeader, dateParse } from '@island.is/service-portal/core'
import { PaymentSchedule } from '@island.is/api/schema'
import FinanceScheduleTableRow from './FinanceScheduleTableRow'
const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: PaymentSchedule[]
}

const compare = function (a: any, b: any) {
  if (a > b) return +1
  if (a < b) return -1
  return 0
}
const FinanceScheduleTable: FC<Props> = ({ recordsArray }) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const totalPages =
    recordsArray.length > ITEMS_ON_PAGE
      ? Math.ceil(recordsArray.length / ITEMS_ON_PAGE)
      : 0

  const datedArray = recordsArray.map((x) => {
    return {
      ...x,
      approvalDate:
        x.approvalDate.length > 0
          ? format(dateParse(x.approvalDate), dateFormat.is)
          : '',
    }
  })

  datedArray
    .sort((a, b) => compare(a.scheduleStatus, b.scheduleStatus))
    .reverse()

  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '' },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:created-date',
                defaultMessage: 'Stofndagur',
              }),
            },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:type',
                defaultMessage: 'Tegund',
              }),
            },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:total-amount',
                defaultMessage: 'Heildarupphæð',
              }),
            },
            {
              value: (
                <Box display="flex">
                  {formatMessage({
                    id: 'sp.finance-schedule:amount-left-without-interest',
                    defaultMessage: 'Eftirstöðvar án vaxta',
                  })}
                  <Tooltip
                    placement="top"
                    text={formatMessage({
                      id:
                        'sp.finance-schedule:amount-left-without-interest-info',
                      defaultMessage:
                        'Eftirstöðvar án vaxta innihalda þó vexti fram að þeim degi sem greiðsluáætlunin er gerð ef gjöld bera vexti.',
                    })}
                  />
                </Box>
              ),
              element: true,
            },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:payment-remaining',
                defaultMessage: 'Greiðslur eftir',
              }),
            },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:status',
                defaultMessage: 'Staða',
              }),
            },
            { value: '', align: 'right' },
          ]}
        />
        <T.Body>
          {datedArray.map((x) => (
            <FinanceScheduleTableRow
              key={x.scheduleNumber}
              paymentSchedule={x}
            />
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

export default FinanceScheduleTable
