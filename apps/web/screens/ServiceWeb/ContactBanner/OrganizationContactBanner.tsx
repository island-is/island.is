import React from 'react'
import {
  ArrowLink,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

interface OrganizationContactBannerProps {
  organizationLogoUrl?: string
  contactLink: string
}

const OrganizationContactBanner = ({
  organizationLogoUrl,
  contactLink,
}: OrganizationContactBannerProps) => {
  return (
    <Box background="purple100" borderRadius="large" padding={4}>
      <GridRow direction="row">
        <GridColumn>
          {organizationLogoUrl && (
            <img
              width={64}
              height={64}
              src={organizationLogoUrl}
              alt="organization-logo"
            ></img>
          )}
        </GridColumn>
        <GridColumn>
          <Text color="purple600" fontWeight="semiBold">
            Finnurðu ekki það sem þig vantar?
          </Text>
          <ArrowLink href={contactLink} arrowHeight={10}>
            Hafa samband
          </ArrowLink>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
export default OrganizationContactBanner
