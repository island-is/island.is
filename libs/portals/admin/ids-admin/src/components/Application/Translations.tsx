import { Box, Input, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'

const BasicInfoContent = ({ translations }: any) => {
  const { formatMessage } = useLocale()
  const [activeTab, setActiveTab] = useState('0')
  const [copyTranslations, setCopyTranslations] = useState(
    structuredClone(translations),
  )
  const [changed, setChanged] = useState(false)

  const onChangeTranslations = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const temp = copyTranslations
    temp[+activeTab][event.target.name] = event.target.value
    setCopyTranslations([...temp])
  }

  useEffect(() => {
    setChanged(
      copyTranslations[+activeTab].displayName !==
        translations[+activeTab].displayName,
    )
  }, [copyTranslations, translations, activeTab])

  return (
    <ContentCard
      title={formatMessage(m.translations)}
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments)
      }}
      changed={changed}
    >
      <Stack space={3}>
        <Tabs
          label={formatMessage(m.translations)}
          size="md"
          selected={activeTab}
          onChange={setActiveTab}
          contentBackground="white"
          tabs={copyTranslations.map((translation: any, index: number) => {
            return {
              label: translation.locale === 'is' ? 'Íslenska' : 'English',
              content: (
                <Box marginTop="gutter">
                  <Input
                    backgroundColor="blue"
                    type="text"
                    size="sm"
                    onChange={(e) => onChangeTranslations(e)}
                    name="displayName"
                    value={copyTranslations[index].displayName}
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

export default BasicInfoContent
