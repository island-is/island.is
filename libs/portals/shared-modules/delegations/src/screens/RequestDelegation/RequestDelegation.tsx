import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isCompany } from 'kennitala'

import {
  AlertMessage,
  Box,
  FlowStep,
  FlowStepper,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { InputController, SelectController } from '@island.is/shared/form-fields'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  takeDelegationRequestGrantor,
  DELEGATION_REQUEST_SCOPES_PARAM,
  IntroHeader,
  m as coreMessages,
} from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useDelegationForm } from '../../context'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { RequestConfirmModal } from '../../components/modals/RequestConfirmModal'

interface RequestDetailsFormData {
  relationship: string
  reason: string
}

type GrantorType = 'company' | 'individual'

const RELATIONSHIP_OPTIONS: {
  value: string
  label: MessageDescriptor
  grantorTypes: GrantorType[]
}[] = [
  { value: 'parent', label: m.relationshipOptionParent, grantorTypes: ['individual'] },
  { value: 'child', label: m.relationshipOptionChild, grantorTypes: ['individual'] },
  { value: 'spouse', label: m.relationshipOptionSpouse, grantorTypes: ['individual'] },
  {
    value: 'caregiver',
    label: m.relationshipOptionCaregiver,
    grantorTypes: ['individual'],
  },
  {
    value: 'accountant',
    label: m.relationshipOptionAccountant,
    grantorTypes: ['individual', 'company'],
  },
  {
    value: 'bookkeeper',
    label: m.relationshipOptionBookkeeper,
    grantorTypes: ['individual', 'company'],
  },
  {
    value: 'lawyer',
    label: m.relationshipOptionLawyer,
    grantorTypes: ['individual', 'company'],
  },
  { value: 'employee', label: m.relationshipOptionEmployee, grantorTypes: ['company'] },
  {
    value: 'advisor',
    label: m.relationshipOptionAdvisor,
    grantorTypes: ['individual', 'company'],
  },
  {
    value: 'other',
    label: m.relationshipOptionOther,
    grantorTypes: ['individual', 'company'],
  },
]

const resolveRelationship = (
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
  values: RequestDetailsFormData,
): string => {
  const option = RELATIONSHIP_OPTIONS.find((o) => o.value === values.relationship)
  return option ? formatMessage(option.label) : values.relationship
}

const RequestDetails = ({
  methods,
  grantorType,
}: {
  methods: ReturnType<typeof useForm<RequestDetailsFormData>>
  grantorType?: GrantorType
}) => {
  const { formatMessage } = useLocale()
  const { control } = methods

  const relationshipOptions = RELATIONSHIP_OPTIONS.filter(
    (o) => !grantorType || o.grantorTypes.includes(grantorType),
  )

  const selectedRelationship = methods.watch('relationship')
  useEffect(() => {
    if (
      selectedRelationship &&
      !relationshipOptions.some((o) => o.value === selectedRelationship)
    ) {
      methods.setValue('relationship', '', { shouldValidate: true })
    }
  }, [selectedRelationship, relationshipOptions, methods])

  return (
    <FormProvider {...methods}>
      <Text variant="h3" marginBottom={4}>
        {formatMessage(m.requestDetailsTitle)}
      </Text>
      <Box display="flex" flexDirection="column" rowGap={3}>
        <SelectController
          id="relationship"
          name="relationship"
          label={formatMessage(m.requestRelationshipLabel)}
          placeholder={formatMessage(m.requestRelationshipPlaceholder)}
          backgroundColor="blue"
          options={relationshipOptions.map((o) => ({
            value: o.value,
            label: formatMessage(o.label),
          }))}
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
  const userInfo = useUserInfo()
  const navigate = useNavigate()

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {
    setIdentities,
    selectedScopes,
    setSelectedScopes,
    clearForm,
    setRequestedScopeNames,
  } = useDelegationForm()

  const [searchParams] = useSearchParams()

  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  useEffect(() => {
    const scopes = searchParams.get(DELEGATION_REQUEST_SCOPES_PARAM)
    if (scopes) {
      setRequestedScopeNames(scopes.split(',').filter(Boolean))
    }
  }, [searchParams, setRequestedScopeNames])

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

  // Not memoised: RHF watch() returns a mutated, referentially stable array.
  const grantorTypes = new Set(
    watchIdentities
      .filter((identity) => identity.nationalId.length >= 10)
      .map((identity) =>
        isCompany(identity.nationalId) ? 'company' : 'individual',
      ),
  )
  const requestGrantorType =
    grantorTypes.size === 1
      ? (Array.from(grantorTypes)[0] as 'company' | 'individual')
      : undefined
  const hasMixedGrantorTypes = grantorTypes.size > 1

  const prevGrantorTypeRef = useRef<'company' | 'individual' | undefined>(
    requestGrantorType,
  )
  useEffect(() => {
    if (!requestGrantorType) return
    const previous = prevGrantorTypeRef.current
    if (
      previous &&
      previous !== requestGrantorType &&
      selectedScopes.length > 0
    ) {
      if (
        window.confirm(formatMessage(m.requestChangeGranterTypeClearScopes))
      ) {
        setSelectedScopes([])
      }
    }
    prevGrantorTypeRef.current = requestGrantorType
  }, [requestGrantorType, selectedScopes.length, formatMessage, setSelectedScopes])

  useEffect(() => {
    const grantor = takeDelegationRequestGrantor(userInfo)
    if (grantor) {
      recipientMethods.setValue('identities', [grantor], {
        shouldValidate: true,
      })
    }
  }, [recipientMethods, userInfo])

  const steps: FlowStep[] = [
    {
      id: 'request-granter',
      name: formatMessage(m.requestChooseGranterLabel),
      content: (
        <Box display="flex" flexDirection="column" rowGap={3}>
          <AccessRecipients
            methods={recipientMethods}
            allowCompany
            title={m.requestChooseGranterTitle}
            nationalIdLabel={m.requestGranterNationalIdLabel}
            sameSsnMessage={m.requestSameSsnError}
          />
          {hasMixedGrantorTypes && (
            <AlertMessage
              type="warning"
              title={formatMessage(m.requestMixedGranterTypesTitle)}
              message={formatMessage(m.requestMixedGranterTypesMessage)}
            />
          )}
          <RequestDetails
            methods={detailsMethods}
            grantorType={requestGrantorType}
          />
        </Box>
      ),
      onContinue: () => {
        setIdentities(watchIdentities)
      },
      continueButtonDisabled:
        !recipientMethods.formState.isValid ||
        !detailsMethods.formState.isValid ||
        hasMixedGrantorTypes ||
        watchIdentities.some(
          (identity) => identity.nationalId.length < 10 || !identity.name,
        ),
      continueButtonLabel: formatMessage(m.requestChooseGranterButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'request-scopes',
      name: formatMessage(m.choosePermissionsLabel),
      content: (
        <AccessScopes
          title={m.requestChooseScopesTitle}
          requestCatalog
          requestGrantorType={requestGrantorType}
        />
      ),
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.requestChooseScopesButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'request-period',
      name: formatMessage(m.choosePeriodLabel),
      content: <AccessPeriod />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
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
          relationship={resolveRelationship(
            formatMessage,
            detailsMethods.getValues(),
          )}
          reason={detailsMethods.getValues('reason')}
          onSuccess={() => {
            toast.success(formatMessage(m.requestSuccess))
            navigate(DelegationPaths.DelegationRequestsList)
          }}
        />
      </div>
    </>
  )
}

export default RequestDelegation
