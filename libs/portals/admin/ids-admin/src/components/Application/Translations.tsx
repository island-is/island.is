import {
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Tabs,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
import { AuthApplicationTranslationList } from './Application.loader'
import { Form } from 'react-router-dom'

interface TranslationsProps {
  translations: AuthApplicationTranslationList[]
}
const Translations = ({ translations }: TranslationsProps) => {
  const { formatMessage } = useLocale()
  const [activeTab, setActiveTab] = useState<string>('0')
  const [changed, setChanged] = useState(false)
  const [allEnvironments, setAllEnvironments] = useState<boolean>(false)
  const [copyTranslations, setCopyTranslations] = useState(
    structuredClone(translations),
  )

  const onChangeTranslations = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const temp = copyTranslations
    temp[+activeTab].value = event.target.value
    setCopyTranslations([...temp])
  }

  useEffect(() => {
    setChanged(
      copyTranslations[+activeTab].value !== translations[+activeTab].value,
    )
  }, [copyTranslations, translations, activeTab])

  return (
    <ContentCard
      title={formatMessage(m.translations)}
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments)
      }}
      withForm={false}
      changed={changed}
    >
      <Stack space={3}>
        <Tabs
          label={formatMessage(m.translations)}
          size="md"
          selected={activeTab}
          onChange={setActiveTab}
          contentBackground="white"
          tabs={copyTranslations.map(
            (translation: AuthApplicationTranslationList, index: number) => {
              return {
                label: translation.locale === 'is' ? 'Íslenska' : 'English',
                content: (
                  <Form>
                    <Box marginTop="gutter">
                      <Input
                        backgroundColor="blue"
                        type="text"
                        size="sm"
                        onChange={(e) => onChangeTranslations(e)}
                        name="displayName"
                        value={copyTranslations[index].value}
                        label={formatMessage(m.displayName)}
                      />
                    </Box>
                    <Box
                      alignItems="center"
                      marginTop="containerGutter"
                      display="flex"
                      justifyContent="spaceBetween"
                    >
                      <Checkbox
                        label={formatMessage(m.saveForAllEnvironments)}
                        value={`${allEnvironments}`}
                        disabled={!changed}
                        onChange={() => setAllEnvironments(!allEnvironments)}
                      />
                      <Button disabled={!changed} type="submit">
                        {formatMessage(m.saveSettings)}
                      </Button>
                    </Box>
                  </Form>
                ),
              }
            },
          )}
        />
      </Stack>
    </ContentCard>
  )
}

export default Translations
