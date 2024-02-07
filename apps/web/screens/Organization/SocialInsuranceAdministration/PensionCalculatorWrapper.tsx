import { PropsWithChildren } from 'react'

import {
  HeadWithSocialSharing,
  OrganizationFooter,
  OrganizationHeader,
} from '@island.is/web/components'
import { Organization, OrganizationPage } from '@island.is/web/graphql/schema'

interface PensionCalculatorWrapperProps {
  organizationPage: OrganizationPage
  organization: Organization
  ogTitle: string
  ogDescription?: string
  ogImageUrl: string | undefined
}

export const PensionCalculatorWrapper = ({
  organizationPage,
  organization,
  ogTitle,
  ogDescription,
  ogImageUrl,
  children,
}: PropsWithChildren<PensionCalculatorWrapperProps>) => {
  return (
    <>
      <HeadWithSocialSharing
        title={ogTitle}
        description={ogDescription}
        imageUrl={ogImageUrl}
      >
        <meta name="robots" content="noindex, nofollow" />
      </HeadWithSocialSharing>
      <OrganizationHeader organizationPage={organizationPage} />
      {children}
      <OrganizationFooter organizations={[organization]} />
    </>
  )
}
