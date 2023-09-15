import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import {
  Box,
  GridContainer,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import * as styles from './UtlendingastofnunHeader.css'

const getDefaultStyle = () => {
  return {
    background:
      'url(https://images.ctfassets.net/8k0h54kbe6bj/70WAintbuEXuwg8M3ab2A2/de41b5695a2c527180771048537890a5/Utlendingastofnun-Header.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const UtlendingastofnunHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage }) => {
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
      style={n(`utlendingastofnunHeader-${screenWidth}`, getDefaultStyle())}
      className={styles.headerBg}
    >
      <GridContainer className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization?.logo && (
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Link>
              )
            }
          >
            {!!organizationPage.organization?.logo && (
              <Hidden above="sm">
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
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
              marginTop={[2, 2, 6]}
              textAlign={['center', 'center', 'right']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Text variant="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Link>
            </Box>
          </SidebarLayout>
        </div>
      </GridContainer>
    </div>
  )
}

export default UtlendingastofnunHeader
