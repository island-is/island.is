// TODO: make this reuseable component?
// - <Sidebar> has a bunch of some search specific code and <SidebarBox> is too barebones

import {
  Box,
  Divider,
  FocusableBox,
  Link,
  LinkProps,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import React, { FC, ReactNode } from 'react'
import * as styles from './RegulationsSidebarBox.treat'

type RegulationsSidebarBoxColorAttributes =
  | 'color'
  | 'dividerColor'
  | 'backgroundColor'

const colorSchemeColors: Record<
  keyof typeof styles.colorScheme,
  Record<RegulationsSidebarBoxColorAttributes, Colors>
> = {
  purple: {
    color: 'dark400',
    dividerColor: 'alternate' as Colors,
    backgroundColor: 'purple100',
  },
  blueberry: {
    color: 'blueberry600',
    dividerColor: 'blueberry200',
    backgroundColor: 'blueberry100',
  },
  blue: {
    color: 'blue600',
    dividerColor: 'blue200',
    backgroundColor: 'blue100',
  },
}

type RegulationsSidebarBoxProps = {
  title: string | React.ReactElement
  colorScheme: 'purple' | 'blueberry' | 'blue'
}

export const RegulationsSidebarBox: FC<RegulationsSidebarBoxProps> = ({
  title,
  children,
  colorScheme = 'blueberry',
}) => {
  const color = colorSchemeColors[colorScheme]['color']
  const backgroundColor = colorSchemeColors[colorScheme]['backgroundColor']
  const dividerColor = colorSchemeColors[colorScheme]['dividerColor'] as
    | 'alternate'
    | 'blueberry200'

  return (
    <Box
      background={backgroundColor}
      borderRadius="large"
      padding={[3, 3, 4]}
      position="relative"
      marginBottom={2}
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
  <FocusableBox>
    {(f: Record<'isFocused' | 'isHovered', boolean>) => (
      <Text
        color={f.isFocused || f.isHovered ? 'blueberry400' : 'blueberry600'}
        fontWeight={props.current ? 'medium' : undefined}
      >
        <Link
          href={props.href}
          underline="normal"
          aria-label={props['aria-label']}
        >
          {props.children}
        </Link>
      </Text>
    )}
  </FocusableBox>
)
