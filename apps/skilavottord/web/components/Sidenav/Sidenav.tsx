import React from 'react'
import {
  Box,
  Divider,
  FocusableBox,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface SidenavSection {
  title: string
  link: string
  icon?: string
}

interface SidenavProps {
  title: string
  sections: SidenavSection[]
  activeSection: number
}

type SidenavIcon = 'car' | 'business'

const Sidenav = ({ title, sections, activeSection }: SidenavProps) => (
  <Box background="purple100" padding={4} borderRadius="large">
    <Stack space={3}>
      <Text variant="h4">{title}</Text>
      <Divider weight="alternate" />
      <Stack space={2}>
        {sections.map((section, index) => (
          <FocusableBox
            key={index}
            display="flex"
            href={section.link}
            alignItems="center"
          >
            <Box paddingRight={1}>
              <Icon
                icon={section.icon as SidenavIcon}
                type="outline"
                color="dark300"
              />
            </Box>
            <Text variant={index === activeSection ? 'h5' : 'default'}>
              {section.title}
            </Text>
          </FocusableBox>
        ))}
      </Stack>
    </Stack>
  </Box>
)

export default Sidenav
