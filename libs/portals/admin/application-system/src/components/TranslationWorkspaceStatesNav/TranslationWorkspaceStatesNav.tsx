import { useMemo } from 'react'
import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  EditedTranslations,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import {
  countTranslatedDescriptors,
  getRoleFormLabel,
  type TranslationCount,
} from '../../utils/translationWorkspaceNavigation'
import {
  flattenNavEntries,
  isSameSidebarLocation,
} from '../../utils/translationWorkspaceSelection'
import { m } from '../../lib/messages'

type PersistedByKey = Record<
  string,
  { valueIs: string; valueEn?: string | null }
>

export interface TranslationWorkspaceStatesNavProps {
  states: TemplateStateNav[]
  selectedLocation: SidebarNavLocation | null
  onNavClick: (nav: ScreenIntrospection, location: SidebarNavLocation) => void
  persistedByKey: PersistedByKey
  editedValues: EditedTranslations
  activeLocale: 'is' | 'en'
  ownedNamespaces?: readonly string[]
  formatMessage: FormatMessage
}

interface ScreenListRow {
  key: string
  nav: ScreenIntrospection
  location: SidebarNavLocation
  subtitle: string
  count: TranslationCount
}

const rowKey = (location: SidebarNavLocation) =>
  [
    location.stateKey,
    location.roleId,
    location.sectionId,
    location.subsectionId ?? '',
    location.leafSourceScreenId ?? '',
  ].join('|')

const countTagProps = (
  count: TranslationCount,
): { variant: TagVariant; outlined: boolean } => {
  if (count.total === 0) return { variant: 'red', outlined: false }
  if (count.translated === count.total)
    return { variant: 'mint', outlined: false }
  return { variant: 'blue', outlined: true }
}

export const TranslationWorkspaceStatesNav = ({
  states,
  selectedLocation,
  onNavClick,
  persistedByKey,
  editedValues,
  activeLocale,
  ownedNamespaces = [],
  formatMessage,
}: TranslationWorkspaceStatesNavProps) => {
  const rows = useMemo<ScreenListRow[]>(() => {
    const entries = flattenNavEntries({ states })

    const roleIdsByState = new Map<string, Set<string>>()
    for (const entry of entries) {
      const { stateKey, roleId } = entry.location
      const roleIds = roleIdsByState.get(stateKey) ?? new Set<string>()
      roleIds.add(roleId)
      roleIdsByState.set(stateKey, roleIds)
    }

    return entries.map((entry) => {
      const isMultiRoleState =
        (roleIdsByState.get(entry.location.stateKey)?.size ?? 0) > 1
      const subtitle = isMultiRoleState
        ? `${entry.location.stateName} · ${getRoleFormLabel(
            entry.location.roleId,
            formatMessage,
          )}`
        : entry.location.stateName

      return {
        key: rowKey(entry.location),
        nav: entry.nav,
        location: entry.location,
        subtitle,
        count: countTranslatedDescriptors(
          entry.nav.messageDescriptors,
          persistedByKey,
          editedValues,
          activeLocale,
          ownedNamespaces,
        ),
      }
    })
  }, [
    states,
    persistedByKey,
    editedValues,
    activeLocale,
    ownedNamespaces,
    formatMessage,
  ])

  return (
    <Box width="full" style={{ minWidth: 0 }}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Text variant="medium" fontWeight="semiBold">
          {formatMessage(m.translationScreenStatusColumn)}
        </Text>
        <Text variant="medium" fontWeight="semiBold">
          {formatMessage(m.translationStringsColumn)}
        </Text>
      </Box>

      {rows.map((row, index) => {
        const { variant, outlined } = countTagProps(row.count)
        const isSelected = isSameSidebarLocation(selectedLocation, row.location)

        return (
          <Box
            key={row.key}
            borderTopWidth={index > 0 ? 'standard' : undefined}
            borderColor="blue200"
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              cursor="pointer"
              onClick={() => onNavClick(row.nav, row.location)}
              background={isSelected ? 'blue100' : undefined}
              borderRadius="standard"
              paddingY={2}
              paddingX={1}
              columnGap={2}
            >
              <Box style={{ minWidth: 0 }}>
                <Text variant="medium" truncate>
                  {row.nav.title}
                </Text>
                <Text variant="small" color="dark300" truncate>
                  {row.subtitle}
                </Text>
              </Box>
              <Tag variant={variant} outlined={outlined} disabled>
                {row.count.translated}/{row.count.total}
              </Tag>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
