import { useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate, useLoaderData } from 'react-router-dom'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'
import { useDelegationForm } from '../../context'
import { FlowStep, FlowStepper } from '../../components/FlowStepper'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { m as coreMessages } from '@island.is/portals/core'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { useState } from 'react'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  const { formatMessage } = useLocale()
  const { setIdentities, selectedScopes } = useDelegationForm()

  const navigate = useNavigate()

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      identities: [{ nationalId: '', name: '' }],
    },
  })
  const { formState, watch } = methods

  const watchIdentities = watch('identities')

  const steps: FlowStep[] = [
    {
      id: 'access-recipients',
      name: 'Velja umboðshafa', // TODO: Translate
      content: <AccessRecipients methods={methods} />,
      onContinue: () => {
        setIdentities(watchIdentities)
      },
      continueButtonDisabled:
        !formState.isValid ||
        watchIdentities.some(
          (identity) => identity.nationalId.length < 10 || !identity.name,
        ),
    },
    {
      id: 'select-permissions',
      name: 'Velja réttindi', // TODO: Translate
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
    },
    {
      id: 'select-period',
      name: 'Velja gildistíma', // TODO: Translate
      content: <AccessPeriod />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
    },
  ]

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantAccessStepsTitle)}
        intro={defineMessage(m.grantAccessStepsIntro)}
        marginBottom={4}
      />
      <div>
        <Text variant="h4" marginBottom={4}>
          {formatMessage(m.addPeopleTitle)}
        </Text>

        <FlowStepper
          steps={steps}
          cancelButtonLabel={formatMessage(coreMessages.buttonCancel)}
          onCancel={() => {
            navigate(DelegationPaths.DelegationsNew)
          }}
        />

        <ConfirmAccessModal
          onClose={() => setIsConfirmModalVisible(false)}
          onConfirm={() => {
            console.log('confirm')
          }}
          isVisible={isConfirmModalVisible}
        />

        {contentfulData?.faqList && (
          <Box paddingTop={8}>
            <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </div>
    </>
  )
}

export default GrantAccess
