import React, { FC } from 'react'
import { Box, Typography, Stack, Divider } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <aside className={styles.sidebar}>
      <Box paddingY={7}>
        <Stack space={3}>
          {navigation.map((rootItem, index) => (
            <Box
              background={index === 0 ? 'purple100' : 'blueberry100'}
              paddingY={3}
              paddingX={4}
              key={index}
            >
              <Stack space={2}>
                <Typography variant="h3" as="h3">
                  {rootItem.name}
                </Typography>
                <Divider />
                <div>
                  {rootItem.children?.map((navRoot, index) => (
                    <ModuleNavigation key={index} nav={navRoot} />
                  ))}
                </div>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </aside>
  )
}

export default Sidebar
