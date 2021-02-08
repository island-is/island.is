import React from 'react'
import * as styles from './OrganizationWrapper.treat'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { SidebarWrapper } from '@island.is/web/components'

interface WrapperProps {
  title: string
  logoUrl: string
  logoAtl: string
  breadcrumbItems: BreadCrumbItem[]
}

export const OrganizationHeader: React.FC<WrapperProps> = ({
  title,
  logoUrl,
  logoAtl = '',
  breadcrumbItems,
}) => {
  return (
    <Box className={styles.headerBg}>
      <GridContainer>
        <Box marginTop={[1, 1, 3]} marginBottom={5}>
          <Breadcrumbs
            color="white"
            items={breadcrumbItems ?? []}
            renderLink={(link, item) => {
              return item?.href ? (
                <NextLink href={item?.href}>{link}</NextLink>
              ) : (
                link
              )
            }}
          />
        </Box>
      </GridContainer>
      <Box className={styles.headerWrapper}>
        <SidebarWrapper sidebarContent="" hideSidebarInMobile={true}>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={logoUrl} className={styles.headerLogo} alt={logoAtl} />
              <Text variant="h1" as="h1" color="white">
                {title}
              </Text>
            </Box>
          </Box>
        </SidebarWrapper>
      </Box>
    </Box>
  )
}
