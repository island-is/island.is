import React, { FC } from 'react'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { useLocale } from '@island.is/localization'

export const Sidebar: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const navigation = useNavigation()

  return (
    <aside className={styles.sidebar}>
      <Box background="blue100" borderRadius="large">
        <Box paddingY={3} paddingX={4}>
          <Text variant="h3" color="blue600">
            {formatMessage({
              id: 'service.portal:my-pages',
              defaultMessage: 'Mínar síður',
            })}
          </Text>
        </Box>
        <Divider />
        {navigation.map((rootItem, rootIndex) => (
          <div key={rootIndex}>
            <Box paddingY={3} paddingX={4} key={rootIndex}>
              <Stack space={3}>
                {rootItem.children?.map((navRoot, index) => (
                  <ModuleNavigation key={index} nav={navRoot} />
                ))}
              </Stack>
            </Box>
            {rootIndex < navigation.length - 1 && <Divider />}
          </div>
        ))}
      </Box>
    </aside>
  )
}

export default Sidebar
