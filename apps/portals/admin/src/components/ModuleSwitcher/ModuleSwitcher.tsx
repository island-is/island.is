import React, { FC, useReducer } from 'react'
import { Link } from 'react-router-dom'
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
  IconMapType,
  Inline,
  Logo,
  ModalBase,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './ModuleSwitcher.css'

import { useLocale } from '@island.is/localization'
import { m, useModules, useNavigation } from '@island.is/portals/core'
import { masterNavigation } from '../../lib/masterNavigation'

// import { ModuleSwitcherDesktop } from './desktop/ModuleSwitcherDesktop'
// import { ModuleSwitcherMobile } from './mobile/ModuleSwitcherMobile'

const ModuleSwitcherDesktop: FC = () => {
  return <></>
}

interface MobileItemProps {
  label: string
  path: string
  icon?: IconMapIcon
  active?: boolean
}

const MobileItem: FC<MobileItemProps> = ({
  label,
  path,
  icon = 'settings',
  active = false,
}) => {
  const color = active ? 'blue400' : 'blue600'
  return (
    <Link to={path}>
      <Box
        paddingX={3}
        paddingY={2}
        display="flex"
        alignItems="center"
        background={active ? 'white' : undefined}
        borderRadius="large"
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
    </Link>
  )
}

const ModuleSwitcherMobile: FC = () => {
  const dialog = useDialogState()
  const { activeModule } = useModules()
  const navigation = useNavigation()
  const { formatMessage } = useLocale()

  return (
    <Box display="flex">
      <DialogDisclosure
        {...dialog}
        className={styles.dialogDisclosure}
        aria-label="Module switcher"
      >
        <FocusableBox>
          <Box
            width="full"
            component="div"
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

          <MobileItem
            path={navigation?.path ?? '/'}
            label={formatMessage(m.overview)}
            icon="home"
            active={!activeModule}
          />

          <Stack space={0} dividers={false}>
            {navigation?.children?.map((item) =>
              item.path ? (
                <MobileItem
                  label={formatMessage(item.name)}
                  path={item.path}
                  icon={item.icon?.icon}
                  active={activeModule?.name === item.name}
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

  const { activeModule } = useModules()
  const nav = useNavigation()

  console.log(activeModule)

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
