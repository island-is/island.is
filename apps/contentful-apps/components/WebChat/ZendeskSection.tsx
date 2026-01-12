import { SetStateAction, useMemo } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, TextInput } from '@contentful/f36-components'

import { WebChatType, type ZendeskConfiguration } from './types'

interface SectionProps {
  sdk: FieldExtensionSDK
  value: ZendeskConfiguration
  updateValue: (previousValue: SetStateAction<ZendeskConfiguration>) => void
}

export const ZendeskSection = ({ sdk, value, updateValue }: SectionProps) => {
  const sortedLocales = useMemo(
    () => [...sdk.locales.available].sort((a, b) => b.localeCompare(a)),
    [sdk.locales.available],
  )
  return (
    <Flex flexDirection="column">
      {sortedLocales.map((locale) => {
        return (
          <FormControl key={locale}>
            <Flex flexDirection="column">
              <FormControl.Label>
                {sdk.locales.names[locale]} settings
              </FormControl.Label>
              <Flex flexDirection="column" paddingLeft="spacingM">
                <FormControl.Label>Zendesk Snippet URL</FormControl.Label>
                <TextInput
                  value={
                    value?.[locale]?.[WebChatType.Zendesk]?.snippetUrl ?? ''
                  }
                  onChange={(event) => {
                    updateValue((previousValue) => ({
                      ...previousValue,
                      [locale]: {
                        ...previousValue?.[locale],
                        [WebChatType.Zendesk]: {
                          ...previousValue?.[locale]?.[WebChatType.Zendesk],
                          snippetUrl: event.target.value,
                        },
                      },
                    }))
                  }}
                />
              </Flex>
            </Flex>
          </FormControl>
        )
      })}
    </Flex>
  )
}
