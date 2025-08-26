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
  indexableBySearchEngine?: boolean
}

export const PensionCalculatorWrapper = ({
  organizationPage,
  organization,
  ogTitle,
  ogDescription,
  ogImageUrl,
  indexableBySearchEngine = false,
  children,
}: PropsWithChildren<PensionCalculatorWrapperProps>) => {
  return (
    <>
      <HeadWithSocialSharing
        title={ogTitle}
        description={ogDescription}
        imageUrl={ogImageUrl}
      >
        {!indexableBySearchEngine && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
      <div>
        <OrganizationHeader organizationPage={organizationPage} />
      </div>
      {children}
      <div>
        <OrganizationFooter organizations={[organization]} />
      </div>
    </>
  )
}
