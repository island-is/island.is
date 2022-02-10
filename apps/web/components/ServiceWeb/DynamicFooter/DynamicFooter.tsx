import React from 'react'
import { Organization } from '@island.is/web/graphql/schema'

import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  OrganizationFooter,
  footerEnabled,
  ServiceWebFooter,
} from '@island.is/web/components'

interface DynamicFooterProps {
  organization: Organization
  institutionSlug: string
}

export const DynamicFooter = ({
  organization,
  institutionSlug,
}: DynamicFooterProps) => {
  const { linkResolver } = useLinkResolver()

  const slug = organization?.slug || institutionSlug

  if (!slug) {
    return null
  }

  const contactLink = `${linkResolver('serviceweb').href}/${slug}/hafa-samband`

  return footerEnabled.includes(slug) ? (
    <OrganizationFooter organizations={[organization]} />
  ) : (
    <ServiceWebFooter
      title={organization.title}
      logoSrc={organization.logo?.url}
      phone={organization.phone}
      contactLink={contactLink}
    />
  )
}

export default DynamicFooter
