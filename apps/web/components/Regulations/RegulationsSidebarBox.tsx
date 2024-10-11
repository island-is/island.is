// TODO: make this reuseable component?
// - <Sidebar> has a bunch of some search specific code and <SidebarBox> is too barebones
import React, { CSSProperties, ReactNode } from 'react'
import cn from 'classnames'

import {
  Box,
  Divider,
  LinkProps,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './RegulationsSidebarBox.css'

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
  rel?: string
}

export const RegulationsSidebarLink = (props: RegulationsSidebarLinkProps) => (
  <LinkV2 href={props.href} pureChildren>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a
      className={cn(
        props.className,
        styles.sidebarLink,
        props.current && styles.sidebarLinkCurrent,
      )}
      aria-label={props['aria-label']}
      rel={props.rel}
    >
      {props.children}
    </a>
  </LinkV2>
)
