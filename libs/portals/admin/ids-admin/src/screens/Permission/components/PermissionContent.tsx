import React, { useState } from 'react'

import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { Box, Input, Stack, Tabs, Text } from '@island.is/island-ui/core'
import { AuthAdminTranslatedValue } from '@island.is/api/schema'

import { m } from '../../../lib/messages'
import { FormCard } from '../../../components/FormCard/FormCard'
import { usePermission } from '../PermissionContext'
import { PermissionFormTypes } from '../EditPermission.schema'
import { Languages } from '../../../utils/languages'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'

type Locales = Languages.IS | Languages.EN
type ErrorKeys = `${Locales}_description` | `${Locales}_displayName`

const languages = Object.values(Languages)

/**
 * Creates a languages state object for the translated values
 *
 * @example result
 * {
 *   is: 'Íslenska',
 *   en: 'English'
 * }
 */
const createLanguagesState = (value: AuthAdminTranslatedValue[]) =>
  Object.fromEntries(
    languages.map((langKey) => [langKey, getTranslatedValue(value, langKey)]),
  )

export const PermissionContent = () => {
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const { selectedPermission, actionData, permission } = usePermission()
  const [activeTab, setActiveTab] = useState<Languages>(Languages.IS)
  const [displayNames, setDisplayNames] = useEnvironmentState(
    createLanguagesState(selectedPermission.displayName),
  )
  const [descriptions, setDescriptions] = useEnvironmentState(
    createLanguagesState(selectedPermission.description),
  )

  const renderTabs = (langKey: Languages) => {
    // Since we transform the Zod schema to strip out the locale prefixed keys then we need to
    // cast the errors to the correct type
    const errors = actionData?.errors as {
      [Key in ErrorKeys]?: string
    }

    return {
      id: langKey,
      label: formatMessage(langKey === Languages.IS ? m.icelandic : m.english),
      content: (
        <Box display="flex" flexDirection="column" rowGap={5} marginTop={4}>
          <Stack space={1}>
            <Input
              backgroundColor="blue"
              type="text"
              size="sm"
              name={`${langKey}_displayName`}
              onChange={(e) => {
                setDisplayNames({
                  ...displayNames,
                  [langKey]: e.target.value,
                })
              }}
              value={displayNames[langKey]}
              label={formatMessage(m.displayName)}
              errorMessage={formatErrorMessage(
                errors?.[`${langKey}_displayName`],
              )}
            />
            <Text variant="small">
              {formatMessage(m.displayNameDescription)}
            </Text>
          </Stack>
          <Stack space={1}>
            <Input
              backgroundColor="blue"
              type="text"
              size="sm"
              name={`${langKey}_description`}
              onChange={(e) => {
                setDescriptions({
                  ...descriptions,
                  [langKey]: e.target.value,
                })
              }}
              value={descriptions[langKey]}
              label={formatMessage(m.description)}
              errorMessage={formatErrorMessage(
                errors?.[`${langKey}_description`],
              )}
            />
            <Text variant={'small'}>{formatMessage(m.descriptionInfo)}</Text>
          </Stack>
        </Box>
      ),
    }
  }

  return (
    <FormCard
      title={formatMessage(m.content)}
      intent={PermissionFormTypes.CONTENT}
      headerMarginBottom={3}
      inSync={checkEnvironmentsSync(permission.environments, [
        'description',
        'displayName',
      ])}
    >
      <Tabs
        size="md"
        contentBackground="white"
        selected={activeTab}
        label={formatMessage(m.translations)}
        onChange={() =>
          setActiveTab(activeTab === Languages.IS ? Languages.EN : Languages.IS)
        }
        tabs={languages.map(renderTabs)}
      />
    </FormCard>
  )
}
