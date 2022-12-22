import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getNavigationItemIfSingle,
  useActiveModule,
} from '@island.is/portals/core'
import { m } from '@island.is/portals/admin/core'

import {
  BOTTOM_NAVIGATION,
  rootNavigationItem,
  TOP_NAVIGATION,
} from '../../lib/masterNavigation'

interface ModuleSwitcherHeaderProps {
  mobile?: boolean
}

export const ModuleSwitcherHeader = ({ mobile }: ModuleSwitcherHeaderProps) => {
  const activeModule = useActiveModule()
  const { formatMessage } = useLocale()
  const hasSingleNavItem = !!getNavigationItemIfSingle(
    TOP_NAVIGATION,
    BOTTOM_NAVIGATION,
  )

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      paddingX={mobile ? undefined : 3}
      cursor={hasSingleNavItem ? undefined : 'pointer'}
    >
      <div>
        <Text variant="eyebrow">{formatMessage(m.shortTitle)}</Text>
        <Text>
          {formatMessage(
            activeModule ? activeModule.name : rootNavigationItem.name,
          )}
        </Text>
      </div>
      {!hasSingleNavItem && (
        <Box
          display="flex"
          alignItems="center"
          marginLeft={mobile ? 2 : undefined}
        >
          <Button
            colorScheme="negative"
            circle
            size="small"
            icon="chevronDown"
            aria-hidden
          />
        </Box>
      )}
    </Box>
  )
}
