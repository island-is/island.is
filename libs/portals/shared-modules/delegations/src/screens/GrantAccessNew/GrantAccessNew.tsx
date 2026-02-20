import { useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate, useLoaderData } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
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
import { useCreateAuthDelegationsMutation } from './GrantAccessNew.generated'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  const { formatMessage } = useLocale()
  const { setIdentities, selectedScopes } = useDelegationForm()

  const navigate = useNavigate()

  const [createAuthDelegations, { loading: mutationLoading }] =
    useCreateAuthDelegationsMutation()

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
      name: formatMessage(m.stepOneLabel),
      content: <AccessRecipients methods={methods} />,
      onContinue: () => {
        setIdentities(watchIdentities)
      },
      continueButtonDisabled:
        !formState.isValid ||
        watchIdentities.some(
          (identity) => identity.nationalId.length < 10 || !identity.name,
        ),
      continueButtonLabel: formatMessage(m.stepOneContinueButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-permissions',
      name: formatMessage(m.StepTwoLabel),
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.stepTwoContinueButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-period',
      name: formatMessage(m.stepThreeLabel),
      content: <AccessPeriod />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
      continueButtonLabel: formatMessage(m.stepThreeContinueButtonLabel),
      continueButtonIcon: 'checkmark',
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
            const scopes = selectedScopes
              .map((scope) => {
                if (!scope.domain?.name || !scope.validTo) {
                  return null
                }
                return {
                  name: scope.name,
                  validTo: scope.validTo,
                  domainName: scope.domain.name,
                }
              })
              .filter((scope) => scope !== null)

            createAuthDelegations({
              variables: {
                input: {
                  toNationalIds: watchIdentities.map(
                    (identity) => identity.nationalId,
                  ),
                  scopes,
                },
              },
            }).then(() => {
              navigate(DelegationPaths.DelegationsNew)
            })
          }}
          loading={mutationLoading}
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
