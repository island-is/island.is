import React, { FC } from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <aside className={styles.sidebar}>
      <Stack space={3}>
        {navigation.map((rootItem, rootIndex) => (
          <Box
            background={rootIndex === 0 ? 'blue100' : 'blueberry100'}
            paddingY={3}
            paddingX={4}
            borderRadius="large"
            key={rootIndex}
          >
            <Stack space={3}>
              {rootItem.children?.map((navRoot, index) => (
                <ModuleNavigation
                  key={index}
                  nav={navRoot}
                  variant={rootIndex === 0 ? 'blue' : 'purple'}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </aside>
  )
}

export default Sidebar
