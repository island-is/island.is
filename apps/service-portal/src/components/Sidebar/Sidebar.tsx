import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <aside className={styles.sidebar}>
      <Box paddingY={7} paddingX={6}>
        <>
          {navigation.map((rootItem, index) => (
            <Box marginBottom={4} key={index}>
              <Box marginBottom={3}>
                <Typography variant="h4" as="h4">
                  {rootItem.name}
                </Typography>
              </Box>
              {rootItem.children?.map((navRoot, index) => (
                <ModuleNavigation nav={navRoot} key={index} />
              ))}
            </Box>
          ))}
        </>
      </Box>
    </aside>
  )
}

export default Sidebar
