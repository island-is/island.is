import * as styles from './RegulationsSidebarBox.treat'

// TODO: make this reuseable component?
// - <Sidebar> has a bunch of some search specific code and <SidebarBox> is too barebones

import {
  Box,
  Divider,
  Link,
  LinkProps,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import React, { FC, ReactNode, CSSProperties } from 'react'

type RegulationsSidebarBoxProps = {
  title: string | React.ReactElement
  colorScheme?: styles.ColorScheme
}

export const RegulationsSidebarBox: FC<RegulationsSidebarBoxProps> = ({
  title,
  children,
  colorScheme = 'blueberry',
}) => {
  const c = styles.colors[colorScheme]
  const color = c.color
  const backgroundColor = c.backgroundColor
  const dividerColor = c.dividerColor

  return (
    <Box
      background={backgroundColor}
      borderRadius="large"
      padding={[3, 3, 4]}
      position="relative"
      marginBottom={2}
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
        {children}
      </Stack>
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type RegulationsSidebarLinkProps = Pick<LinkProps, 'href'> & {
  current?: boolean
  'aria-label'?: string | undefined
  children: ReactNode
}

export const RegulationsSidebarLink: FC<RegulationsSidebarLinkProps> = (
  props,
) => (
  <Link href={props.href} pureChildren>
    <a
      className={
        styles.sidebarLink +
        (props.current ? ' ' + styles.sidebarLinkCurrent : '')
      }
      aria-label={props['aria-label']}
    >
      {props.children}
    </a>
  </Link>
)
