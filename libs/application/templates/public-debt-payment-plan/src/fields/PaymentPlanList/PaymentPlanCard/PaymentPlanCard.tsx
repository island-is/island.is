import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { Payment, PaymentType } from '../../../dataProviders/tempAPITypes'
import { paymentPlan } from '../../../lib/messages/paymentPlan'

// TODO: Map correct type to the appropriate label
const getPaymentTypeLabel = (type: PaymentType) =>
  type === PaymentType.O
    ? paymentPlan.labels.deductedFromSalary
    : paymentPlan.labels.sentAsAClaim

interface Props {
  payment: Payment
  isAnswered: boolean
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
export const PaymentPlanCard = ({ payment }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { formatMessage } = useLocale()

  const handleExpandClick = () => setIsExpanded(!isExpanded)

  return (
    <Box
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
      marginBottom={3}
    >
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="eyebrow" color="purple400">
          {payment.organization}
        </Text>
        <Tag variant="purple">
          {formatMessage(getPaymentTypeLabel(payment.type))}
        </Tag>
      </Box>
      <Text variant="h3">{payment.paymentSchedule}</Text>
      <Text lineHeight="lg">
        <span>{formatMessage(paymentPlan.labels.totalAmount)}:</span>
        <b>{` ${payment.totalAmount.toLocaleString('is-IS')} kr.`}</b>
      </Text>
      <AnimateHeight duration={400} height={isExpanded ? 'auto' : 0}>
        <Box paddingY={2}>
          {payment.chargeTypes.map((chargeType, index) => (
            <Box
              key={index}
              paddingY={2}
              paddingX={3}
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
                value={chargeType.interest}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.expense)}
                value={chargeType.expense}
              />
              <ValueLine
                label={formatMessage(paymentPlan.labels.totalAmount)}
                value={chargeType.total}
              />
            </Box>
          ))}
        </Box>
      </AnimateHeight>
      <Box marginTop={2}>
        <Button
          variant="text"
          icon={isExpanded ? 'caretUp' : 'caretDown'}
          iconType="filled"
          onClick={handleExpandClick}
        >
          {formatMessage(paymentPlan.labels.moreInfo)}
        </Button>
      </Box>
    </Box>
  )
}
