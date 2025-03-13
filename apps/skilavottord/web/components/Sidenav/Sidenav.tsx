import { Box, FocusableBox, Icon, Stack, Text } from '@island.is/island-ui/core'

interface SidenavSection {
  title: string
  link: string
  icon?: string
  hidden?: boolean
}

interface SidenavProps {
  title: string
  sections: SidenavSection[]
  activeSection: number
}

type SidenavIcon = 'car' | 'business' | 'lockClosed' | 'municipality'

export const Sidenav = ({ title, sections, activeSection }: SidenavProps) => (
  <Box background="blue100" padding={4} borderRadius="large">
    <Stack space={2}>
      <Text color="blue600" variant="eyebrow">
        {title}
      </Text>
      <Stack space={3}>
        {sections.map((section, index) => {
          if (!section?.title || section.hidden) return null
          return (
            <FocusableBox
              key={index}
              display="flex"
              href={section.link}
              alignItems="center"
            >
              <Box paddingRight={2} display="flex" alignItems="center">
                <Icon
                  icon={section.icon as SidenavIcon}
                  type="outline"
                  color={index === activeSection ? 'blue600' : 'blue300'}
                />
              </Box>
              <Text
                color="blue600"
                fontWeight={index === activeSection ? 'semiBold' : 'regular'}
              >
                {section.title}
              </Text>
            </FocusableBox>
          )
        })}
      </Stack>
    </Stack>
  </Box>
)

export default Sidenav
