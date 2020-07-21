import React, { FC } from 'react'
import { Box, Typography, SkeletonLoader } from '@island.is/island-ui/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()

  return (
    <aside className={styles.sidebar}>
      <Box paddingY={7} paddingX={6}>
        {/* TODO: Sidebar loading state? */}
        {navigationState.state === 'pending' ? (
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
                <ModuleNavigation nav={navigation.applications} />
                <ModuleNavigation nav={navigation.settings} />
              </Box>
            )}
            {navigation?.applications?.url && (
              <Box marginBottom={4}>
                <Box marginBottom={3}>
                  <Typography variant="h4" as="h4">
                    Upplýsingar
                  </Typography>
                </Box>
                <ModuleNavigation nav={navigation.documents} />
              </Box>
            )}
          </>
        )}
      </Box>
    </aside>
  )
}

export default Sidebar
