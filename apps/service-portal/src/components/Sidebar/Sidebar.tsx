import React, { FC } from 'react'
import { Box, Typography, SkeletonLoader } from '@island.is/island-ui/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import { ServicePortalNavigationRoot } from '@island.is/service-portal/core'

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()
  const navigationList: ServicePortalNavigationRoot[] =
    navigationState === 'fulfilled'
      ? Object.keys(navigation).map((x) => navigation[x])
      : []

  const actionsNavList = navigationList
    .filter((x) => x.section === 'actions')
    .sort((a, b) => a.order - b.order)
  const infoNavList = navigationList
    .filter((x) => x.section === 'info')
    .sort((a, b) => a.order - b.order)

  return (
    <aside className={styles.sidebar}>
      <Box paddingY={7} paddingX={6}>
        {/* TODO: Sidebar loading state? */}
        {navigationState === 'pending' ? (
          <SkeletonLoader />
        ) : (
          <>
            {navigation?.applications?.url && (
              <Box marginBottom={4}>
                <Box marginBottom={3}>
                  <Typography variant="h4" as="h4">
                    Aðgerðir
                  </Typography>
                </Box>
                {actionsNavList.map((navRoot, index) => (
                  <ModuleNavigation nav={navRoot} key={index} />
                ))}
              </Box>
            )}
            {navigation?.applications?.url && (
              <Box marginBottom={4}>
                <Box marginBottom={3}>
                  <Typography variant="h4" as="h4">
                    Upplýsingar
                  </Typography>
                </Box>
                {infoNavList.map((navRoot, index) => (
                  <ModuleNavigation nav={navRoot} key={index} />
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </aside>
  )
}

export default Sidebar
