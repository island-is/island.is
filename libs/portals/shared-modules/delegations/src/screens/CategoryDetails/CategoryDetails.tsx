import { useQuery } from '@apollo/client'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
} from '../ServiceCategories/ServiceCategories.generated'
import { useLocale } from '@island.is/localization'
import { useNavigate, useParams } from 'react-router-dom'
import { IntroHeader } from '@island.is/portals/core'
import { ScopesTable } from '../../components/ScopesTable/ScopesTable'
import { Box, Button, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { AuthApiScope } from '@island.is/api/schema'
import { useDelegationForm } from '../../context/DelegationFormContext'
import add from 'date-fns/add'
import { useState } from 'react'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { FlowStep, FlowStepper } from '../../components/FlowStepper'
import { useForm } from 'react-hook-form'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { m as coreMessages } from '@island.is/portals/core'
import { DelegationPaths } from '../../lib/paths'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { useCreateAuthDelegationsMutation } from '../GrantAccessNew/GrantAccessNew.generated'

export const CategoryDetails = () => {
  const { lang } = useLocale()
  const { slug } = useParams()
  const { formatMessage } = useLocale()
  const [showFlow, setShowFlow] = useState(false)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<AuthScopeCategoriesQuery>(AuthScopeCategoriesDocument, {
    variables: { lang },
  })
  const { selectedScopes, setSelectedScopes, setIdentities } =
    useDelegationForm()
  const defaultDate = add(new Date(), { years: 1 })

  const category = categoriesData?.authScopeCategories?.find(
    (category) => category.slug === slug,
  )

  const [createAuthDelegations, { loading: mutationLoading }] =
    useCreateAuthDelegationsMutation()

  const navigate = useNavigate()

  const onSelectScope = (scope: AuthApiScope) => {
    if (selectedScopes.some((s) => s.name === scope.name)) {
      setSelectedScopes(selectedScopes.filter((s) => s.name !== scope.name))
    } else {
      setSelectedScopes([...selectedScopes, { ...scope, validTo: defaultDate }])
    }
  }

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
      id: 'select-permissions',
      name: formatMessage(m.choosePermissionsLabel),
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.chooseRecipientsButtonLabel),
      continueButtonIcon: 'arrowForward',
      onContinue: () => {
        setActiveStep(activeStep + 1)
      },
    },
    {
      id: 'access-recipients',
      name: formatMessage(m.chooseRecipientsLabel),
      content: <AccessRecipients methods={methods} />,
      onContinue: () => {
        setIdentities(watchIdentities)
        setActiveStep(activeStep + 1)
      },
      continueButtonDisabled:
        !formState.isValid ||
        watchIdentities.some(
          (identity) => identity.nationalId.length < 10 || !identity.name,
        ),
      continueButtonLabel: formatMessage(m.choosePeriodButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-period',
      name: formatMessage(m.choosePeriodLabel),
      content: <AccessPeriod />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
      continueButtonLabel: formatMessage(m.confirmAccessButtonLabel),
      continueButtonIcon: 'checkmark',
    },
  ]

  return (
    !categoriesError && (
      <div>
        <IntroHeader
          title={category?.title ?? ''}
          intro={category?.description ?? ''}
        />

        {!showFlow && (
          <>
            <Text variant="h5">{formatMessage(m.delegationsThatSuit)}</Text>
            <Box paddingTop={2} paddingBottom={4}>
              <ScopesTable
                scopes={category?.scopes ?? []}
                onSelectScope={onSelectScope}
                selectedScopes={selectedScopes}
              />
              {categoriesLoading && (
                <>
                  <SkeletonLoader width="100%" height={50} />
                  <SkeletonLoader width="100%" height={50} />
                  <SkeletonLoader width="100%" height={50} />
                  <SkeletonLoader width="100%" height={50} />
                </>
              )}
            </Box>
            <Button
              variant="primary"
              disabled={selectedScopes.length === 0}
              onClick={() => setShowFlow(true)}
              icon="personAdd"
              iconType="outline"
            >
              {formatMessage(m.grantDelegation)}{' '}
              {selectedScopes.length > 0 ? `(${selectedScopes.length})` : ''}
            </Button>
          </>
        )}
        {showFlow && (
          <FlowStepper
            steps={steps}
            cancelButtonLabel={formatMessage(coreMessages.buttonCancel)}
            onCancel={() => setShowFlow(false)}
            activeStep={activeStep}
            onStepChange={setActiveStep}
          />
        )}
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
      </div>
    )
  )
}
