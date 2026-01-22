import { SetStateAction, useMemo } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, TextInput } from '@contentful/f36-components'

import { type BoostConfiguration, WebChatType } from './types'

interface SectionProps {
  sdk: FieldExtensionSDK
  value: BoostConfiguration
  updateValue: (previousValue: SetStateAction<BoostConfiguration>) => void
}

export const BoostSection = ({ sdk, value, updateValue }: SectionProps) => {
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
              <Flex
                flexDirection="column"
                paddingLeft="spacingM"
                gap="spacingS"
              >
                <Flex flexDirection="column">
                  <FormControl.Label>ID</FormControl.Label>
                  <TextInput
                    value={value?.[locale]?.[WebChatType.Boost]?.id ?? ''}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.Boost]: {
                            ...previousValue?.[locale]?.[WebChatType.Boost],
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
                    value={
                      value?.[locale]?.[WebChatType.Boost]?.conversationKey ??
                      ''
                    }
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.Boost]: {
                            ...previousValue?.[locale]?.[WebChatType.Boost],
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
                    value={value?.[locale]?.[WebChatType.Boost]?.url ?? ''}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.Boost]: {
                            ...previousValue?.[locale]?.[WebChatType.Boost],
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
