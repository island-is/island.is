import React, { FC, ReactElement } from 'react'
import cn from 'classnames'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Text } from '../Text/Text'
import { Box, BoxProps } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'

import * as styles from './Navigation.treat'

// The sidebar nav is not designed to show more than 2 levels
const MAX_LEVELS = 2

type Levels = 1 | 2

const basePadding = {
  paddingY: 1,
  paddingX: 3,
} as Pick<BoxProps, 'paddingY' | 'paddingX'>

export interface NavigationItem {
  title: string
  href: string
  active?: boolean
  items?: NavigationItem[]
}

export interface NavigationProps {
  title: string
  label?: string
  colorScheme?: 'blue' | 'darkBlue' | 'purple'
  expand?: boolean
  LinkWrapper?: FC
  titleLink?: Pick<NavigationItem, 'href' | 'active'>
  items: NavigationItem[]
}

export const Navigation: FC<NavigationProps> = ({
  title = 'Efnisyfirlit',
  titleLink,
  label,
  colorScheme = 'blue',
  expand,
  LinkWrapper = DefaultLinkWrapper,
  items,
}) => {
  let color = '' as Colors
  let dividerColor = '' as Colors
  let backgroundColor = '' as Colors
  let activeColor = '' as Colors

  switch (colorScheme) {
    case 'blue':
      color = 'blue600'
      dividerColor = 'blue200'
      backgroundColor = 'blue100'
      activeColor = 'blue400'
      break
    case 'darkBlue':
      color = 'white'
      dividerColor = 'blue600'
      backgroundColor = 'blue400'
      activeColor = 'white'
      break
    case 'purple':
      color = 'purple600'
      dividerColor = 'purple200'
      backgroundColor = 'purple100'
      activeColor = 'purple400'
    default:
      break
  }

  const someActiveLinks = items.some((x) => x.active)

  const renderTree = (items: NavigationItem[] = [], level: Levels = 1) => {
    return (
      <Box
        component="ul"
        className={cn(styles.ul, styles.level[level])}
        style={{
          borderLeftColor: level > 1 ? theme.color[dividerColor] : undefined,
        }}
      >
        {items.map(({ title, href, items = [], active }, index) => {
          const nextLevel = level + 1
          const isChildren = level > 1
          const showChildren =
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
              className={styles.link}
            >
              {({
                isFocused,
                isHovered,
              }: {
                isFocused?: boolean
                isHovered?: boolean
              }) => {
                const textColor =
                  active || isFocused || isHovered ? activeColor : color

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
              {showChildren ? renderTree(items, nextLevel as Levels) : null}
            </>
          )
        })}
      </Box>
    )
  }

  const TitleText = (
    <Text as="span" variant="h4" color={someActiveLinks ? activeColor : color}>
      {title}
    </Text>
  )

  const Title = titleLink ? (
    <LinkWrapper {...titleLink}>
      <FocusableBox
        component="a"
        href={titleLink.href}
        borderRadius="large"
        className={styles.link}
        {...basePadding}
      >
        {({
          isFocused,
          isHovered,
        }: {
          isFocused?: boolean
          isHovered?: boolean
        }) => {
          const textColor =
            titleLink.active || isFocused || isHovered ? activeColor : color

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
      {renderTree(items)}
    </Box>
  )
}

const DefaultLinkWrapper = ({ children }: { children: ReactElement }) => {
  return children ?? null
}
