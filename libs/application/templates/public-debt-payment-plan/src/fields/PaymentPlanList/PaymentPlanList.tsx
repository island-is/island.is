import React from 'react'
import { mergeAnswers, RepeaterProps } from '@island.is/application/core'
import { useMockPayments } from './mockPayments'
import {
  AlertMessage,
  Box,
  Button,
  LoadingIcon,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { useFormContext } from 'react-hook-form'
import { isPaymentPlanFulfilledField } from '../../shared/constants'
import { PublicDebtPaymentPlan } from '../../lib/dataSchema'

export const PaymentPlanList = ({
  error,
  expandRepeater,
  answerQuestions,
  application,
}: RepeaterProps) => {
  const { payments, loading } = useMockPayments()
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const answers = application.answers as PublicDebtPaymentPlan

  const handlePaymentClick = (id: string) => {
    const newAnswers = mergeAnswers(answers, {
      paymentPlanContext: {
        ...answers.paymentPlanContext,
        activePayment: id,
      },
    })
    answerQuestions(newAnswers)

    setTimeout(() => {
      expandRepeater()
    }, 100)
  }

  const errors = (error as any) as {
    isFulfilled: string
  }

  return (
    <Box>
      <Text marginBottom={3}>
        {formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      <input
        type="hidden"
        id={isPaymentPlanFulfilledField}
        name={isPaymentPlanFulfilledField}
        ref={register}
        value="value?"
      />
      {loading && (
        <Box display="flex" justifyContent="center" paddingY={6}>
          <LoadingIcon size={40} />
        </Box>
      )}
      {payments.map((payment, index) => (
        <Box
          paddingY={3}
          paddingX={4}
          border="standard"
          borderRadius="large"
          marginBottom={3}
          key={index}
        >
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="eyebrow" color="purple400">
              {payment.organization}
            </Text>
            <Tag variant="purple">Þessi skuld verður send sem krafa</Tag>
          </Box>
          <Text variant="h3" marginBottom={3}>
            {payment.paymentSchedule}
          </Text>
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="primary"
              size="small"
              icon="arrowForward"
              iconType="outline"
              onClick={handlePaymentClick.bind(null, payment.id)}
            >
              Greiðsludreifa skuld
            </Button>
          </Box>
        </Box>
      ))}
      {errors && errors.isFulfilled ? (
        <AlertMessage
          type="info"
          title="Skylda er að greiðsludreifa öllum skuldum áður en haldið er áfram"
        />
      ) : null}
    </Box>
  )
}
