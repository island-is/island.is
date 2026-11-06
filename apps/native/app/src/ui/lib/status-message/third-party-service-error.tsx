import React from 'react'
import { useIntl } from 'react-intl'

import { StatusMessageTemplate } from './status-message-template'
import { useOrganizationsStore } from '../../../stores/organizations-store'

type ThirdPartyServiceErrorProps = {
  organizationSlug: string
  size: 'small' | 'large'
}

export const ThirdPartyServiceError = ({
  organizationSlug,
  size,
}: ThirdPartyServiceErrorProps) => {
  const intl = useIntl()

  const { getOrganizationNameBySlug } = useOrganizationsStore()
  const organizationName = getOrganizationNameBySlug(organizationSlug)

  return (
    <StatusMessageTemplate
      variant="warning"
      {...(organizationName ? { tag: organizationName } : { showIcon: true })}
      title={intl.formatMessage({ id: 'problem.thirdParty.title' })}
      message={intl.formatMessage({ id: 'problem.thirdParty.message' })}
      size={size}
    />
  )
}
