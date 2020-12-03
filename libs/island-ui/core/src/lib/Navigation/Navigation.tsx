import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  MutableRefObject,
} from 'react'
import cn from 'classnames'

import { theme, Colors } from '@island.is/island-ui/theme'
import { Text } from '../Text/Text'
import { Box, BoxProps } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Button } from '../Button/Button'
import { Icon } from '../IconRC/Icon'

import * as navigationStyles from './Navigation.treat'
import { useMenuState, Menu, MenuButton, MenuStateReturn } from 'reakit/Menu'

// The sidebar nav is not designed to show more than 2 levels.
type Level = keyof typeof navigationStyles.level
const MAX_LEVELS = 2

const basePadding = {
  paddingY: 1,
  paddingX: 3,
} as Pick<BoxProps, 'paddingY' | 'paddingX'>

export type NavigationColorAttributes =
  | 'color'
  | 'dividerColor'
  | 'backgroundColor'
  | 'activeColor'

const colorSchemeColors: Record<
  keyof typeof navigationStyles.colorScheme,
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
  href: string
  active?: boolean
  items?: NavigationItem[]
}

export interface NavigationProps {
  title: string
  label?: string
  activeItemTitle: string
  colorScheme?: keyof typeof navigationStyles.colorScheme
  expand?: boolean
  LinkWrapper?: FC<DefaultLinkWrapperProps>
  titleLink?: Pick<NavigationItem, 'href' | 'active'>
  items: NavigationItem[]
  baseId: string
}

