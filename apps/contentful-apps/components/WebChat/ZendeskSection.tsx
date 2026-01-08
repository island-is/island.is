import { SetStateAction } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, TextInput } from '@contentful/f36-components'

import { FormFieldHeading } from '../FormFieldHeading'
import type { ZendeskConfiguration } from './types'

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
              value={value.snippetUrl?.[locale]}
              onChange={(event) => {
                updateValue((previousValue) => ({
                  ...previousValue,
                  snippetUrl: {
                    ...previousValue.snippetUrl,
                    [locale]: event.target.value,
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
