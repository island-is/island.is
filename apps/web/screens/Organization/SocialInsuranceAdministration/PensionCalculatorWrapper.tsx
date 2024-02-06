import { PropsWithChildren } from 'react'

import {
  OrganizationFooter,
  OrganizationHeader,
} from '@island.is/web/components'
import { Organization, OrganizationPage } from '@island.is/web/graphql/schema'

interface PensionCalculatorWrapperProps {
  organizationPage: OrganizationPage
  organization: Organization
}

export const PensionCalculatorWrapper = ({
  organizationPage,
  organization,
  children,
}: PropsWithChildren<PensionCalculatorWrapperProps>) => {
  return (
    <>
      <OrganizationHeader organizationPage={organizationPage} />
      {children}
      <OrganizationFooter organizations={[organization]} />
    </>
  )
}
