import { useMutation } from '@apollo/client'
import { PaymentScheduleConditions } from '@island.is/api/schema'
import {
  ApplicationConfigurations,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { Box, Button, Link, ModalBase, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { errorModal } from '../../lib/messages'
import { formatIsk } from '../../lib/paymentPlanUtils'
import { PaymentPlanExternalData } from '../../types'
import * as styles from './PrerequisitesErrorModal.treat'

export const PrerequisitesErrorModal = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => {
        // TODO: Log to Sentry
        throw new Error(e.message)
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

  if (!prerequisites.maxDebt) return null

  return (
    <ModalBase
      baseId="prerequisitesErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      modalLabel="Error prompt"
      hideOnClickOutside={false}
    >
      <Box background="white" padding={10}>
        <Text variant="h1" marginBottom={2}>
          {formatMessage(errorModal.maxDebtTitle)}
        </Text>
        <Text variant="intro" marginBottom={7}>
          {formatMessage(errorModal.maxDebtDescription, {
            maxDebtAmount: formatIsk(prerequisites.maxDebtAmount),
          })}
        </Text>
        <Box display="flex" justifyContent="spaceBetween">
          <Button
            colorScheme="destructive"
            variant="ghost"
            loading={loadingSubmit}
            onClick={() => submitAndMoveToApplicationScreen()}
          >
            {formatMessage(errorModal.closeModal)}
          </Button>
          <Link href="https://www.skatturinn.is/" newTab={true}>
            <Button>{formatMessage(errorModal.moreInformation)}</Button>
          </Link>
        </Box>
      </Box>
    </ModalBase>
  )
}
