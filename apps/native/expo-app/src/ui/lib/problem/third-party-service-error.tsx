import React from 'react'
import { useIntl } from 'react-intl'

import { ProblemTemplate } from './problem-template'
import { useOrganizationsStore } from '../../../new-stores/organizations-store'

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
    <ProblemTemplate
      variant="warning"
      {...(organizationName ? { tag: organizationName } : { showIcon: true })}
      title={intl.formatMessage({ id: 'problem.thirdParty.title' })}
      message={intl.formatMessage({ id: 'problem.thirdParty.message' })}
      size={size}
    />
  )
}
