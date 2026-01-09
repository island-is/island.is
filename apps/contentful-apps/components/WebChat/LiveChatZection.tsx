import { SetStateAction } from 'react'
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
                  <FormControl.Label>License</FormControl.Label>
                  <TextInput
                    value={value[WebChatType.LiveChat]?.[locale]?.license}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.LiveChat]: {
                          ...previousValue[WebChatType.LiveChat],
                          [locale]: {
                            ...previousValue[WebChatType.LiveChat]?.[locale],
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
                    value={value[WebChatType.LiveChat]?.[locale]?.version}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.LiveChat]: {
                          ...previousValue[WebChatType.LiveChat],
                          [locale]: {
                            ...previousValue[WebChatType.LiveChat]?.[locale],
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
                    value={value[WebChatType.LiveChat]?.[locale]?.group}
                    onChange={(event) => {
                      updateValue((previousValue) => ({
                        ...previousValue,
                        [WebChatType.LiveChat]: {
                          ...previousValue[WebChatType.LiveChat],
                          [locale]: {
                            ...previousValue[WebChatType.LiveChat]?.[locale],
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
                    <Radio name="showLauncher" id="showLauncherYes" value="Yes">
                      Yes
                    </Radio>
                    <Radio name="showLauncher" id="showLauncherNo" value="No">
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
