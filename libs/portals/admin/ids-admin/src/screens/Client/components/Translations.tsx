import React, { useState } from 'react'

import { Box, Input, Stack, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { ClientFormTypes } from '../EditClient.schema'
import { AuthAdminClientTranslation } from '../Client.loader'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'

interface TranslationsProps {
  translations: AuthAdminClientTranslation[]
}
const Translations = ({ translations }: TranslationsProps) => {
  const { formatMessage } = useLocale()
  const [activeTab, setActiveTab] = useState('0')
  const { client } = useClient()
  const [copyTranslations, setCopyTranslations] = useEnvironmentState(
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
    <FormCard
      title={formatMessage(m.translations)}
      intent={ClientFormTypes.translations}
      inSync={checkEnvironmentsSync(client.environments, ['displayName'])}
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
    </FormCard>
  )
}

export default Translations
