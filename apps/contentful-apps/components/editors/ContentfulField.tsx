import { useMemo } from 'react'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import { Field, FieldWrapper } from '@contentful/default-field-editors'
import { Box, FormControl, Text } from '@contentful/f36-components'

import { mapLocalesToFieldApis } from './utils'

export interface ContentfulFieldProps {
  sdk: EditorExtensionSDK
  localeToFieldMapping: Record<string, ReturnType<typeof mapLocalesToFieldApis>>
  fieldID: keyof ContentfulFieldProps['localeToFieldMapping']
  displayName: string
  widgetId?: string
  helpText?: string
}

export const ContentfulField = (props: ContentfulFieldProps) => {
  const availableLocales = useMemo(() => {
    const validLocales = props.sdk.locales.available.filter(
      (locale) => props.localeToFieldMapping[props.fieldID]?.[locale],
    )

    // Make sure that the default locale is at the top
    if (
      validLocales.length > 0 &&
      validLocales[0] !== props.sdk.locales.default
    ) {
      const index = validLocales.findIndex(
        (locale) => locale === props.sdk.locales.default,
      )
      if (index >= 0) {
        validLocales.splice(index, 1)
        validLocales.unshift(props.sdk.locales.default)
      }
    }

    return validLocales
  }, [
    props.fieldID,
    props.localeToFieldMapping,
    props.sdk.locales.available,
    props.sdk.locales.default,
  ])

  return (
    <Box>
      {availableLocales.map((locale) => {
        return (
          <FieldWrapper
            key={locale}
            sdk={props.localeToFieldMapping[props.fieldID][locale]}
            name={props.displayName}
            showFocusBar={false}
            renderHelpText={
              props.helpText
                ? () => {
                    return (
                      <FormControl.HelpText>
                        {props.helpText}
                      </FormControl.HelpText>
                    )
                  }
                : undefined
            }
            renderHeading={() => {
              return (
                <Box
                  style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    gap: '6px',
                  }}
                >
                  <FormControl.Label>{props.displayName}</FormControl.Label>
                  {availableLocales.length > 1 && (
                    <Box
                      style={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        gap: '6px',
                      }}
                    >
                      <Text fontColor="gray500">|</Text>
                      <Text fontColor="gray500">
                        {props.sdk.locales.names[locale]}
                      </Text>
                    </Box>
                  )}
                </Box>
              )
            }}
          >
            <Field
              sdk={props.localeToFieldMapping[props.fieldID][locale]}
              widgetId={props.widgetId}
            />
          </FieldWrapper>
        )
      })}
    </Box>
  )
}