export const Navigation: FC<NavigationProps> = ({
  title = 'Efnisyfirlit',
  titleLink,
  activeItemTitle,
  label,
  colorScheme = 'blue',
  expand,
  LinkWrapper = DefaultLinkWrapper,
  items,
  baseId,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const buttonRef = React.useRef(null)

  let color = colorSchemeColors[colorScheme]['color']
  let activeColor = colorSchemeColors[colorScheme]['activeColor']
  let backgroundColor = colorSchemeColors[colorScheme]['backgroundColor']
  let dividerColor = colorSchemeColors[colorScheme]['dividerColor']

  const someActiveLinks = items.some((x) => x.active)
  const menu = useMenuState({ animated: true, baseId, visible: false })

  useEffect(() => {
    setMobileMenuOpen(menu.visible)
  }, [menu.visible])

  const TitleText = (
    <Text as="span" variant="h4" color={someActiveLinks ? activeColor : color}>
      {title}
    </Text>
  )

  const titleLinkProps = titleLink
    ? {
        href: titleLink.href,
      }
    : null

  const Title = titleLinkProps ? (
    <LinkWrapper {...titleLinkProps}>
      <FocusableBox
        component="a"
        href={titleLink?.href}
        borderRadius="large"
        className={navigationStyles.link}
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
        {TitleText}
      </FocusableBox>
    </LinkWrapper>
  ) : (
    <Box {...basePadding}>
      <Text as="span" variant="h4" color={color}>
        {title}
      </Text>
    </Box>
  )

  return (
    <>
      <Box
        display={['block', 'block', 'none']}
        background={backgroundColor}
        alignItems="center"
        borderRadius="large"
        position="relative"
      >
        <MenuButton
          {...menu}
          className={navigationStyles.menuBtn}
          onClick={() => {
            menu.show
          }}
        >
          <MobileButton
            title={activeItemTitle}
            colorScheme={colorScheme}
            aria-expanded={!mobileMenuOpen}
            aria-control={'OpenNavigationDialog'}
          />
        </MenuButton>
        <Menu
          {...menu}
          style={{
            top: '-8px',
            transform: 'none',
            width: '100%',
            borderRadius: '8px',
          }}
          className={cn(
            navigationStyles.transition,
            navigationStyles.menuShadow[colorScheme],
          )}
        >
          <MobileNavigationDialog
            Title={Title}
            colorScheme={colorScheme}
            targetRef={buttonRef}
            items={items}
            LinkWrapper={LinkWrapper}
            isVisible={mobileMenuOpen}
            menuState={menu}
            onClick={() => {
              menu.hide()
            }}
          />
        </Menu>
      </Box>
      <Box
        component="nav"
        borderRadius="large"
        display={['none', 'none', 'block']}
        paddingY={2}
        aria-label={label ?? title}
        background={backgroundColor}
        className={cn(
          navigationStyles.root,
          navigationStyles.colorScheme[colorScheme],
        )}
      >
        {Title}
        <Box display="flex" alignItems="center" paddingY={2}>
          <Box background={dividerColor} className={navigationStyles.divider} />
        </Box>
        <NavigationTree
          items={items}
          colorScheme={colorScheme}
          LinkWrapper={LinkWrapper}
          menuState={menu}
          expand={expand}
        />
      </Box>
    </>
  )
}

interface MobileNavigationDialogProps {
  Title: ReactElement
  colorScheme: keyof typeof navigationStyles.colorScheme
  targetRef: MutableRefObject<null>
  items: NavigationItem[]
  LinkWrapper: FC<DefaultLinkWrapperProps>
  isVisible: boolean
  onClick: () => void
  menuState: MenuStateReturn
}

const MobileNavigationDialog = ({
  Title,
  colorScheme,
  items,
  LinkWrapper,
  onClick,
  menuState,
}: MobileNavigationDialogProps) => {
  return (
    <Box
      background={colorSchemeColors[colorScheme]['backgroundColor']}
      paddingY={2}
      borderRadius={'large'}
    >
      {Title}
      <Box position="absolute" top={0} right={0} margin={2}>
        <Button
          circle
          colorScheme="negative"
          icon={'chevronUp'}
          aria-controls={`CloseNavigationDialog`}
          onClick={onClick}
        />
      </Box>

      <Box display="flex" alignItems="center" paddingY={2}>
        <Box
          background={colorSchemeColors[colorScheme]['dividerColor']}
          className={navigationStyles.divider}
        />
      </Box>
      <NavigationTree
        items={items}
        colorScheme={colorScheme}
        LinkWrapper={LinkWrapper}
        menuState={menuState}
      />
    </Box>
  )
}
interface MobileButtonProps {
  title: string
  colorScheme: keyof typeof navigationStyles.colorScheme
}

const MobileButton = ({ title, colorScheme }: MobileButtonProps) => {
  return (
    <Box
      display="flex"
      paddingX={2}
      paddingY={1}
      justifyContent="spaceBetween"
      alignItems="center"
    >
      <Text
        as="span"
        variant="h5"
        color={colorSchemeColors[colorScheme]['activeColor']}
      >
        {title}
      </Text>

      <Box
        position="absolute"
        right={0}
        marginRight={2}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <Button
          circle
          colorScheme="negative"
          icon={'chevronDown'}
          aria-controls={`CloseNavigationDialog`}
          onClick={() => null}
        />
      </Box>
    </Box>
  )
}

interface NavigationTreeProps {
  items: NavigationItem[]
  level?: Level
  colorScheme?: keyof typeof navigationStyles.colorScheme
  expand?: boolean
  LinkWrapper?: FC<DefaultLinkWrapperProps>
  menuState: MenuStateReturn
}

export const NavigationTree: FC<NavigationTreeProps> = ({
  items,
  level = 1,
  colorScheme = 'blue',
  expand = false,
  LinkWrapper = DefaultLinkWrapper,
  menuState,
}: NavigationTreeProps) => {
  return (
    <Box
      component="ul"
      className={cn(navigationStyles.ul, navigationStyles.level[level])}
      style={{
        borderLeftColor:
          level > 1
            ? theme.color[colorSchemeColors[colorScheme]['dividerColor']]
            : undefined,
      }}
    >
      {items.map(({ title, href, items = [], active }, index) => {
        const nextLevel: Level = (level + 1) as Level
        const isChildren = level > 1
        const showNextLevel =
          (active || expand) && items.length && nextLevel <= MAX_LEVELS

        const linkProps = {
          href,
        }

        const content = (
          <FocusableBox
            key={index}
            component="a"
            href={href}
            borderRadius="large"
            paddingLeft={isChildren ? 2 : 3}
            paddingY={isChildren ? 'smallGutter' : 1}
            className={navigationStyles.link}
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
          </FocusableBox>
        )

        return (
          <>
            <LinkWrapper {...linkProps}>{content}</LinkWrapper>
            {showNextLevel ? (
              <NavigationTree
                items={items}
                level={nextLevel}
                colorScheme={colorScheme}
                expand={expand}
                LinkWrapper={LinkWrapper}
                menuState={menuState}
              />
            ) : null}
          </>
        )
      })}
    </Box>
  )
}

interface DefaultLinkWrapperProps {
  children: ReactElement
}

export const DefaultLinkWrapper: FC<DefaultLinkWrapperProps> = ({
  children,
}: DefaultLinkWrapperProps) => {
  return children
}
