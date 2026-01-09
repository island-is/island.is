import { SetStateAction } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, TextInput } from '@contentful/f36-components'

import { FormFieldHeading } from '../FormFieldHeading'
import { WebChatType, type ZendeskConfiguration } from './types'

interface SectionProps {
  sdk: FieldExtensionSDK
  value: ZendeskConfiguration
  updateValue: (previousValue: SetStateAction<ZendeskConfiguration>) => void
}

export const ZendeskSection = ({ sdk, value, updateValue }: SectionProps) => {
  const sortedLocales = sdk.locales.available.sort((a, b) => b.localeCompare(a))
  return (
    <Flex flexDirection="column">
      {sortedLocales.map((locale) => {
        return (
          <FormControl key={locale}>
            <FormFieldHeading
              text="Zendesk Snippet URL"
              locale={locale}
              localeNames={sdk.locales.names}
            />
            <TextInput
              value={value[WebChatType.Zendesk]?.[locale]?.snippetUrl}
              onChange={(event) => {
                updateValue((previousValue) => ({
                  ...previousValue,
                  [WebChatType.Zendesk]: {
                    ...previousValue[WebChatType.Zendesk],
                    [locale]: {
                      ...previousValue[WebChatType.Zendesk]?.[locale],
                      snippetUrl: event.target.value,
                    },
                  },
                }))
              }}
            />
          </FormControl>
        )
      })}
    </Flex>
  )
}
