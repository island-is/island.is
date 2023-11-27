import type { CSSProperties } from '@vanilla-extract/css'
import React, { useMemo } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './IcelandicNaturalDisasterInsuranceHeader.css'

const treeImageUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/52r9AXIIGj5d3VxfQA2yQL/ff654c88c6309ad799ccc5668754371d/nti-trees.svg'
const townImageUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/eXqcbclteE88H5iQ6J3lo/bbc1d0c9d3abee93d34ec0aa718c833b/Group__1_.svg'

const getDefaultStyle = (width: number): CSSProperties => {
  if (width > theme.breakpoints.xl && width < 1650) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 280px, auto 280px, cover',
      backgroundPosition: '10% bottom, 130% bottom, center',
      backgroundImage: `url('${treeImageUrl}'), url('${townImageUrl}'), linear-gradient(0deg, #FFFFFF -40.18%, #FAFDFD -23.09%, #ECF8F9 -4.3%, #D6F0F1 16.21%, #B7E5E7 36.72%, #8ED6DA 57.23%, #5DC4CA 77.74%, #23AFB8 100.93%, #00A3AD 113.54%)`,
    }
  }

  if (width > theme.breakpoints.xl) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 280px, auto 280px, cover',
      backgroundPosition: '10% bottom, 115% bottom, center',
      backgroundImage: `url('${treeImageUrl}'), url('${townImageUrl}'), linear-gradient(0deg, #FFFFFF -40.18%, #FAFDFD -23.09%, #ECF8F9 -4.3%, #D6F0F1 16.21%, #B7E5E7 36.72%, #8ED6DA 57.23%, #5DC4CA 77.74%, #23AFB8 100.93%, #00A3AD 113.54%)`,
    }
  }
  if (width > theme.breakpoints.lg) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 280px, auto 280px, cover',
      backgroundPosition: '5% bottom, 820px bottom, center',
      backgroundImage: `url('${treeImageUrl}'), url('${townImageUrl}'), linear-gradient(0deg, #FFFFFF -40.18%, #FAFDFD -23.09%, #ECF8F9 -4.3%, #D6F0F1 16.21%, #B7E5E7 36.72%, #8ED6DA 57.23%, #5DC4CA 77.74%, #23AFB8 100.93%, #00A3AD 113.54%)`,
    }
  }
  if (width > theme.breakpoints.md) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 280px, cover',
      backgroundPosition: '5% bottom, center',
      backgroundImage: `url('${treeImageUrl}'), linear-gradient(0deg, #FFFFFF -40.18%, #FAFDFD -23.09%, #ECF8F9 -4.3%, #D6F0F1 16.21%, #B7E5E7 36.72%, #8ED6DA 57.23%, #5DC4CA 77.74%, #23AFB8 100.93%, #00A3AD 113.54%)`,
    }
  }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage:
      'linear-gradient(0deg, #FFFFFF -40.18%, #FAFDFD -23.09%, #ECF8F9 -4.3%, #D6F0F1 16.21%, #B7E5E7 36.72%, #8ED6DA 57.23%, #5DC4CA 77.74%, #23AFB8 100.93%, #00A3AD 113.54%)',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const IcelandicNaturalDisasterInsuranceHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const screenWidth = getScreenWidthString(width)

  return (
    <div
      style={n(`ntiHeader-${screenWidth}`, getDefaultStyle(width))}
      className={styles.headerBg}
    >
      <div className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization?.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt="nti-logo"
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization?.logo && (
            <Hidden above="sm">
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt=""
                />
              </Link>
            </Hidden>
          )}
          <Box
            className={styles.title}
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'left']}
          >
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text
                variant={width > theme.breakpoints.sm ? 'h1' : 'h3'}
                as="h1"
                color="blueberry600"
                fontWeight="semiBold"
              >
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default IcelandicNaturalDisasterInsuranceHeader
