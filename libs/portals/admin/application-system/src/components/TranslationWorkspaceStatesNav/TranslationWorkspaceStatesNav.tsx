import { Box, Text, AccordionItem, Accordion } from '@island.is/island-ui/core'
import type {
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import {
  buildSectionLeafNavigationScreen,
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
  getRoleFormAccordionLabel,
} from '../../utils/translationWorkspaceNavigation'

export interface TranslationWorkspaceStatesNavProps {
  states: TemplateStateNav[]
  selectedScreenId: string | undefined
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
}

export const TranslationWorkspaceStatesNav = ({
  states,
  selectedScreenId,
  onNavClick,
}: TranslationWorkspaceStatesNavProps) => (
  <Box width="full" style={{ minWidth: 0 }}>
    <Accordion singleExpand={false}>
      {states.map((state) => (
        <AccordionItem
          key={state.stateKey}
          id={state.stateKey}
          label={`${state.stateName}`}
        >
          <Box paddingLeft={2}>
            <Accordion singleExpand={false}>
              {state.roles.map((role) => (
                <AccordionItem
                  key={`${state.stateKey}-${role.roleId}`}
                  id={`${state.stateKey}-${role.roleId}`}
                  label={getRoleFormAccordionLabel(role.roleId)}
                  labelVariant="medium"
                  labelUse="div"
                  iconVariant="small"
                >
                  {role.form?.sections.map((section) => {
                      const screens = section.screens as ScreenIntrospection[]
                      const { subSections } = section

                      if (subSections.length === 0 && screens.length === 0) {
                        return null
                      }

                      const navRow = (
                        nav: ScreenIntrospection,
                        key: string,
                        location: SidebarNavLocation,
                        labelWeight?: 'semiBold',
                      ) => (
                        <Box
                          key={key}
                          marginLeft={2}
                          marginTop={1}
                          cursor="pointer"
                          onClick={() => onNavClick(nav, location)}
                          background={
                            selectedScreenId === nav.id ? 'blue100' : undefined
                          }
                          borderRadius="standard"
                          padding={1}
                        >
                          <Text
                            variant="small"
                            fontWeight={labelWeight}
                          >
                            {nav.title}
                          </Text>
                        </Box>
                      )

                      if (subSections.length === 0) {
                        const nav = buildSectionNavigationScreen(
                          section.id,
                          section.title,
                          screens,
                        )
                        return (
                          <Box key={section.id} marginBottom={1}>
                            {navRow(
                              nav,
                              section.id,
                              {
                                stateKey: state.stateKey,
                                stateName: state.stateName,
                                roleId: role.roleId,
                                sectionId: section.id,
                                sectionTitle: section.title,
                              },
                              'semiBold',
                            )}
                          </Box>
                        )
                      }

                      return (
                        <Box key={section.id} marginBottom={1}>
                          <Text variant="small" fontWeight="semiBold">
                            {section.title ?? section.id}
                          </Text>
                          {subSections.map((sub) => {
                            const subScreens =
                              sub.screens as ScreenIntrospection[]
                            if (subScreens.length === 0) {
                              return null
                            }
                            const nav = buildSubSectionNavigationScreen(
                              sub.id,
                              sub.title,
                              subScreens,
                            )
                            return navRow(nav, sub.id, {
                              stateKey: state.stateKey,
                              stateName: state.stateName,
                              roleId: role.roleId,
                              sectionId: section.id,
                              sectionTitle: section.title,
                              subsectionId: sub.id,
                              subsectionTitle: sub.title,
                            })
                          })}
                          {screens.map((screen) => {
                            const nav = buildSectionLeafNavigationScreen(
                              section.id,
                              screen,
                            )
                            return navRow(nav, screen.id, {
                              stateKey: state.stateKey,
                              stateName: state.stateName,
                              roleId: role.roleId,
                              sectionId: section.id,
                              sectionTitle: section.title,
                              leafSourceScreenId: screen.id,
                            })
                          })}
                        </Box>
                      )
                    })}
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
)
