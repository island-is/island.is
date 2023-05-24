import { Box, Input, Stack, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import { useEnvironmentState } from '../../shared/hooks/useEnvironmentState'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { AuthAdminClientTranslation } from '../../screens/Client/Client.loader'
import { useMultiEnvSupport } from '../../shared/hooks/useMultiEnvSupport'

interface TranslationsProps {
  translations: AuthAdminClientTranslation[]
  inSync?: boolean
}
const Translations = ({ translations, inSync = true }: TranslationsProps) => {
  const { formatMessage } = useLocale()
  const [activeTab, setActiveTab] = useState<string>('0')
  const [copyTranslations, setCopyTranslations] = useEnvironmentState(
    ['is', 'en'].map((locale) => ({
      locale: locale,
      value: translations.find((t) => t.locale === locale)?.value || '',
    })),
  )

  const { shouldSupportMultiEnv } = useMultiEnvSupport()

  const onChangeTranslations = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const temp = copyTranslations
    temp[+activeTab].value = event.target.value
    setCopyTranslations([...temp])
  }

  return (
    <ContentCard
      title={formatMessage(m.translations)}
      intent={ClientFormTypes.translations}
      inSync={inSync}
      shouldSupportMultiEnvironment={shouldSupportMultiEnv}
    >
      <Stack space={3}>
        <Tabs
          label={formatMessage(m.translations)}
          size="md"
          selected={activeTab}
          onChange={setActiveTab}
          contentBackground="white"
          tabs={copyTranslations.map((language) => ({
            label: language.locale === 'is' ? 'Íslenska' : 'English',
            content: (
              <Box marginTop="gutter">
                <Input
                  backgroundColor="blue"
                  type="text"
                  size="sm"
                  onChange={(e) => onChangeTranslations(e)}
                  name={language.locale + '_displayName'}
                  value={language.value}
                  label={formatMessage(m.displayName)}
                />
                <Text variant={'small'} marginTop={1}>
                  {formatMessage(m.displayNameDescription)}
                </Text>
              </Box>
            ),
          }))}
        />
      </Stack>
    </ContentCard>
  )
}

export default Translations
