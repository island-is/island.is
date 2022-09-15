import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/admin/core'
import { useActiveModule } from '@island.is/portals/core'

import { rootNavigationItem } from '../../lib/masterNavigation'

interface ModuleSwitcherHeaderProps {
  mobile?: boolean

  // If true, the header will be static and not clickable
  isStaticSwitcher?: boolean
}

export const ModuleSwitcherHeader = ({
  mobile,
  isStaticSwitcher,
}: ModuleSwitcherHeaderProps) => {
  const activeModule = useActiveModule()
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      paddingX={mobile ? undefined : 3}
      cursor={isStaticSwitcher ? undefined : 'pointer'}
    >
      <div>
        <Text variant="eyebrow">{formatMessage(m.shortTitle)}</Text>
        {(!isStaticSwitcher || activeModule) && (
          <Text dataTestId="active-module-name">
            {formatMessage(
              activeModule ? activeModule.name : rootNavigationItem.name,
            )}
          </Text>
        )}
      </div>
      {!isStaticSwitcher && (
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
