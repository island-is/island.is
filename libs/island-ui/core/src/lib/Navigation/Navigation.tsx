import React, { FC, useState, useEffect, Fragment, ReactNode } from 'react'
import cn from 'classnames'
import { useMenuState, Menu, MenuButton, MenuStateReturn } from 'reakit/Menu'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Text } from '../Text/Text'
import { Box } from '../Box/Box'
import { BoxProps } from '../Box/types'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Button } from '../Button/Button'

import * as styles from './Navigation.css'
import { Icon } from '../IconRC/Icon'

export type NavigationColorAttributes =
  | 'color'
  | 'dividerColor'
  | 'backgroundColor'
  | 'activeColor'

const colorSchemeColors: Record<
  keyof typeof styles.colorScheme,
  Record<NavigationColorAttributes, Colors>
> = {
  blue: {
    color: 'blue600' as Colors,
    dividerColor: 'blue200' as Colors,
    backgroundColor: 'blue100' as Colors,
    activeColor: 'blue400' as Colors,
  },
  darkBlue: {
    color: 'white' as Colors,
    dividerColor: 'blue600' as Colors,
    backgroundColor: 'blue400' as Colors,
    activeColor: 'white' as Colors,
  },
  purple: {
    color: 'purple600' as Colors,
    dividerColor: 'purple200' as Colors,
    backgroundColor: 'purple100' as Colors,
    activeColor: 'purple400' as Colors,
  },
}

export interface NavigationItem {
  title: string
  href?: string
  active?: boolean
  items?: NavigationItem[]
  typename?: string
  slug?: string[]
}
interface MobileNavigationDialogProps {
  Title: ReactNode
  colorScheme: keyof typeof styles.colorScheme
  items: NavigationItem[]
  renderLink: NavigationTreeProps['renderLink']
  isVisible: boolean
  onClick: () => void
  menuState: MenuStateReturn
}

interface NavigationTreeProps {
  items: NavigationItem[]
  level?: Level
  colorScheme?: keyof typeof styles.colorScheme
  expand?: boolean
  renderLink?: (link: ReactNode, item?: NavigationItem) => ReactNode
  menuState: MenuStateReturn
  linkOnClick?: () => void
}
export interface NavigationProps {
  title: string
  label?: string
  activeItemTitle?: string
  colorScheme?: keyof typeof styles.colorScheme
  expand?: boolean
  isMenuDialog?: boolean
  titleLink?: Pick<NavigationItem, 'href' | 'active'>
  items: NavigationItem[]
  baseId: string
  /**
   * Render function for all links, useful for wrapping framework specific routing links
   */
  renderLink?: NavigationTreeProps['renderLink']
  titleProps?: NavigationItem
}

// The sidebar nav is not designed to show more than 2 levels.
type Level = keyof typeof styles.level

const MAX_LEVELS = 2

const basePadding = {
  paddingY: 1,
  paddingX: 3,
} as Pick<BoxProps, 'paddingY' | 'paddingX'>

const defaultLinkRender: NavigationTreeProps['renderLink'] = (link) => link

