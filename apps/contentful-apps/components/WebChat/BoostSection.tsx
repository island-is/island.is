import { SetStateAction } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, TextInput } from '@contentful/f36-components'

import { type BoostConfiguration, WebChatType } from './types'

interface SectionProps {
  sdk: FieldExtensionSDK
  value: BoostConfiguration
  updateValue: (previousValue: SetStateAction<BoostConfiguration>) => void
}

export const BoostSection = ({ sdk, value, updateValue }: SectionProps) => {
  const sortedLocales = sdk.locales.available.sort((a, b) => b.localeCompare(a))
  return (
    <Flex flexDirection="column">
      {sortedLocales.map((locale) => {
        return (
          <FormControl key={locale}>
            <Flex flexDirection="column">
              <FormControl.Label>
                {sdk.locales.names[locale]} settings
              </FormControl.Label>
              <Flex
                flexDirection="column"
                paddingLeft="spacingM"
                gap="spacingS"
              >
                <Flex flexDirection="column">
                  <FormControl.Label>ID</FormControl.Label>
                  <TextInput
                    value={value[WebChatType.Boost]?.[locale]?.id}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.Boost]: {
                          ...previousValue[WebChatType.Boost],
                          [locale]: {
                            ...previousValue[WebChatType.Boost]?.[locale],
                            id: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <FormControl.Label>Conversation Key</FormControl.Label>
                  <TextInput
                    value={value[WebChatType.Boost]?.[locale]?.conversationKey}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.Boost]: {
                          ...previousValue[WebChatType.Boost],
                          [locale]: {
                            ...previousValue[WebChatType.Boost]?.[locale],
                            conversationKey: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <FormControl.Label>URL</FormControl.Label>
                  <TextInput
                    value={value[WebChatType.Boost]?.[locale]?.url}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.Boost]: {
                          ...previousValue[WebChatType.Boost],
                          [locale]: {
                            ...previousValue[WebChatType.Boost]?.[locale],
                            url: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </FormControl>
        )
      })}
    </Flex>
  )
}
