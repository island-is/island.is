import { Organization } from '@island.is/web/graphql/schema'

import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationFooter, ServiceWebFooter } from '@island.is/web/components'

interface DynamicFooterProps {
  organization: Organization
  institutionSlug: string
  namespace: Record<string, string>
}

export const DynamicFooter = ({
  organization,
  institutionSlug,
  namespace,
}: DynamicFooterProps) => {
  const { linkResolver } = useLinkResolver()

  const slug = organization?.slug || institutionSlug

  if (!slug) {
    return null
  }

  const contactLink = linkResolver('servicewebcontact', [slug]).href

  return organization.footerItems?.length > 0 ? (
    <OrganizationFooter organizations={[organization]} />
  ) : (
    <ServiceWebFooter
      title={organization.title}
      logoSrc={organization.logo?.url}
      phone={organization.phone}
      contactLink={contactLink}
      namespace={namespace}
    />
  )
}

export default DynamicFooter
