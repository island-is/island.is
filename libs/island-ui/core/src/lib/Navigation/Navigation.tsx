import React, {
  FC,
  useState,
  useEffect,
  ReactNode,
  createContext,
  ReactElement,
} from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { useMenuState, Menu, MenuButton, MenuStateReturn } from 'reakit/Menu'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Text } from '../Text/Text'
import { Box } from '../Box/Box'
import { BoxProps } from '../Box/types'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Icon } from '../IconRC/Icon'

import * as styles from './Navigation.css'

type NavigationContextProps = {
  baseId: string
  activeAccordions: Array<string>
  toggleAccordion: (id: string) => void
}

export const NavigationContext = createContext<NavigationContextProps>({
  baseId: '',
  activeAccordions: [],
  toggleAccordion: () => null,
})

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
  accordion?: boolean
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
  renderLink?: (link: ReactElement, item?: NavigationItem) => ReactNode
  menuState: MenuStateReturn
  linkOnClick?: () => void
  id?: string
  labelId?: string
}
export interface NavigationProps {
  title: string
  label?: string
  activeItemTitle?: string
  colorScheme?: keyof typeof styles.colorScheme
  /**
   * Keep all child menu items expanded
   */
  expand?: boolean
  /**
   * Only a single acccordion can be expanded at a time
   */
  singleAccordion?: boolean
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

const toggleId = (arr: Array<string> = [], id: string, single = false) =>
  arr.includes(id) ? arr.filter((i) => i !== id) : [...(single ? [] : arr), id]

export const Navigation: FC<React.PropsWithChildren<NavigationProps>> = ({
  title = 'Efnisyfirlit',
  titleLink,
  activeItemTitle,
  label,
  colorScheme = 'blue',
  expand,
  singleAccordion = false,
  renderLink = defaultLinkRender,
  isMenuDialog = false,
  items,
  titleProps,
  baseId,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeAccordions, setActiveAccordions] = useState<Array<string>>([])

  const color = colorSchemeColors[colorScheme]['color']
  const activeColor = colorSchemeColors[colorScheme]['activeColor']
  const backgroundColor = colorSchemeColors[colorScheme]['backgroundColor']
  const dividerColor = colorSchemeColors[colorScheme]['dividerColor']

  const menu = useMenuState({ animated: true, baseId, visible: false })

  useEffect(() => {
    setMobileMenuOpen(menu.visible)
  }, [menu.visible])

  const titleLinkProps = titleLink
    ? {
        href: titleLink.href,
      }
    : null

  const toggleAccordion = (id: string) => {
    setActiveAccordions(toggleId(activeAccordions, id, singleAccordion))
  }

  const Title: MobileNavigationDialogProps['Title'] = titleLinkProps ? (
    renderLink(
      <FocusableBox
        component="a"
        href={titleLink?.href}
        borderRadius="large"
        className={styles.link}
        {...basePadding}
      >
        {({ isFocused, isHovered }) => {
          const textColor =
            titleLink?.active || isFocused || isHovered ? activeColor : color

          return (
            <>
              <Text as="span" variant="h4" color={textColor}>
                {title}
              </Text>
              <Text
                as="span"
                variant="h4"
                color={titleLink?.active ? activeColor : color}
              >
                {title}
              </Text>
            </>
          )
        }}
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
    <NavigationContext.Provider
      value={{ baseId, activeAccordions, toggleAccordion }}
    >
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
            aria-label={title}
          >
            <MobileButton
              title={activeItemTitle ?? title}
              colorScheme={colorScheme}
              aria-expanded={!mobileMenuOpen}
            />
          </MenuButton>
          <Menu
            {...menu}
            style={{
              top: '-10px',
              transform: 'none',
              width: '100%',
              borderRadius: '8px',
              zIndex: 1000000,
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
            id="desktop"
            items={items}
            colorScheme={colorScheme}
            renderLink={renderLink}
            menuState={menu}
            expand={expand}
          />
        </Box>
      )}
    </NavigationContext.Provider>
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
          <FocusableBox
            component="button"
            onClick={onClick}
            background={colorSchemeColors[colorScheme]['dividerColor']}
            className={styles.dropdownIcon}
          >
            <Icon
              icon={'chevronUp'}
              size="small"
              color={colorSchemeColors[colorScheme]['color']}
            />
          </FocusableBox>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" paddingY={2}>
        <Box
          background={colorSchemeColors[colorScheme]['dividerColor']}
          className={styles.divider}
        />
      </Box>
      <NavigationTree
        id="mobile"
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
        <FocusableBox
          component="span"
          background={colorSchemeColors[colorScheme]['dividerColor']}
          className={styles.dropdownIcon}
        >
          <Icon
            icon={'chevronDown'}
            size="small"
            color={colorSchemeColors[colorScheme]['color']}
          />
        </FocusableBox>
      </Box>
    </Box>
  )
}

export const NavigationTree: FC<
  React.PropsWithChildren<NavigationTreeProps>
> = ({
  items,
  level = 1,
  colorScheme = 'blue',
  expand = false,
  renderLink = defaultLinkRender,
  menuState,
  linkOnClick,
  id = '',
  labelId = '',
}: NavigationTreeProps) => {
  return (
    <NavigationContext.Consumer>
      {({ baseId, activeAccordions, toggleAccordion }) => (
        <Box
          component="ul"
          {...(id && { id: `navigation-tree-${id}` })}
          {...(labelId && { 'aria-labelledby': labelId })}
          className={cn(styles.ul, styles.level[level])}
          style={{
            borderLeftColor:
              level > 1
                ? theme.color[colorSchemeColors[colorScheme]['dividerColor']]
                : undefined,
          }}
        >
          {items.map((item, index) => {
            const { title, href, items = [], active, accordion } = item
            const nextLevel: Level = (level + 1) as Level
            const isChildren = level > 1
            const showNextLevel =
              (active || expand) &&
              items.length &&
              nextLevel <= MAX_LEVELS &&
              !accordion
            const isAccordion = !!(
              items.length &&
              nextLevel <= MAX_LEVELS &&
              accordion
            )
            const accordionId = `${level}-${index}`
            const activeAccordion = activeAccordions.includes(accordionId)
            const labelId = `${baseId}-title-${accordionId}`
            const ariaId = `${baseId}-tree-${accordionId}`

            const nextLevelTree = (
              <NavigationTree
                id="accordion"
                items={items}
                level={nextLevel}
                colorScheme={colorScheme}
                expand={expand}
                renderLink={renderLink}
                menuState={menuState}
                linkOnClick={linkOnClick}
              />
            )

            return (
              <li key={index} className={styles.listItem}>
                {/*Note: Need to review usage (e.g. PortalNavigation) if we change the rendered element to something other than FocusableBox.*/}
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
                    {({ isFocused, isHovered }) => {
                      const textColor =
                        active || isFocused || isHovered
                          ? colorSchemeColors[colorScheme]['activeColor']
                          : colorSchemeColors[colorScheme]['color']

                      return (
                        <span
                          className={cn(styles.text, {
                            [styles.textNarrower]: isAccordion,
                          })}
                        >
                          <Text
                            id={`navigation-title-${accordionId}${
                              id ? `-${id}` : ''
                            }`}
                            as="span"
                            color={textColor}
                            variant={isChildren ? 'small' : 'default'}
                            fontWeight={active ? 'semiBold' : 'light'}
                          >
                            {title}
                          </Text>
                        </span>
                      )
                    }}
                  </FocusableBox>,
                  item,
                )}
                {isAccordion && (
                  <FocusableBox
                    component="button"
                    onClick={() => {
                      toggleAccordion(accordionId)
                    }}
                    background={colorSchemeColors[colorScheme]['dividerColor']}
                    marginRight={2}
                    aria-expanded={activeAccordion}
                    aria-controls={ariaId}
                    className={cn(
                      styles.accordionIcon,
                      styles.largerClickableArea,
                    )}
                  >
                    <Icon
                      icon="add"
                      color={colorSchemeColors[colorScheme]['color']}
                      size="small"
                      className={cn(
                        styles.icon,
                        activeAccordion
                          ? styles.iconAddHidden
                          : styles.iconAddVisible,
                      )}
                    />
                    <Icon
                      icon="remove"
                      color={colorSchemeColors[colorScheme]['color']}
                      size="small"
                      className={cn(
                        styles.icon,
                        activeAccordion
                          ? styles.iconRemoveVisible
                          : styles.iconRemoveHidden,
                      )}
                    />
                  </FocusableBox>
                )}
                {isAccordion && (
                  <AnimateHeight
                    id={ariaId}
                    duration={300}
                    height={activeAccordion ? 'auto' : 0}
                    aria-labelledby={labelId}
                  >
                    {nextLevelTree}
                  </AnimateHeight>
                )}
                {!!showNextLevel && nextLevelTree}
              </li>
            )
          })}
        </Box>
      )}
    </NavigationContext.Consumer>
  )
}
