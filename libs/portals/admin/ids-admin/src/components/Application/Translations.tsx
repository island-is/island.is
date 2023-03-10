import { Box, Input, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'

const BasicInfoContent = ({ translations }: any) => {
  const { formatMessage } = useLocale()

  const [copyTranslations, setCopyTranslations] = useState(translations)

  useEffect(() => {
    setCopyTranslations(translations)
  }, [translations])

  const onChangeTranslations = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const temp = copyTranslations
    temp[index][event.target.name] = event.target.value
    setCopyTranslations(temp)
  }

  const [changed, setChanged] = useState(false)
  useEffect(() => {
    setChanged(
      JSON.stringify(copyTranslations) !== JSON.stringify(translations),
    )
  }, [copyTranslations, translations])

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
                    onChange={(e) => onChangeTranslations(e, index)}
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
