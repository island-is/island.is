import { useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  useGetServicePortalPageQuery,
} from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { useDelegationForm } from '../../context'
import { FlowStep, FlowStepper } from '@island.is/island-ui/core'
import { AccessRecipients } from '../../components/GrantAccessSteps/AccessRecipients'
import { m as coreMessages } from '@island.is/portals/core'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { useEffect, useState } from 'react'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const { setIdentities, selectedScopes, clearForm } = useDelegationForm()

  const navigate = useNavigate()

  // clear the state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  const { data: contentfulQueryData } = useGetServicePortalPageQuery({
    variables: { input: { slug: 'umbod/veita', lang } },
  })
  const contentfulData = contentfulQueryData?.getServicePortalPage
  const faqList = isCompany(userInfo)
    ? contentfulData?.faqListCompany
    : contentfulData?.faqList

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
      continueButtonLabel: formatMessage(m.choosePermmissionsButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-permissions',
      name: formatMessage(m.choosePermissionsLabel),
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
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
          backButtonLabel={formatMessage(m.backButton)}
        />

        <ConfirmAccessModal
          onClose={() => setIsConfirmModalVisible(false)}
          isVisible={isConfirmModalVisible}
        />

        {faqList && faqList.questions.length > 0 && (
          <Box paddingTop={8}>
            <FaqList {...(faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </div>
    </>
  )
}

export default GrantAccess