export const Navigation: FC<NavigationProps> = ({
  title = 'Efnisyfirlit',
  titleLink,
  activeItemTitle,
  label,
  colorScheme = 'blue',
  expand,
  renderLink = defaultLinkRender,
  isMenuDialog = false,
  items,
  titleProps,
  baseId,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const color = colorSchemeColors[colorScheme]['color']
  const activeColor = colorSchemeColors[colorScheme]['activeColor']
  const backgroundColor = colorSchemeColors[colorScheme]['backgroundColor']
  const dividerColor = colorSchemeColors[colorScheme]['dividerColor']

  const someActiveLinks = items.some((x) => x.active)
  const menu = useMenuState({ animated: true, baseId, visible: false })

  useEffect(() => {
    setMobileMenuOpen(menu.visible)
  }, [menu.visible])

  const titleLinkProps = titleLink
    ? {
        href: titleLink.href,
      }
    : null

  const Title: MobileNavigationDialogProps['Title'] = titleLinkProps ? (
    renderLink(
      <FocusableBox
        component="a"
        href={titleLink?.href}
        borderRadius="large"
        className={styles.link}
        {...basePadding}
      >
        {({
          isFocused,
          isHovered,
        }: {
          isFocused: boolean
          isHovered: boolean
        }) => {
          const textColor =
            titleLink?.active || isFocused || isHovered ? activeColor : color

          return (
            <Text as="span" variant="h4" color={textColor}>
              {title}
            </Text>
          )
        }}
        <Text
          as="span"
          variant="h4"
          color={titleLink?.active ? activeColor : color}
        >
          {title}
        </Text>
      </FocusableBox>,
      titleProps,
    )
  ) : (
    <Box {...basePadding}>
      <Text as="span" variant="h4" color={color}>
        {title}
      </Text>
    </Box>
  )

  return (
    <>
      {isMenuDialog ? (
        <Box
          background={backgroundColor}
          alignItems="center"
          borderRadius="large"
          position="relative"
        >
          <MenuButton
            {...menu}
            className={styles.menuBtn}
            onClick={() => menu.show}
          >
            <MobileButton
              title={activeItemTitle ?? title}
              colorScheme={colorScheme}
              aria-expanded={!mobileMenuOpen}
              aria-controls={'OpenNavigationDialog'}
            />
          </MenuButton>
          <Menu
            {...menu}
            style={{
              top: '-10px',
              transform: 'none',
              width: '100%',
              borderRadius: '8px',
              zIndex: 10,
            }}
            className={cn(styles.transition, styles.menuShadow[colorScheme])}
          >
            <MobileNavigationDialog
              Title={Title}
              colorScheme={colorScheme}
              items={items}
              renderLink={renderLink}
              isVisible={mobileMenuOpen}
              menuState={menu}
              onClick={() => {
                menu.hide()
              }}
            />
          </Menu>
        </Box>
      ) : (
        <Box
          component="nav"
          borderRadius="large"
          paddingY={2}
          aria-label={label ?? title}
          background={backgroundColor}
          className={cn(styles.root, styles.colorScheme[colorScheme])}
        >
          {Title}
          <Box display="flex" alignItems="center" paddingY={2}>
            <Box background={dividerColor} className={styles.divider} />
          </Box>
          <NavigationTree
            items={items}
            colorScheme={colorScheme}
            renderLink={renderLink}
            menuState={menu}
            expand={expand}
          />
        </Box>
      )}
    </>
  )
}

const MobileNavigationDialog = ({
  Title,
  colorScheme,
  items,
  renderLink,
  onClick,
  menuState,
}: MobileNavigationDialogProps) => {
  return (
    <Box
      component="nav"
      background={colorSchemeColors[colorScheme]['backgroundColor']}
      paddingY={2}
      borderRadius={'large'}
    >
      <Box position="relative">
        {Title}
        <Box
          position="absolute"
          right={0}
          marginRight={2}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <Button
            circle
            colorScheme="negative"
            icon={'chevronUp'}
            size="small"
            aria-controls={`CloseNavigationDialog`}
            onClick={onClick}
          />
        </Box>
      </Box>
      <Box display="flex" alignItems="center" paddingY={2}>
        <Box
          background={colorSchemeColors[colorScheme]['dividerColor']}
          className={styles.divider}
        />
      </Box>
      <NavigationTree
        items={items}
        colorScheme={colorScheme}
        renderLink={renderLink}
        menuState={menuState}
        linkOnClick={onClick}
      />
    </Box>
  )
}
interface MobileButtonProps {
  title: string
  colorScheme: keyof typeof styles.colorScheme
}

const MobileButton = ({ title, colorScheme }: MobileButtonProps) => {
  return (
    <Box
      component="span"
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      paddingX={2}
      paddingY={1}
    >
      <Text
        as="span"
        variant="h5"
        color={colorSchemeColors[colorScheme]['activeColor']}
      >
        {title}
      </Text>

      <Box
        component="span"
        position="absolute"
        right={0}
        marginRight={2}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span className={styles.dropdownIcon}>
          <Icon icon={'chevronDown'} size="small" color="blue400" />
        </span>
      </Box>
    </Box>
  )
}

export const NavigationTree: FC<NavigationTreeProps> = ({
  items,
  level = 1,
  colorScheme = 'blue',
  expand = false,
  renderLink = defaultLinkRender,
  menuState,
  linkOnClick,
}: NavigationTreeProps) => {
  return (
    <Box
      component="ul"
      className={cn(styles.ul, styles.level[level])}
      style={{
        borderLeftColor:
          level > 1
            ? theme.color[colorSchemeColors[colorScheme]['dividerColor']]
            : undefined,
      }}
    >
      {items.map((item, index) => {
        const { title, href, items = [], active } = item
        const nextLevel: Level = (level + 1) as Level
        const isChildren = level > 1
        const showNextLevel =
          (active || expand) && items.length && nextLevel <= MAX_LEVELS

        return (
          <li key={index}>
            {renderLink(
              <FocusableBox
                component="a"
                href={href}
                borderRadius="large"
                paddingLeft={isChildren ? 2 : 3}
                paddingRight={2}
                paddingY={isChildren ? 'smallGutter' : 1}
                className={styles.link}
                onClick={linkOnClick}
              >
                {({
                  isFocused,
                  isHovered,
                }: {
                  isFocused: boolean
                  isHovered: boolean
                }) => {
                  const textColor =
                    active || isFocused || isHovered
                      ? colorSchemeColors[colorScheme]['activeColor']
                      : colorSchemeColors[colorScheme]['color']

                  return (
                    <Text
                      as="span"
                      color={textColor}
                      variant={isChildren ? 'small' : 'default'}
                      fontWeight={active ? 'semiBold' : 'light'}
                    >
                      {title}
                    </Text>
                  )
                }}
              </FocusableBox>,
              item,
            )}
            {showNextLevel ? (
              <NavigationTree
                items={items}
                level={nextLevel}
                colorScheme={colorScheme}
                expand={expand}
                renderLink={renderLink}
                menuState={menuState}
                linkOnClick={linkOnClick}
              />
            ) : null}
          </li>
        )
      })}
    </Box>
  )
}
