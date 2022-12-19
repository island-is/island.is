import React, { FC, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  MenuSeparator,
} from 'reakit/Menu'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'

import {
  Box,
  Button,
  FocusableBox,
  Hidden,
  Icon,
  IconMapIcon,
  Logo,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './ModuleSwitcher.css'

import { useLocale } from '@island.is/localization'
import { m, useActiveModule, useNavigation } from '@island.is/portals/core'
import { masterNavigation } from '../../lib/masterNavigation'

// import { ModuleSwitcherDesktop } from './desktop/ModuleSwitcherDesktop'
// import { ModuleSwitcherMobile } from './mobile/ModuleSwitcherMobile'

const ModuleSwitcherDesktop: FC = () => {
  const menu = useMenuState({
    //animated: true,
    //modal: true,
  })
  const { formatMessage } = useLocale()
  const activeModule = useActiveModule()
  const navigation = useNavigation()

  return (
    <>
      <MenuButton className={styles.button} {...menu}>
        <Box
          width="full"
          component="div"
          display="flex"
          justifyContent="spaceBetween"
          paddingX={3}
        >
          <Box>
            <Text variant="eyebrow">{formatMessage(m.dashboard)}</Text>
            <Text>
              {formatMessage(
                activeModule ? activeModule.name : masterNavigation.name,
              )}
            </Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              colorScheme="light"
              circle={true}
              size="small"
              icon="chevronDown"
            ></Button>
          </Box>
        </Box>
      </MenuButton>

      <Menu {...menu} className={styles.dropdown} aria-label="Preferences">
        <Box background="white" padding={3} borderRadius="large">
          <Box
            marginBottom={3}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Text variant="eyebrow">{formatMessage(m.dashboard)}</Text>
            <Button
              circle
              size="small"
              colorScheme="light"
              icon="close"
              onClick={menu.hide}
            ></Button>
          </Box>

          <ModuleItems onNavigation={menu.hide} />
        </Box>
      </Menu>
      <Box
        display={menu.visible ? 'block' : 'none'}
        className={styles.backdrop}
      />
    </>
  )
}

interface ModuleItemProps {
  label: string
  path: string
  icon?: IconMapIcon
  active?: boolean
  key?: string | number
  onNavigation?: () => void
}

interface ModuleItemsProps {
  onNavigation: () => void
}

const ModuleItems: FC<ModuleItemsProps> = ({ onNavigation }) => {
  const activeModule = useActiveModule()
  const navigation = useNavigation()
  const { formatMessage } = useLocale()

  return (
    <>
      <ModuleItem
        path={navigation?.path ?? '/'}
        label={formatMessage(m.overview)}
        icon="home"
        active={!activeModule}
        onNavigation={onNavigation}
      />

      <Stack space={0} dividers={false}>
        {navigation?.children?.map((item, index) =>
          item.path ? (
            <ModuleItem
              key={index}
              label={formatMessage(item.name)}
              path={item.path}
              icon={item.icon?.icon}
              active={activeModule?.name === item.name}
              onNavigation={onNavigation}
            />
          ) : (
            <></>
          ),
        )}
      </Stack>
    </>
  )
}

const ModuleItem: FC<ModuleItemProps> = ({
  label,
  path,
  icon = 'settings',
  active = false,
  key,
  onNavigation,
}) => {
  const history = useHistory()
  const handleClick = () => {
    history.push(path)
    onNavigation?.()
  }
  const color = active ? 'blue400' : 'blue600'

  return (
    <Box
      key={key}
      paddingX={3}
      paddingY={2}
      display="flex"
      alignItems="center"
      background={active ? 'white' : undefined}
      borderRadius="large"
      onClick={handleClick}
    >
      <Icon
        icon={icon}
        type={active ? 'filled' : 'outline'}
        color={color}
        size="small"
      />
      <Box marginLeft={3}>
        <Text color={color} variant="h3">
          {label}
        </Text>
      </Box>
    </Box>
  )
}

const ModuleSwitcherMobile: FC = () => {
  const dialog = useDialogState()
  const activeModule = useActiveModule()
  const navigation = useNavigation()
  const { formatMessage } = useLocale()

  return (
    <Box display="flex">
      <DialogDisclosure as="div" {...dialog} aria-label="Module switcher">
        <FocusableBox
          component="div"
          width="full"
          display="flex"
          justifyContent="spaceBetween"
        >
          <Box>
            <Text variant="eyebrow">{formatMessage(m.dashboard)}</Text>
            <Text>
              {formatMessage(
                activeModule ? activeModule.name : masterNavigation.name,
              )}
            </Text>
          </Box>
          <Box display="flex" alignItems="center" marginLeft={2}>
            <Button
              colorScheme="negative"
              circle={true}
              size="small"
              icon="chevronDown"
              title={formatMessage(m.openModuleSwitcher)}
            ></Button>
          </Box>
        </FocusableBox>
      </DialogDisclosure>
      <Dialog {...dialog} aria-label="Module switcher">
        <Box className={styles.dialogContainer}>
          <Box
            className={styles.dialogHeader}
            display="flex"
            justifyContent="spaceBetween"
            marginBottom={2}
          >
            <Box display="flex" alignItems="center">
              <Logo width={40} iconOnly />
              <Box marginLeft={2}>
                <Text variant="h4">{formatMessage(m.dashboardIslandis)}</Text>
              </Box>
            </Box>
            <Button
              circle
              colorScheme="light"
              icon="close"
              iconType="outline"
              onClick={dialog.hide}
              title={formatMessage(m.closeModuleSwitcher)}
            />
          </Box>

          <ModuleItem
            path={navigation?.path ?? '/'}
            label={formatMessage(m.overview)}
            icon="home"
            active={!activeModule}
            onNavigation={dialog.hide}
          />

          <Stack space={0} dividers={false}>
            {navigation?.children?.map((item, index) =>
              item.path ? (
                <ModuleItem
                  key={index}
                  label={formatMessage(item.name)}
                  path={item.path}
                  icon={item.icon?.icon}
                  active={activeModule?.name === item.name}
                  onNavigation={dialog.hide}
                />
              ) : (
                <></>
              ),
            )}
          </Stack>
        </Box>
      </Dialog>
    </Box>
  )
}

export const ModuleSwitcher: FC = () => {
  const [isVisible, toggleVisibility] = useReducer(
    (prevState) => !prevState,
    false,
  )

  return (
    <>
      <Hidden below="lg">
        <ModuleSwitcherDesktop />
      </Hidden>
      <Hidden above="md">
        <ModuleSwitcherMobile />
      </Hidden>
    </>
  )
}
