import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import {
  Table as T,
  Box,
  Pagination,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import FinanceScheduleDetailTable from '../FinanceScheduleDetailTable/FinanceScheduleDetailTable'
import {
  DetailedSchedule,
  PaymentSchedule,
  PaymentScheduleDetailModel,
  Query,
} from '@island.is/api/schema'
import * as s from './FinanceScheduleTable.css'
import { gql, useQuery } from '@apollo/client'
import { dateParse } from '../../utils/dateUtils'
const ITEMS_ON_PAGE = 20

export const GET_FINANCE_PAYMENT_SCHEDULE_BY_ID = gql`
  query getPaymentScheduleByIdQuery($input: GetFinancePaymentScheduleInput!) {
    getPaymentScheduleById(input: $input) {
      myDetailedSchedules {
        myDetailedSchedule {
          paidDate
          paidAmount
          paidAmountAccumulated
          paymentNumber
          payments {
            payAmount
            payAmountAccumulated
            payDate
            payExplanation
          }
          plannedAmount
          plannedAmountAccumulated
          plannedDate
        }
      }
    }
  }
`

interface Props {
  recordsArray: PaymentSchedule[]
}

const getType = (type: string) => {
  switch (type) {
    case 'S':
      return 'Í gildi'
    case 'E':
      return 'Ógild'
    case 'L':
      return 'Lokið'
    default:
      return 'Í gildi'
  }
}
const compare = function (a: any, b: any) {
  if (a > b) return +1
  if (a < b) return -1
  return 0
}
const FinanceScheduleTable: FC<Props> = ({ recordsArray }) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(
    GET_FINANCE_PAYMENT_SCHEDULE_BY_ID,
    {
      variables: {
        input: { scheduleNumber: '001' },
      },
    },
  )

  const paymentDetailData: Array<DetailedSchedule> =
    data?.getPaymentScheduleById.myDetailedSchedules.myDetailedSchedule || []

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

  const buttons = (date: string | Date) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Button size="small" variant="text" icon={date === '' ? 'pencil' : 'eye'}>
        {date === '' ? 'Samþykkja' : 'Skoða'}
      </Button>
      <Box marginX={2} className={s.line} />
      <Button size="small" variant="text" icon="document">
        PDF
      </Button>
    </Box>
  )

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
            <ExpandRow
              key={`finance-schedule-row-${i}`}
              onExpandCallback={() => console.log('EXPAND')}
              data={[
                { value: x.approvalDate },
                { value: x.totalAmount },
                { value: x.paymentCount },
                { value: getType(x.scheduleStatus) },
                { value: buttons(x.approvalDate), align: 'right' },
              ]}
            >
              {!loading && !error && (
                <FinanceScheduleDetailTable data={paymentDetailData} />
              )}
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

export default FinanceScheduleTable
