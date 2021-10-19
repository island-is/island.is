import React from 'react'
import { Organization } from '@island.is/web/graphql/schema'

import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
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
  const { linkResolver } = useLinkResolver()

  if (!organization || !institutionSlug) {
    return null
  }

  const contactLink = `${
    linkResolver('helpdesk').href
  }/${institutionSlug}/hafa-samband`

  return footerEnabled.includes(institutionSlug) ? (
    <OrganizationFooter organizations={[organization]} />
  ) : (
    <ServiceWebFooter
      title={organization.title}
      logoSrc={organization.logo.url}
      phone={organization.phone}
      contactLink={contactLink}
    />
  )
}

export default Footer
