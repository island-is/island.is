import { SetStateAction, useMemo } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Flex,
  FormControl,
  Radio,
  Stack,
  TextInput,
} from '@contentful/f36-components'

import { type LiveChatConfiguration, WebChatType } from './types'

interface SectionProps {
  sdk: FieldExtensionSDK
  value: LiveChatConfiguration
  updateValue: (previousValue: SetStateAction<LiveChatConfiguration>) => void
}

export const LiveChatSection = ({ sdk, value, updateValue }: SectionProps) => {
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
                  <FormControl.Label>License</FormControl.Label>
                  <TextInput
                    value={
                      value?.[locale]?.[WebChatType.LiveChat]?.license ?? ''
                    }
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.LiveChat]: {
                            ...previousValue?.[locale]?.[WebChatType.LiveChat],
                            license: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <FormControl.Label>Version</FormControl.Label>
                  <TextInput
                    value={
                      value?.[locale]?.[WebChatType.LiveChat]?.version ?? ''
                    }
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.LiveChat]: {
                            ...previousValue?.[locale]?.[WebChatType.LiveChat],
                            version: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <FormControl.Label>Group</FormControl.Label>
                  <TextInput
                    value={value?.[locale]?.[WebChatType.LiveChat]?.group ?? ''}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [locale]: {
                          ...previousValue?.[locale],
                          [WebChatType.LiveChat]: {
                            ...previousValue?.[locale]?.[WebChatType.LiveChat],
                            group: event.target.value,
                          },
                        },
                      }))
                    }}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <FormControl.Label>Show Launcher</FormControl.Label>
                  <Stack flexDirection="row" spacing="spacingS">
                    <Radio
                      isChecked={
                        value?.[locale]?.[WebChatType.LiveChat]?.showLauncher ??
                        false
                      }
                      name={`${WebChatType.LiveChat}-${locale}-showLauncher`}
                      id={`${WebChatType.LiveChat}-${locale}-showLauncher-yes`}
                      value="Yes"
                      onChange={() => {
                        updateValue((previousValue) => ({
                          ...previousValue,
                          [locale]: {
                            ...previousValue?.[locale],
                            [WebChatType.LiveChat]: {
                              ...previousValue?.[locale]?.[
                                WebChatType.LiveChat
                              ],
                              showLauncher: true,
                            },
                          },
                        }))
                      }}
                    >
                      Yes
                    </Radio>
                    <Radio
                      isChecked={
                        !(
                          value?.[locale]?.[WebChatType.LiveChat]
                            ?.showLauncher ?? false
                        )
                      }
                      name={`${WebChatType.LiveChat}-${locale}-showLauncher`}
                      id={`${WebChatType.LiveChat}-${locale}-showLauncher-no`}
                      value="No"
                      onChange={() => {
                        updateValue((previousValue) => ({
                          ...previousValue,
                          [locale]: {
                            ...previousValue?.[locale],
                            [WebChatType.LiveChat]: {
                              ...previousValue?.[locale]?.[
                                WebChatType.LiveChat
                              ],
                              showLauncher: false,
                            },
                          },
                        }))
                      }}
                    >
                      No
                    </Radio>
                  </Stack>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>
        )
      })}
    </Flex>
  )
}
