import { useQuery } from '@apollo/client'
import {
  AuthScopeCategoryBySlugDocument,
  AuthScopeCategoryBySlugQuery,
  AuthScopeTagBySlugDocument,
  AuthScopeTagBySlugQuery,
} from '../ServiceCategories/ServiceCategories.generated'
import { useLocale } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { IntroHeader } from '@island.is/portals/core'
import { ScopesTable } from '../../components/ScopesTable/ScopesTable'
import { Box, Button, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { AuthApiScope } from '@island.is/api/schema'
import { useDelegationForm } from '../../context/DelegationFormContext'
import add from 'date-fns/add'
import { useEffect, useState } from 'react'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { FlowStep, FlowStepper } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { m as coreMessages } from '@island.is/portals/core'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'

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
  } = useQuery<AuthScopeCategoryBySlugQuery>(AuthScopeCategoryBySlugDocument, {
    variables: { slug: slug ?? '', lang },
    skip: !slug,
  })
  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery<AuthScopeTagBySlugQuery>(AuthScopeTagBySlugDocument, {
    variables: { slug: slug ?? '', lang },
    skip: !slug,
  })
  const { selectedScopes, setSelectedScopes, setIdentities, clearForm } =
    useDelegationForm()
  const defaultDate = add(new Date(), { years: 1 })

  const data =
    categoriesData?.authScopeCategoryBySlug ?? tagsData?.authScopeTagBySlug

  const loading = categoriesLoading || tagsLoading
  const error = categoriesError || tagsError

  const onSelectScope = (scope: AuthApiScope) => {
    if (selectedScopes.some((s) => s.name === scope.name)) {
      setSelectedScopes(selectedScopes.filter((s) => s.name !== scope.name))
    } else {
      setSelectedScopes([...selectedScopes, { ...scope, validTo: defaultDate }])
    }
  }

  // clear the state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

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
    },
    {
      id: 'access-recipients',
      name: formatMessage(m.chooseRecipientsLabel),
      content: <AccessRecipients methods={methods} />,
      onContinue: () => {
        setIdentities(watchIdentities)
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
    !error && (
      <div>
        <IntroHeader
          title={data?.title ?? ''}
          intro={data?.description ?? ''}
        />

        {!showFlow && (
          <>
            <Text variant="h5">{formatMessage(m.delegationsThatSuit)}</Text>
            <Box paddingTop={2} paddingBottom={4}>
              <ScopesTable
                scopes={data?.scopes as AuthApiScope[]}
                showCheckbox
                onSelectScope={onSelectScope}
              />
              {loading && (
                <SkeletonLoader width="100%" height={50} repeat={4} />
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
            backButtonLabel={formatMessage(m.backButton)}
          />
        )}
        <ConfirmAccessModal
          onClose={() => setIsConfirmModalVisible(false)}
          isVisible={isConfirmModalVisible}
        />
      </div>
    )
  )
}
