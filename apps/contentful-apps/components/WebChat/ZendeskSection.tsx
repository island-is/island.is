import { SetStateAction, useMemo } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Flex,
  FormControl,
  Select,
  TextInput,
} from '@contentful/f36-components'

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
              <Flex
                flexDirection="column"
                paddingLeft="spacingM"
                gap="spacingS"
              >
                <Flex flexDirection="column">
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
                <Flex flexDirection="column">
                  <FormControl.Label>
                    Zendesk Chat Bubble Variant (default: Blue circle)
                  </FormControl.Label>
                  <Select
                    value={
                      value?.[locale]?.[WebChatType.Zendesk]
                        ?.chatBubbleVariant ?? 'circle'
                    }
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.Zendesk]: {
                            ...previousValue?.[locale]?.[WebChatType.Zendesk],
                            chatBubbleVariant: event.target.value as
                              | 'default'
                              | 'circle',
                          },
                        },
                      }))
                    }}
                  >
                    <Select.Option value="default">
                      Default bubble
                    </Select.Option>
                    <Select.Option value="circle">Blue circle</Select.Option>
                  </Select>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>
        )
      })}
    </Flex>
  )
}
