import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandHeader } from '../../components/ExpandableTable'
import { PaymentSchedule } from '@island.is/api/schema'
import { dateParse } from '../../utils/dateUtils'
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
                id: 'sp.finance-schedule:total-amount',
                defaultMessage: 'Heildarupphæð',
              }),
            },
            {
              value: formatMessage({
                id: 'sp.finance-schedule:payment-dates',
                defaultMessage: 'Gjalddagar',
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
          {datedArray.map((x, i) => (
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
