import { PaymentScheduleDebts } from '@island.is/api/schema'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Hidden,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { paymentPlan } from '../../../lib/messages/paymentPlan'
import * as styles from './PaymentPlanCard.treat'

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
  <Box display="flex" flexDirection={['row', 'row', 'row', 'column']}>
    <Text variant="eyebrow">{label}:</Text>
    <Box className={styles.valueLine}>
      <Text variant="small">
        {typeof value === 'number'
          ? `${value.toLocaleString('is-IS')} kr.`
          : value}
      </Text>
    </Box>
  </Box>
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
        <Hidden below="lg">
          <Tag variant="purple" disabled>
            {formatMessage(payment.explanation)}
          </Tag>
        </Hidden>
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
              <Box marginBottom={1}>
                <Text variant="default">
                  <b>{formatMessage(paymentPlan.labels.feeCategory)}: </b>
                  <span>{chargeType.name}</span>
                </Text>
              </Box>
              <Divider />
              <GridRow
                marginTop={2}
                direction={['column', 'column', 'column', 'row']}
              >
                <GridColumn span={['1/1', '1/1', '1/1', '1/4']}>
                  <ValueLine
                    label={formatMessage(paymentPlan.labels.principal)}
                    value={chargeType.principal}
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '1/4']}>
                  <ValueLine
                    label={formatMessage(paymentPlan.labels.interest)}
                    value={chargeType.intrest}
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '1/4']}>
                  <ValueLine
                    label={formatMessage(paymentPlan.labels.expense)}
                    value={chargeType.expenses}
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '1/4']}>
                  <ValueLine
                    label={formatMessage(paymentPlan.labels.totalAmount)}
                    value={chargeType.total}
                  />
                </GridColumn>
              </GridRow>
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
      <Hidden above="md">
        <Box marginTop={3}>
          <Tag variant="purple" disabled>
            {formatMessage(payment.explanation)}
          </Tag>
        </Box>
      </Hidden>
    </Box>
  )
}
