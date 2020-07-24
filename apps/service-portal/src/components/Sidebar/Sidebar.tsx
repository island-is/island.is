import React, { FC } from 'react'
import { Box, Typography, SkeletonLoader } from '@island.is/island-ui/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()

  const actionsNavList = navigation
    .filter((x) => x.section === 'actions')
    .sort((a, b) => a.order - b.order)
  const infoNavList = navigation
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
            {actionsNavList.length > 0 && (
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
            {infoNavList.length > 0 && (
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
