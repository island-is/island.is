import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Text, AccordionItem, Accordion } from '@island.is/island-ui/core'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import {
  buildSectionLeafNavigationScreen,
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
  descriptorsForSectionNavigation,
  mergeMessageDescriptorLists,
  countTranslationsForRole,
  countTranslationsForScreens,
  countTranslationsForState,
  getRoleFormAccordionLabel,
} from '../../utils/translationWorkspaceNavigation'
import type { TranslationCount } from '../../utils/translationWorkspaceNavigation'
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
  ownedNamespaces?: readonly string[]
}

const roleAccordionId = (stateKey: string, roleId: string) =>
  `${stateKey}-${roleId}`

const selectedAccordionIds = (
  location: SidebarNavLocation | null,
): string[] => {
  if (!location) return []
  return [
    location.stateKey,
    roleAccordionId(location.stateKey, location.roleId),
  ]
}

export const TranslationWorkspaceStatesNav = ({
  states,
  selectedScreenId,
  selectedLocation,
  onNavClick,
  persistedByKey,
  editedValues,
  activeLocale,
  ownedNamespaces = [],
}: TranslationWorkspaceStatesNavProps) => {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(selectedAccordionIds(selectedLocation)),
  )

  useEffect(() => {
    const ids = selectedAccordionIds(selectedLocation)
    if (ids.length === 0) return
    setExpandedIds((prev) => {
      if (ids.every((id) => prev.has(id))) return prev
      const next = new Set(prev)
      for (const id of ids) next.add(id)
      return next
    })
  }, [selectedLocation])

  const handleToggle = useCallback((id: string, expanded: boolean) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (expanded) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const translationCounts = useMemo(() => {
    const byState: Record<string, TranslationCount> = {}
    const byRole: Record<string, TranslationCount> = {}
    const byScreens: Record<string, TranslationCount> = {}

    const countScreens = (
      key: string,
      screens: ScreenIntrospection[],
      extraDescriptors: readonly MessageDescriptor[] = [],
    ): TranslationCount => {
      const count = countTranslationsForScreens(
        screens,
        persistedByKey,
        editedValues,
        activeLocale,
        ownedNamespaces,
        extraDescriptors,
      )
      byScreens[key] = count
      return count
    }

    for (const state of states) {
      byState[state.stateKey] = countTranslationsForState(
        state,
        persistedByKey,
        editedValues,
        activeLocale,
        ownedNamespaces,
      )
      for (const role of state.roles) {
        const roleKey = roleAccordionId(state.stateKey, role.roleId)
        byRole[roleKey] = countTranslationsForRole(
          role,
          persistedByKey,
          editedValues,
          activeLocale,
          ownedNamespaces,
        )
        for (const section of role.form?.sections ?? []) {
          const screens = section.screens as ScreenIntrospection[]
          const subScreens = section.subSections.flatMap(
            (sub) => sub.screens as ScreenIntrospection[],
          )
          const sectionTitleDescriptors = descriptorsForSectionNavigation(
            section.titleMessageDescriptor,
            [],
          )
          countScreens(
            `${roleKey}:section-all:${section.id}`,
            [...screens, ...subScreens],
            mergeMessageDescriptorLists(
              sectionTitleDescriptors,
              ...section.subSections.map((sub) =>
                descriptorsForSectionNavigation(
                  sub.titleMessageDescriptor,
                  [],
                ),
              ),
            ),
          )
          countScreens(
            `${roleKey}:section:${section.id}`,
            screens,
            sectionTitleDescriptors,
          )
          for (const sub of section.subSections) {
            countScreens(
              `${roleKey}:sub:${sub.id}`,
              sub.screens as ScreenIntrospection[],
              descriptorsForSectionNavigation(
                sub.titleMessageDescriptor,
                [],
              ),
            )
          }
          for (const screen of screens) {
            countScreens(`${roleKey}:leaf:${screen.id}`, [screen])
          }
        }
      }
    }

    return { byState, byRole, byScreens }
  }, [states, persistedByKey, editedValues, activeLocale, ownedNamespaces])

  return (
    <Box width="full" style={{ minWidth: 0 }}>
      <Accordion singleExpand={false}>
        {states.map((state) => {
          const stateCount = translationCounts.byState[state.stateKey] ?? {
            translated: 0,
            total: 0,
          }

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
                expanded={expandedIds.has(state.stateKey)}
                onToggle={(expanded) => handleToggle(state.stateKey, expanded)}
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
                      const roleKey = roleAccordionId(
                        state.stateKey,
                        role.roleId,
                      )
                      const roleCount = translationCounts.byRole[roleKey] ?? {
                        translated: 0,
                        total: 0,
                      }

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
                            expanded={expandedIds.has(
                              roleAccordionId(state.stateKey, role.roleId),
                            )}
                            onToggle={(expanded) =>
                              handleToggle(
                                roleAccordionId(state.stateKey, role.roleId),
                                expanded,
                              )
                            }
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
                            {role.formLoadError && (
                              <Box marginLeft={2} marginBottom={1}>
                                <Text variant="small" color="red600">
                                  Form failed to load: {role.formLoadError}
                                </Text>
                              </Box>
                            )}
                            {!role.formLoadError && !role.form && (
                              <Box marginLeft={2} marginBottom={1}>
                                <Text variant="small" color="dark300">
                                  No form returned for this role.
                                </Text>
                              </Box>
                            )}
                            {!role.formLoadError &&
                              role.form &&
                              (role.form.sections ?? []).length === 0 && (
                                <Box marginLeft={2} marginBottom={1}>
                                  <Text variant="small" color="dark300">
                                    Form loaded with no sections.
                                  </Text>
                                </Box>
                              )}
                            {(role.form?.sections ?? []).map(
                              (section, sectionIndex) => {
                                const screens =
                                  section.screens as ScreenIntrospection[]
                                const { subSections } = section
                                const sectionNumber = sectionIndex + 1

                                const sectionCount =
                                  translationCounts.byScreens[
                                    `${roleKey}:section-all:${section.id}`
                                  ] ?? { translated: 0, total: 0 }

                                const navRow = (
                                  nav: ScreenIntrospection,
                                  key: string,
                                  location: SidebarNavLocation,
                                  labelWeight?: 'semiBold',
                                  screensKey?: string,
                                ) => {
                                  const rowCount = screensKey
                                    ? translationCounts.byScreens[screensKey]
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
                                            {rowCount.translated}/
                                            {rowCount.total}
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
                                        `${roleKey}:section:${section.id}`,
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
                                      <Text
                                        variant="small"
                                        fontWeight="semiBold"
                                      >
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
                                      const nav =
                                        buildSubSectionNavigationScreen(
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
                                        `${roleKey}:sub:${sub.id}`,
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
                                        `${roleKey}:leaf:${screen.id}`,
                                      )
                                    })}
                                  </Box>
                                )
                              },
                            )}
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
}
