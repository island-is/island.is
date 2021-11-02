import { useMutation } from '@apollo/client'
import { PaymentScheduleConditions } from '@island.is/api/schema'
import {
  ApplicationConfigurations,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import {
  Box,
  Button,
  Icon,
  Link,
  ModalBase,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as Sentry from '@sentry/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { errorModal } from '../../lib/messages'
import { PaymentPlanExternalData } from '../../types'
import * as styles from './PrerequisitesErrorModal.css'

interface ErrorMessageProps {
  title: string
  summary: string
  linkOne: string
  linkOneName: string
  linkTwo: string
  linkTwoName: string
}

const ErrorMessage = ({
  title,
  summary,
  linkOne,
  linkOneName,
  linkTwo,
  linkTwoName,
}: ErrorMessageProps) => {
  return (
    <Box marginBottom={7}>
      <Text variant="h1" marginBottom={2}>
        {title}
      </Text>
      <Text variant="intro" marginBottom={3}>
        {summary}
      </Text>
      <Stack space={2}>
        <Link href={linkOne} newTab={true}>
          <Button variant="text" icon="open" iconType="outline">
            {linkOneName}
          </Button>
        </Link>
        <Link href={linkTwo} newTab={true}>
          <Button variant="text" icon="open" iconType="outline">
            {linkTwoName}
          </Button>
        </Link>
      </Stack>
    </Box>
  )
}

export const PrerequisitesErrorModal = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => {
        throw Sentry.captureException(e.message)
      },
    },
  )

  const submitAndMoveToApplicationScreen = async () => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: DefaultEvents.ABORT,
        },
      },
    })

    if (res?.data) {
      history.push(`/${ApplicationConfigurations.PublicDebtPaymentPlan.slug}`)
    }
  }

  const prerequisites = (application.externalData as PaymentPlanExternalData)
    .paymentPlanPrerequisites?.data?.conditions as PaymentScheduleConditions

  const ShowErrorMessage = () => {
    if (prerequisites.maxDebt)
      return (
        <ErrorMessage
          title={formatMessage(errorModal.maxDebtModal.title)}
          summary={formatMessage(errorModal.maxDebtModal.summary)}
          linkOne={formatMessage(errorModal.maxDebtModal.linkOne)}
          linkOneName={formatMessage(errorModal.maxDebtModal.linkOneName)}
          linkTwo={formatMessage(errorModal.maxDebtModal.linkTwo)}
          linkTwoName={formatMessage(errorModal.maxDebtModal.linkTwoName)}
        />
      )
    if (
      !prerequisites.taxReturns ||
      !prerequisites.vatReturns ||
      !prerequisites.citReturns ||
      !prerequisites.accommodationTaxReturns ||
      !prerequisites.withholdingTaxReturns ||
      !prerequisites.wageReturns
    )
      return (
        <ErrorMessage
          title={formatMessage(errorModal.estimationOfReturns.title)}
          summary={formatMessage(errorModal.estimationOfReturns.summary)}
          linkOne={formatMessage(errorModal.estimationOfReturns.linkOne)}
          linkOneName={formatMessage(
            errorModal.estimationOfReturns.linkOneName,
          )}
          linkTwo={formatMessage(errorModal.estimationOfReturns.linkTwo)}
          linkTwoName={formatMessage(
            errorModal.estimationOfReturns.linkTwoName,
          )}
        />
      )
    // This happens if prerequisites.collectionActions || !prerequisites.doNotOwe
    // or by some magic the user gets through with other error
    return (
      <ErrorMessage
        title={formatMessage(errorModal.defaultPaymentCollection.title)}
        summary={formatMessage(errorModal.defaultPaymentCollection.summary)}
        linkOne={formatMessage(errorModal.defaultPaymentCollection.linkOne)}
        linkOneName={formatMessage(
          errorModal.defaultPaymentCollection.linkOneName,
        )}
        linkTwo={formatMessage(errorModal.defaultPaymentCollection.linkTwo)}
        linkTwoName={formatMessage(
          errorModal.defaultPaymentCollection.linkTwoName,
        )}
      />
    )
  }

  return (
    <ModalBase
      baseId="prerequisitesErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      modalLabel="Error prompt"
      hideOnClickOutside={false}
    >
      <Box
        className={styles.close}
        onClick={() => submitAndMoveToApplicationScreen()}
        role="button"
        aria-label="close button"
      >
        <Icon icon="close" size="large" color="blue400" />
      </Box>
      <Box background="white" padding={10}>
        {<ShowErrorMessage />}
        <Box display="flex" justifyContent="flexStart">
          <Button
            variant="ghost"
            loading={loadingSubmit}
            onClick={() => submitAndMoveToApplicationScreen()}
          >
            {formatMessage(errorModal.labels.closeModal)}
          </Button>
        </Box>
      </Box>
    </ModalBase>
  )
}
