import { Box, Input, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
import { AuthApplicationTranslation } from './Application.loader'

interface TranslationsProps {
  translations: AuthApplicationTranslation[]
}
const Translations = ({ translations }: TranslationsProps) => {
  const { formatMessage } = useLocale()
  const [activeTab, setActiveTab] = useState<string>('0')
  const [copyTranslations, setCopyTranslations] = useState(
    ['is', 'en'].map((locale) => ({
      locale: locale,
      value: translations.find((t) => t.locale === locale)?.value || '',
    })),
  )

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
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments)
      }}
    >
      <Stack space={3}>
        <Tabs
          label={formatMessage(m.translations)}
          size="md"
          selected={activeTab}
          onChange={setActiveTab}
          contentBackground="white"
          tabs={copyTranslations.map((language) => {
            return {
              label: language.locale === 'is' ? 'Íslenska' : 'English',
              content: (
                <Box marginTop="gutter">
                  <Input
                    backgroundColor="blue"
                    type="text"
                    size="sm"
                    onChange={(e) => onChangeTranslations(e)}
                    name={language.locale + '-displayName'}
                    value={language.value}
                    label={formatMessage(m.displayName)}
                  />
                </Box>
              ),
            }
          })}
        />
      </Stack>
    </ContentCard>
  )
}

export default Translations
