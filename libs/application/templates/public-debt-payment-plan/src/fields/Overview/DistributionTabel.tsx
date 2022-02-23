import { PaymentSchedulePayment } from '@island.is/api/schema'
import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { paymentPlanTable } from '../../lib/messages'
import { formatIsk } from '../../lib/paymentPlanUtils'

interface Props {
  distribution: PaymentSchedulePayment[]
  totalAmount: number
  isWageDeduction?: boolean
}

const TableRow = ({
  dueDate,
  payment,
  accumulated,
}: {
  dueDate: string
  payment: number
  accumulated: number
}) => {
  return (
    <T.Row>
      <T.Data>{format(new Date(dueDate), 'dd.MM.yyyy')}</T.Data>
      <T.Data box={{ textAlign: 'right' }}>{formatIsk(payment)}</T.Data>
      <T.Data box={{ textAlign: 'right' }}>
        <Text variant="h5">{formatIsk(accumulated)}</Text>
      </T.Data>
    </T.Row>
  )
}

export const DistributionTable = ({
  distribution,
  totalAmount,
  isWageDeduction = false,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatMessage } = useLocale()

  const handleExpandTable = () => setIsExpanded(!isExpanded)
  return (
    <T.Table box={{ borderBottomWidth: undefined }}>
      <T.Head>
        <T.Row>
          <T.HeadData>
            {formatMessage(paymentPlanTable.table.head.dueDate)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {isWageDeduction
              ? formatMessage(paymentPlanTable.table.head.wageDeduction)
              : formatMessage(paymentPlanTable.table.head.finalOverviewPayment)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {isWageDeduction
              ? formatMessage(paymentPlanTable.table.head.totalWageDeduction)
              : formatMessage(paymentPlanTable.table.head.totalPayment)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {!isExpanded && distribution.length > 6 ? (
          <>
            {distribution.slice(0, 2).map((line, index) => (
              <TableRow key={index} {...line} />
            ))}
            {distribution.length > 2 && (
              <T.Row>
                <T.Data colSpan={3} box={{ background: 'blue100' }}>
                  <Box display="flex" justifyContent="center" marginY={1}>
                    <Button
                      variant="ghost"
                      onClick={handleExpandTable}
                      size="small"
                    >
                      {formatMessage(paymentPlanTable.table.labels.seeAllDates)}
                    </Button>
                  </Box>
                </T.Data>
              </T.Row>
            )}
            {distribution
              .slice(distribution.length - 2, distribution.length)
              .map((line, index) => (
                <TableRow key={index} {...line} />
              ))}
          </>
        ) : (
          distribution.map((line, index) => <TableRow key={index} {...line} />)
        )}
        <T.Row>
          <T.Data>
            <Text variant="h5">
              {formatMessage(paymentPlanTable.table.labels.totalAmount)}
            </Text>
          </T.Data>
          <T.Data box={{ textAlign: 'right' }}>
            <Text variant="h4" color="blue400">
              {formatIsk(totalAmount)}
            </Text>
          </T.Data>
          <T.Data />
        </T.Row>
        {isExpanded && distribution.length > 6 && (
          <T.Row>
            <T.Data colSpan={3} box={{ background: 'blue100' }}>
              <Box display="flex" justifyContent="center" marginY={1}>
                <Button
                  variant="ghost"
                  onClick={handleExpandTable}
                  size="small"
                >
                  {formatMessage(paymentPlanTable.table.labels.seeLessDates)}
                </Button>
              </Box>
            </T.Data>
          </T.Row>
        )}
      </T.Body>
    </T.Table>
  )
}
