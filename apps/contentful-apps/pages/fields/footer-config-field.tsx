import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  FormControl,
  Radio,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

enum TextColor {
  Dark400 = 'dark400',
  White = 'white',
}

interface FooterConfig {
  textColor?: TextColor
  background?: string
}

const DEBOUNCE_TIME = 150

const getSelectedTextColor = (state: FooterConfig) => {
  return state.textColor ?? TextColor.Dark400
}

const FooterConfigField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [state, setState] = useState<FooterConfig>(sdk.field.getValue() || {})

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      sdk.field.setValue({
        textColor: getSelectedTextColor(state),
        ...(state.background ? { background: state.background } : {}),
      })
    },
    DEBOUNCE_TIME,
    [state],
  )

  const selectedTextColor = getSelectedTextColor(state)

  const updateState = <K extends keyof FooterConfig>(
    key: K,
    value: FooterConfig[K],
  ) => {
    setState((prevState) => ({ ...prevState, [key]: value }))
  }

  return (
    <Stack
      flexDirection="column"
      alignItems="flex-start"
      paddingBottom="spacingXs"
    >
      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Text Color</FormControl.Label>
        <Stack flexDirection="row">
          {Object.values(TextColor).map((color) => (
            <Radio
              name="textColorRadio"
              key={color}
              id={color}
              value={color}
              isChecked={selectedTextColor === color}
              onChange={() => {
                updateState('textColor', color)
              }}
            >
              {color}
            </Radio>
          ))}
        </Stack>
      </Stack>
      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Background Color</FormControl.Label>
        <Stack
          paddingLeft="spacingL"
          flexDirection="column"
          spacing="spacingXs"
          alignItems="flex-start"
        >
          <TextInput
            value={state.background || ''}
            onChange={(event) => {
              updateState('background', event.target.value)
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FooterConfigField
