import * as styles from './RegulationsSidebarBox.treat'

// TODO: make this reuseable component?
// - <Sidebar> has a bunch of some search specific code and <SidebarBox> is too barebones

import React, { ReactNode, CSSProperties } from 'react'
import {
  Box,
  Divider,
  Link,
  LinkProps,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import cn from 'classnames'

type RegulationsSidebarBoxProps = {
  title: string | React.ReactElement
  colorScheme?: styles.ColorScheme
  children: NonNullable<ReactNode>
  className?: string
}

export const RegulationsSidebarBox = (props: RegulationsSidebarBoxProps) => {
  const { title, children, colorScheme = 'blueberry', className } = props
  const c = styles.colors[colorScheme]
  const color = c.color
  const backgroundColor = c.backgroundColor
  const dividerColor = c.dividerColor

  return (
    <Box
      background={backgroundColor}
      borderRadius="large"
      padding={[3, 3, 4]}
      paddingBottom={2}
      position="relative"
      marginBottom={0}
      className={className}
      style={
        {
          '--RegSidebarBox-linkColor': c.linkColor,
          '--RegSidebarBox-linkColorHover': c.linkColorHover,
        } as CSSProperties
      }
    >
      <Stack space={[1, 1, 2]}>
        <Text variant="h4" as="h2" color={color}>
          {title}
        </Text>
        <Divider weight={dividerColor} />
        <div>{children}</div>
      </Stack>
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type RegulationsSidebarLinkProps = Pick<LinkProps, 'href'> & {
  current?: boolean
  'aria-label'?: string | undefined
  /** Additional class-name for the link */
  className?: string
  children: NonNullable<ReactNode>
}

export const RegulationsSidebarLink = (props: RegulationsSidebarLinkProps) => (
  <Link href={props.href} pureChildren>
    <a
      className={cn(
        props.className,
        styles.sidebarLink,
        props.current && styles.sidebarLinkCurrent,
      )}
      aria-label={props['aria-label']}
    >
      {props.children}
    </a>
  </Link>
)
