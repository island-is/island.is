import { Box } from '@island.is/island-ui/core'
import { OrganizationFooter, ServiceWebFooter } from '@island.is/web/components'
import { Organization } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { shouldShowInstitutionContactBanner } from '@island.is/web/screens/ServiceWeb/utils'

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

  const contactLink = shouldShowInstitutionContactBanner(slug)
    ? linkResolver('servicewebcontact', [slug]).href
    : namespace?.serviceWebContactLink

  return (
    <Box marginTop="auto">
      {organization?.footerItems?.length > 0 ? (
        <OrganizationFooter organizations={[organization]} />
      ) : (
        <ServiceWebFooter
          title={organization?.title ?? ''}
          logoSrc={organization?.logo?.url}
          phone={organization?.phone}
          contactLink={contactLink}
          contactLinkLabel={namespace?.serviceWebContactLinkLabel}
          namespace={namespace}
        />
      )}
    </Box>
  )
}

export default DynamicFooter
