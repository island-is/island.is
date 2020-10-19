import React, { FC } from 'react'
import { Box, Divider, Stack } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <aside className={styles.sidebar}>
      {navigation.map((rootItem, rootIndex) => (
        <div key={rootIndex}>
          <Box
            background="blue100"
            paddingY={3}
            paddingX={4}
            borderRadius="large"
            key={rootIndex}
          >
            <Stack space={3}>
              {rootItem.children?.map((navRoot, index) => (
                <ModuleNavigation key={index} nav={navRoot} />
              ))}
            </Stack>
          </Box>
          {rootIndex < navigation.length - 1 && <Divider />}
        </div>
      ))}
    </aside>
  )
}

export default Sidebar
