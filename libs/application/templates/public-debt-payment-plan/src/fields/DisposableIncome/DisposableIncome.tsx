import { gql, useMutation } from '@apollo/client'
import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import kennitala from 'kennitala'
import React, { useEffect } from 'react'
import { employer } from '../../lib/messages'
import { formatIsk } from '../../lib/paymentPlanUtils'

const updateCurrentEmployerMutation = gql`
  mutation UpdateCurrentEmployer($input: UpdateCurrentEmployerInput!) {
    updateCurrentEmployer(input: $input) {
      success
    }
  }
`

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
  const [updateCurrentEmployer] = useMutation(updateCurrentEmployerMutation)

  const correctedNationalId = getValueViaPath(
    application.answers,
    'correctedEmployer.nationalId',
    '',
  ) as string
  const conditions = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites.data.conditions',
  ) as PaymentScheduleConditions
  const debts = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites.data.debts',
  ) as PaymentScheduleDebts[]

  const updateEmployer = async () => {
    const results = await updateCurrentEmployer({
      variables: {
        input: {
          employerNationalId: kennitala.sanitize(correctedNationalId),
        },
      },
    })

    if (!results.data) {
      console.error(results.errors)
    }
  }

  useEffect(() => {
    if (correctedNationalId && kennitala.isValid(correctedNationalId)) {
      updateEmployer()
    }
  }, [correctedNationalId])

  return (
    <Box>
      <Text marginBottom={3}>
        {`${formatMessage(employer.general.pageDescription)} `}
        <Link href={`${formatMessage(employer.general.taxHomePageUrl)}`} newTab>
          <Button variant="text" icon="open" iconType="outline">
            {formatMessage(employer.labels.taxHomePage)}
          </Button>
        </Link>
      </Text>
      <Box marginBottom={[3, 3, 5]}>
        <InfoBox
          title={`${
            conditions?.disposableIncome.toLocaleString('is-IS') || 0
          } kr.`}
          text={formatMessage(employer.labels.yourDisposableIncome)}
        />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(employer.labels.minimumMonthlyPayment)}
      </Text>
      <Text marginBottom={4}>
        {formatMessage(employer.labels.minimumMonthlyPaymentDescription, {
          percent: `${conditions?.percent}%`,
        })}
      </Text>
      <InfoBox
        title={`${conditions?.minPayment.toLocaleString('is-IS') || 0} kr.`}
        text={formatMessage(employer.labels.yourMinimumPayment)}
      />
      {!!conditions?.minWagePayment &&
        conditions?.minPayment < conditions?.minWagePayment &&
        debts?.find((x) => x.type === 'Wagedection') !== undefined && (
          <Box marginTop={3}>
            <AlertMessage
              type="info"
              title={formatMessage(employer.labels.alertTitle)}
              message={formatMessage(employer.labels.alertMessage, {
                minPayment: formatIsk(conditions?.minWagePayment),
              })}
            />
          </Box>
        )}
    </Box>
  )
}
