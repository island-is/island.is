import { PaymentScheduleDebts } from '@island.is/api/schema'
import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { paymentPlan } from '../../../lib/messages/paymentPlan'

interface Props {
  payment: PaymentScheduleDebts
  isAnswered?: boolean
  onEditClick?: (id: string) => void
}

const ValueLine = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <Text lineHeight="lg">
    <b>{label}: </b>
    <span>
      {typeof value === 'number'
        ? `${value.toLocaleString('is-IS')} kr.`
        : value}
    </span>
  </Text>
)

// TODO: Arrow down icon missing
export const PaymentPlanCard = ({ payment, isAnswered }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatMessage } = useLocale()

  const handleExpandClick = () => setIsExpanded(!isExpanded)

  return (
    <Box
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
      marginBottom={2}
    >
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h3">{payment.paymentSchedule}</Text>
        <Tag variant="purple" disabled>
          {formatMessage(payment.explanation)}
        </Tag>
      </Box>

      <Text lineHeight="lg">
        <span>{formatMessage(paymentPlan.labels.totalAmount)}:</span>
        <b>{` ${payment.totalAmount.toLocaleString('is-IS')} kr.`}</b>
      </Text>
      <AnimateHeight duration={400} height={isExpanded ? 'auto' : 0}>
        <Box marginY={2}>
          {payment.chargetypes.map((chargeType, index) => (
            <Box
              key={index}
              paddingY={2}
              paddingX={3}
              marginTop={2}
              background="blue100"
              borderRadius="large"
            >
              <ValueLine
                label={formatMessage(paymentPlan.labels.feeCategory)}
                value={chargeType.name}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.principal)}
                value={chargeType.principal}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.interest)}
                value={chargeType.intrest}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.expense)}
                value={chargeType.expenses}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.totalAmount)}
                value={chargeType.total}
              />
            </Box>
          ))}
        </Box>
      </AnimateHeight>
      <Box
        display="flex"
        justifyContent="flexStart"
        alignItems="flexEnd"
        marginTop={isAnswered ? 0 : 2}
      >
        <div>
          <Button
            variant="text"
            icon={isExpanded ? 'arrowUp' : 'arrowDown'}
            iconType="outline"
            onClick={handleExpandClick}
          >
            {formatMessage(paymentPlan.labels.moreInfo)}
          </Button>
        </div>
      </Box>
    </Box>
  )
}
