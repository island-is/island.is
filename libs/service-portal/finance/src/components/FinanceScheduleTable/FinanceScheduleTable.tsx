import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { dateFormat } from '@island.is/shared/constants'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import {
  FinancePaymentScheduleArray,
  FinancePaymentScheduleItem,
} from '../../screens/FinanceSchedule/FinanceSchedule.types'
import FinanceScheduleDetailTable from './FinanceScheduleDetailTable'

const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: Array<FinancePaymentScheduleItem>
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

const dateParse = (startDate: string) => {
  const year = +startDate.substring(0, 4)
  const month = +startDate.substring(4, 6)
  const day = +startDate.substring(6, 8)
  return new Date(year, month, day)
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
      approvalDate: dateParse(x.approvalDate),
      scheduleStatus: getType(x.scheduleStatus),
    }
  })

  datedArray.sort((a, b) =>
    compare(b.approvalDate.getTime(), a.approvalDate.getTime()),
  )
  datedArray.sort((a, b) => compare(a.scheduleStatus, b.scheduleStatus))

  return (
    <>
      <Text variant="h5" as="h2" paddingBottom={1}>
        {'Virkar greiðsluáætlanir'}
      </Text>
      <T.Table>
        <ExpandHeader
          data={[
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
            { value: '' },
          ]}
        />
        <T.Body>
          {datedArray.map((x, i) => (
            <ExpandRow
              key={`finance-schedule-row-${i}`}
              onExpandCallback={() => console.log('EXPAND')}
              data={[
                { value: format(x.approvalDate, dateFormat.is) },
                { value: x.totalAmount },
                { value: x.paymentCount },
                { value: x.scheduleStatus },
                { value: 'Samþykkja | PDF' },
              ]}
            >
              <Box>THIS COMES LATER</Box>
              {/* <FinanceScheduleDetailTable /> */}
            </ExpandRow>
          ))}
        </T.Body>
      </T.Table>
      {/* <ExpandRow
      key={chargeType.id}
      onExpandCallback={() =>
        getDetailsQuery({
          variables: {
            input: {
              orgID: organization.id,
              chargeTypeID: chargeType.id,
            },
          },
        })
      }
      data={[
        { value: chargeType.name },
        { value: organization.name },
        { value: amountFormat(chargeType.totals), align: 'right' },
      ]}
      loading={loading}
      error={error}
    >
      {financeStatusDetails?.chargeItemSubjects?.length > 0 ? (
        <FinanceStatusDetailTable
          organization={organization}
          financeStatusDetails={financeStatusDetails}
          downloadURL={downloadURL}
          userInfo={userInfo}
        />
      ) : null}
    </ExpandRow> */}
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
