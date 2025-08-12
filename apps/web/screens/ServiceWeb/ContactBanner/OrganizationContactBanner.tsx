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
  headerText?: string
  linkText?: string
}

const OrganizationContactBanner = ({
  organizationLogoUrl,
  contactLink,
  headerText = 'Finnurðu ekki það sem þig vantar?',
  linkText = 'Hafa samband',
}: OrganizationContactBannerProps) => {
  return (
    <Box background="purple100" borderRadius="large" padding={4}>
      <GridRow direction="row">
        <GridColumn>
          {organizationLogoUrl && (
            <img width={64} height={64} src={organizationLogoUrl} alt="" />
          )}
        </GridColumn>
        <GridColumn>
          <Text color="purple600" fontWeight="semiBold">
            {headerText}
          </Text>
          <ArrowLink href={contactLink} arrowHeight={10}>
            {linkText}
          </ArrowLink>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
export default OrganizationContactBanner
