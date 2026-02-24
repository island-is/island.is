import { defineMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { useDelegationForm } from '../../context'
import { FlowStep, FlowStepper } from '../../components/FlowStepper'
import { m as coreMessages } from '@island.is/portals/core'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'

const EditAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  // const [isConfirmModalVisible, setIsConfirmModalVisible] =
  //   useState<boolean>(false)

  const { formatMessage } = useLocale()
  const { selectedScopes } = useDelegationForm()

  const initialIsSamePeriod =
    selectedScopes.length > 1 &&
    selectedScopes.every(
      (scope) => scope.validTo === selectedScopes[0]?.validTo,
    )

  const navigate = useNavigate()

  // const [createAuthDelegations, { loading: mutationLoading }] =
  //   useCreateAuthDelegationsMutation()

  // const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const steps: FlowStep[] = [
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
      content: <AccessPeriod initialIsSamePeriod={initialIsSamePeriod} />,
      onContinue: () => {
        // setIsConfirmModalVisible(true)
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

        {/* <ConfirmAccessModal
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
        /> */}

        {/* {contentfulData?.faqList && (
          <Box paddingTop={8}>
            <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
          </Box>
        )} */}
      </div>
    </>
  )
}

export default EditAccess
