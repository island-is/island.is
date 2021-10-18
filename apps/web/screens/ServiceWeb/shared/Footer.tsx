import React from 'react'
import { Organization } from '@island.is/web/graphql/schema'

import {
  OrganizationFooter,
  footerEnabled,
  ServiceWebFooter,
} from '@island.is/web/components'

interface FooterProps {
  organization: Organization
  institutionSlug: string
}

const Footer = ({ organization, institutionSlug }: FooterProps) => {
  if (!organization || !institutionSlug) {
    return null
  }

  return footerEnabled.includes(institutionSlug) ? (
    <OrganizationFooter organizations={[organization]} />
  ) : (
    <ServiceWebFooter
      title={organization.title}
      logoSrc={organization.logo.url}
      contactLink="/s/stafraent-island/hafa-samband"
      phone={organization.phone}
    />
  )
}

export default Footer
