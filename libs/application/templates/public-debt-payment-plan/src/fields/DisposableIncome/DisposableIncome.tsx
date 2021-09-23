import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { employer } from '../../lib/messages'
import { PaymentPlanExternalData } from '../../types'

const InfoBox = ({ title, text }: { title: string | number; text: string }) => (
  <Box
    display="flex"
    alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
    background="blue100"
    borderRadius="large"
    paddingY={2}
    paddingX={3}
    flexDirection={['column', 'column', 'column', 'row']}
  >
    <Box marginRight={1}>
      <Text variant="h3" color="blue400">
        {title}
      </Text>
    </Box>
    <Text>{text}</Text>
  </Box>
)

export const DisposableIncome = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const externalData = application.externalData as PaymentPlanExternalData

  return (
    <Box>
      <Text marginBottom={3}>
        {formatMessage(employer.general.pageDescription)}
      </Text>
      <Box marginBottom={[4, 4, 8]}>
        {/* TODO: Handle null values? */}
        <InfoBox
          title={`${
            externalData.paymentPlanPrerequisites?.data?.conditions?.disposableIncome.toLocaleString(
              'is-IS',
            ) || 0
          } kr.`}
          text={formatMessage(employer.labels.yourDisposableIncome)}
        />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(employer.labels.minimumMonthlyPayment)}
      </Text>
      <Text marginBottom={4}>
        {formatMessage(employer.labels.minimumMonthlyPaymentDescription)}
      </Text>
      {/* TODO: Handle null values? */}
      <InfoBox
        title={`${
          externalData.paymentPlanPrerequisites?.data?.conditions?.minPayment.toLocaleString(
            'is-IS',
          ) || 0
        } kr.`}
        text={formatMessage(employer.labels.yourMinimumPayment)}
      />
    </Box>
  )
}
