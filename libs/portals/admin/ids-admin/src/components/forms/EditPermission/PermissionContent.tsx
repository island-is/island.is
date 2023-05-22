import React, { useState } from 'react'

import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { Box, Input, Stack, Tabs, Text } from '@island.is/island-ui/core'

import { m } from '../../../lib/messages'
import { FormCard } from '../../../shared/components/FormCard'
import { usePermission } from '../../Permission/PermissionContext'
import { PermissionFormTypes } from './EditPermission.action'
import { Languages } from '../../../shared/utils/languages'
import { useErrorFormatMessage } from '../../../shared/hooks/useFormatErrorMessage'

type Locales = Languages.IS | Languages.EN
type ErrorKeys = `${Locales}_description` | `${Locales}_displayName`

export const PermissionContent = () => {
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const { selectedPermission, actionData, permission } = usePermission()
  const [activeTab, setActiveTab] = useState<Languages>(Languages.IS)

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
        <Box display="flex" flexDirection="column" rowGap={5}>
          <Stack space={1}>
            <Input
              backgroundColor="blue"
              type="text"
              size="sm"
              name={`${langKey}_displayName`}
              defaultValue={getTranslatedValue(
                selectedPermission.displayName,
                langKey,
              )}
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
              defaultValue={getTranslatedValue(
                selectedPermission.description,
                langKey,
              )}
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
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Tabs
        size="md"
        contentBackground="white"
        selected={activeTab}
        label={formatMessage(m.translations)}
        onChange={() =>
          setActiveTab(activeTab === Languages.IS ? Languages.EN : Languages.IS)
        }
        tabs={Object.values(Languages).map(renderTabs)}
      />
    </FormCard>
  )
}
