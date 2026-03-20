import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, FormControl, Select } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { BoostSection } from './BoostSection'
import { LiveChatSection } from './LiveChatZection'
import { type Configuration, WebChatType } from './types'
import { WatsonSection } from './WatsonSection'
import { ZendeskSection } from './ZendeskSection'

const DEBOUNCE_DELAY = 300

const WebChatConfigurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState<Configuration>(sdk.field.getValue() || {})

  const setFieldValue = useMemo(
    () =>
      debounce((newValue: Configuration) => {
        sdk.field.setValue(newValue)
      }, DEBOUNCE_DELAY),
    [sdk.field],
  )

  const updateValue = useCallback(
    (newValue: SetStateAction<Configuration>) => {
      setValue((previousValue) => {
        const updatedValue =
          typeof newValue === 'function' ? newValue(previousValue) : newValue
        // Debounce the value update
        setFieldValue(updatedValue)
        return updatedValue
      })
    },
    [setFieldValue],
  )

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      setFieldValue.cancel()
    }
  }, [setFieldValue])

  useEffect(() => {
    sdk.window.startAutoResizer()
    return sdk.window.stopAutoResizer
  }, [sdk.window])

  return (
    <Flex flexDirection="column" paddingTop="spacingM">
      <FormControl>
        <FormControl.Label>Web Chat Type</FormControl.Label>
        <Select
          value={value.type}
          onChange={(event) => {
            updateValue(
              (previousValue) =>
                ({
                  ...previousValue,
                  type:
                    event.target.value === 'none'
                      ? undefined
                      : (event.target.value as WebChatType),
                } as Configuration),
            )
          }}
        >
          <Select.Option value="none">None</Select.Option>
          <Select.Option value={WebChatType.Boost}>Boost</Select.Option>
          <Select.Option value={WebChatType.LiveChat}>LiveChat</Select.Option>
          <Select.Option value={WebChatType.Zendesk}>Zendesk</Select.Option>
          <Select.Option value={WebChatType.Watson}>Watson</Select.Option>
        </Select>
      </FormControl>

      {value.type === WebChatType.Boost && (
        <BoostSection sdk={sdk} value={value} updateValue={updateValue} />
      )}
      {value.type === WebChatType.LiveChat && (
        <LiveChatSection sdk={sdk} value={value} updateValue={updateValue} />
      )}
      {value.type === WebChatType.Zendesk && (
        <ZendeskSection sdk={sdk} value={value} updateValue={updateValue} />
      )}
      {value.type === WebChatType.Watson && <WatsonSection sdk={sdk} />}
    </Flex>
  )
}

export default WebChatConfigurationField
