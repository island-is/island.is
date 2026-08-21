import { Box, Text, AccordionItem, Accordion } from '@island.is/island-ui/core'
import type {
  EditedTranslations,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import {
  buildSectionLeafNavigationScreen,
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
  countTranslationsForRole,
  countTranslationsForScreens,
  countTranslationsForState,
  getRoleFormAccordionLabel,
  type TranslationCount,
} from '../../utils/translationWorkspaceNavigation'
import * as styles from './TranslationWorkspaceStatesNav.css'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

const TranslationCountLabel = ({
  label,
  count,
  variant = 'default',
}: {
  label: string
  count: TranslationCount
  variant?: 'default' | 'small'
}) => {
  if (count.total === 0) return <>{label}</>

  const isComplete = count.translated === count.total

  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <span>{label}</span>
      <Text
        variant={variant === 'small' ? 'small' : 'default'}
        as="span"
        color={isComplete ? 'mint600' : 'dark300'}
      >
        ({count.translated}/{count.total})
      </Text>
    </Box>
  )
}

export interface TranslationWorkspaceStatesNavProps {
  states: TemplateStateNav[]
  selectedScreenId: string | undefined
  selectedLocation: SidebarNavLocation | null
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
  persistedByKey: PersistedByKey
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
}

export const TranslationWorkspaceStatesNav = ({
  states,
  selectedScreenId,
  selectedLocation,
  onNavClick,
  persistedByKey,
  editedValues,
  activeLocale,
}: TranslationWorkspaceStatesNavProps) => (
  <Box width="full" style={{ minWidth: 0 }}>
    <Accordion singleExpand={false}>
      {states.map((state) => {
        const stateCount = countTranslationsForState(
          state,
          persistedByKey,
          editedValues,
          activeLocale,
        )

        const isStateSelected = selectedLocation?.stateKey === state.stateKey

        return (
          <Box
            key={state.stateKey}
            className={`${styles.accordionItemWrapper}${
              isStateSelected ? ` ${styles.selectedAccordionItem}` : ''
            }`}
          >
            <AccordionItem
              id={state.stateKey}
              label={
                <TranslationCountLabel
                  label={state.stateName}
                  count={stateCount}
                />
              }
            >
              <Box paddingLeft={2}>
                <Accordion singleExpand={false}>
                  {state.roles.map((role) => {
                    const roleCount = countTranslationsForRole(
                      role,
                      persistedByKey,
                      editedValues,
                      activeLocale,
                    )

                    const isRoleSelected =
                      isStateSelected &&
                      selectedLocation?.roleId === role.roleId

                    return (
                      <Box
                        key={`${state.stateKey}-${role.roleId}`}
                        className={`${styles.accordionItemWrapper}${
                          isRoleSelected
                            ? ` ${styles.selectedAccordionItem}`
                            : ''
                        }`}
                      >
                        <AccordionItem
                          id={`${state.stateKey}-${role.roleId}`}
                          label={
                            <TranslationCountLabel
                              label={getRoleFormAccordionLabel(role.roleId)}
                              count={roleCount}
                              variant="small"
                            />
                          }
                          labelVariant="medium"
                          labelUse="div"
                          iconVariant="small"
                        >
                          {(role.form?.sections ?? [])
                            .filter((section) => {
                              const hasScreens =
                                (section.screens as ScreenIntrospection[])
                                  .length > 0
                              const hasSubs = section.subSections.length > 0
                              return hasScreens || hasSubs
                            })
                            .map((section, sectionIndex) => {
                              const screens =
                                section.screens as ScreenIntrospection[]
                              const { subSections } = section
                              const sectionNumber = sectionIndex + 1

                              const allSectionScreens = [
                                ...screens,
                                ...subSections.flatMap(
                                  (s) => s.screens as ScreenIntrospection[],
                                ),
                              ]
                              const sectionCount = countTranslationsForScreens(
                                allSectionScreens,
                                persistedByKey,
                                editedValues,
                                activeLocale,
                              )

                              const navRow = (
                                nav: ScreenIntrospection,
                                key: string,
                                location: SidebarNavLocation,
                                labelWeight?: 'semiBold',
                                rowScreens?: ScreenIntrospection[],
                              ) => {
                                const rowCount = rowScreens
                                  ? countTranslationsForScreens(
                                      rowScreens,
                                      persistedByKey,
                                      editedValues,
                                      activeLocale,
                                    )
                                  : undefined

                                return (
                                  <Box
                                    key={key}
                                    marginLeft={2}
                                    marginTop={1}
                                    cursor="pointer"
                                    onClick={() => onNavClick(nav, location)}
                                    background={
                                      selectedScreenId === nav.id
                                        ? 'blue100'
                                        : undefined
                                    }
                                    borderRadius="standard"
                                    padding={1}
                                  >
                                    <Box
                                      display="flex"
                                      justifyContent="spaceBetween"
                                      alignItems="center"
                                    >
                                      <Text
                                        variant="small"
                                        fontWeight={labelWeight}
                                      >
                                        {nav.title}
                                      </Text>
                                      {rowCount && rowCount.total > 0 && (
                                        <Text
                                          variant="small"
                                          color={
                                            rowCount.translated ===
                                            rowCount.total
                                              ? 'mint600'
                                              : 'dark300'
                                          }
                                        >
                                          {rowCount.translated}/{rowCount.total}
                                        </Text>
                                      )}
                                    </Box>
                                  </Box>
                                )
                              }

                              if (subSections.length === 0) {
                                const nav = buildSectionNavigationScreen(
                                  section.id,
                                  section.title,
                                  section.titleMessageDescriptor,
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
                                      screens,
                                    )}
                                  </Box>
                                )
                              }

                              return (
                                <Box key={section.id} marginBottom={1}>
                                  <Box
                                    display="flex"
                                    justifyContent="spaceBetween"
                                    alignItems="center"
                                  >
                                    <Text variant="small" fontWeight="semiBold">
                                      {sectionNumber}.{' '}
                                      {section.title ?? section.id}
                                    </Text>
                                    {sectionCount.total > 0 && (
                                      <Text
                                        variant="small"
                                        color={
                                          sectionCount.translated ===
                                          sectionCount.total
                                            ? 'mint600'
                                            : 'dark300'
                                        }
                                      >
                                        {sectionCount.translated}/
                                        {sectionCount.total}
                                      </Text>
                                    )}
                                  </Box>
                                  {subSections.map((sub) => {
                                    const subScreens =
                                      sub.screens as ScreenIntrospection[]
                                    if (subScreens.length === 0) {
                                      return null
                                    }
                                    const nav = buildSubSectionNavigationScreen(
                                      sub.id,
                                      sub.title,
                                      sub.titleMessageDescriptor,
                                      subScreens,
                                    )
                                    return navRow(
                                      nav,
                                      sub.id,
                                      {
                                        stateKey: state.stateKey,
                                        stateName: state.stateName,
                                        roleId: role.roleId,
                                        sectionId: section.id,
                                        sectionTitle: section.title,
                                        subsectionId: sub.id,
                                        subsectionTitle: sub.title,
                                      },
                                      undefined,
                                      subScreens,
                                    )
                                  })}
                                  {screens.map((screen) => {
                                    const nav =
                                      buildSectionLeafNavigationScreen(
                                        section.id,
                                        screen,
                                      )
                                    return navRow(
                                      nav,
                                      screen.id,
                                      {
                                        stateKey: state.stateKey,
                                        stateName: state.stateName,
                                        roleId: role.roleId,
                                        sectionId: section.id,
                                        sectionTitle: section.title,
                                        leafSourceScreenId: screen.id,
                                      },
                                      undefined,
                                      [screen],
                                    )
                                  })}
                                </Box>
                              )
                            })}
                        </AccordionItem>
                      </Box>
                    )
                  })}
                </Accordion>
              </Box>
            </AccordionItem>
          </Box>
        )
      })}
    </Accordion>
  </Box>
)
