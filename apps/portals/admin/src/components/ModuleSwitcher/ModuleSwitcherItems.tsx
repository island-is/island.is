import React from 'react'
import { Link } from 'react-router-dom'

import { Box, Icon, IconMapIcon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, useActiveModule, useNavigation } from '@island.is/portals/core'

interface ModuleItemsProps {
  mobile?: boolean
  onNavigation: () => void
}

interface ModuleItemProps {
  label: string
  path: string
  icon?: IconMapIcon
  active?: boolean
  key?: string | number
}

export const ModuleSwitcherItems = ({
  mobile,
  onNavigation,
}: ModuleItemsProps) => {
  const activeModule = useActiveModule()
  const navigation = useNavigation()
  const { formatMessage } = useLocale()

  const ModuleSwitcherItem = ({
    label,
    path,
    icon = 'settings',
    active = false,
    key,
  }: ModuleItemProps) => {
    const color = active ? 'blue400' : 'blue600'
    const activeBackground = mobile ? 'white' : 'blue100'

    return (
      <Link to={path} onClick={onNavigation}>
        <Box
          key={key}
          paddingX={mobile ? 3 : 2}
          paddingY={mobile ? 2 : 1}
          display="flex"
          alignItems="center"
          background={active ? activeBackground : undefined}
          borderRadius="large"
        >
          <Icon
            icon={icon}
            type={active ? 'filled' : 'outline'}
            color={color}
            size="small"
          />
          <Box marginLeft={3}>
            <Text color={color} variant={mobile ? 'h3' : 'medium'}>
              {label}
            </Text>
          </Box>
        </Box>
      </Link>
    )
  }

  return (
    <>
      <Box marginBottom={1}>
        <ModuleSwitcherItem
          path={navigation?.path ?? '/'}
          label={formatMessage(m.overview)}
          icon="home"
          active={!activeModule}
        />
      </Box>

      <Stack space={mobile ? 0 : 1} dividers={false}>
        {navigation?.children?.map((item, index) =>
          item.path ? (
            <ModuleSwitcherItem
              key={index}
              label={formatMessage(item.name)}
              path={item.path}
              icon={item.icon?.icon}
              // TODO: Update comparison to use id instead of name
              active={activeModule?.name === item.name}
            />
          ) : (
            <></>
          ),
        )}
      </Stack>
    </>
  )
}
