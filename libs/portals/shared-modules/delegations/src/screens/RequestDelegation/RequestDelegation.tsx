import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  FlowStep,
  FlowStepper,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, m as coreMessages } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useDelegationForm } from '../../context'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { RequestConfirmModal } from '../../components/modals/RequestConfirmModal'

interface RequestDetailsFormData {
  relationship: string
  reason: string
}

const RequestDetails = ({
  methods,
}: {
  methods: ReturnType<typeof useForm<RequestDetailsFormData>>
}) => {
  const { formatMessage } = useLocale()
  const { control } = methods

  return (
    <FormProvider {...methods}>
      <Text variant="h3" marginBottom={4}>
        {formatMessage(m.requestDetailsTitle)}
      </Text>
      <Box display="flex" flexDirection="column" rowGap={3}>
        <InputController
          control={control}
          id="relationship"
          name="relationship"
          label={formatMessage(m.requestRelationshipLabel)}
          placeholder={formatMessage(m.requestRelationshipPlaceholder)}
          textarea
          rows={3}
          maxLength={1024}
          backgroundColor="blue"
          rules={{
            required: {
              value: true,
              message: formatMessage(m.requestRelationshipRequired),
            },
          }}
        />
        <InputController
          control={control}
          id="reason"
          name="reason"
          label={formatMessage(m.requestReasonLabel)}
          placeholder={formatMessage(m.requestReasonPlaceholder)}
          textarea
          rows={3}
          maxLength={1024}
          backgroundColor="blue"
          rules={{
            required: {
              value: true,
              message: formatMessage(m.requestReasonRequired),
            },
          }}
        />
      </Box>
    </FormProvider>
  )
}

const RequestDelegation = () => {
  useNamespaces(['sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const { setIdentities, selectedScopes, clearForm } = useDelegationForm()

  // clear the shared wizard state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  const recipientMethods = useForm<{
    identities: Array<{ nationalId: string; name: string }>
  }>({
    mode: 'onChange',
    defaultValues: {
      identities: [{ nationalId: '', name: '' }],
    },
  })

  const detailsMethods = useForm<RequestDetailsFormData>({
    mode: 'onChange',
    defaultValues: {
      relationship: '',
      reason: '',
    },
  })

  const watchIdentities = recipientMethods.watch('identities')

  const steps: FlowStep[] = [
    {
      id: 'request-granter',
      name: formatMessage(m.requestChooseGranterLabel),
      content: (
        <AccessRecipients
          methods={recipientMethods}
          allowCompany
          singleRecipient
          title={m.requestChooseGranterTitle}
          nationalIdLabel={m.requestGranterNationalIdLabel}
          sameSsnMessage={m.requestSameSsnError}
        />
      ),
      onContinue: () => {
        setIdentities(watchIdentities)
      },
      continueButtonDisabled:
        !recipientMethods.formState.isValid ||
        watchIdentities.some(
          (identity) => identity.nationalId.length < 10 || !identity.name,
        ),
      continueButtonLabel: formatMessage(m.requestChooseGranterButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'request-scopes',
      name: formatMessage(m.choosePermissionsLabel),
      content: <AccessScopes title={m.requestChooseScopesTitle} />,
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.requestChooseScopesButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'request-details',
      name: formatMessage(m.requestDetailsTitle),
      content: <RequestDetails methods={detailsMethods} />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
      continueButtonDisabled: !detailsMethods.formState.isValid,
      continueButtonLabel: formatMessage(m.requestDetailsButtonLabel),
      continueButtonIcon: 'checkmark',
    },
  ]

  return (
    <>
      <IntroHeader
        title={formatMessage(m.requestDelegationTitle)}
        intro={defineMessage(m.requestDelegationIntro)}
        marginBottom={4}
      />
      <div>
        <FlowStepper
          steps={steps}
          cancelButtonLabel={formatMessage(coreMessages.buttonCancel)}
          onCancel={() => {
            navigate(DelegationPaths.DelegationsNew)
          }}
          backButtonLabel={formatMessage(m.backButton)}
        />

        <RequestConfirmModal
          isVisible={isConfirmModalVisible}
          onClose={() => setIsConfirmModalVisible(false)}
          relationship={detailsMethods.getValues('relationship')}
          reason={detailsMethods.getValues('reason')}
          onSuccess={() => {
            toast.success(formatMessage(m.requestSuccess))
            navigate(DelegationPaths.DelegationsNew)
          }}
        />
      </div>
    </>
  )
}

export default RequestDelegation
