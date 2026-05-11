import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  FormControl,
  Paragraph,
  Radio,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

enum TextColor {
  Dark400 = 'dark400',
  White = 'white',
}

interface ThemeProperties {
  gradientStartColor?: string
  gradientEndColor?: string
  backgroundColor?: string
  darkText?: boolean
  fullWidth?: boolean
  textColor?: TextColor
  imagePadding?: string
  imageIsFullHeight?: boolean
  imageObjectFit?: 'contain' | 'cover'
  imageObjectPosition?: 'left' | 'center' | 'right'
  useGradientColor?: boolean
}

const DEBOUNCE_TIME = 150

const getSelectedTextColor = (state: ThemeProperties) => {
  let selectedTextColor =
    state.darkText === false ? TextColor.White : TextColor.Dark400
  if (state.textColor) {
    selectedTextColor = state.textColor
  }
  return selectedTextColor
}

const ThemePropertiesField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [state, setState] = useState<ThemeProperties>(
    sdk.field.getValue() || {},
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      sdk.field.setValue(state)
    },
    DEBOUNCE_TIME,
    [state],
  )

  const selectedTextColor = getSelectedTextColor(state)

  const updateState = <K extends keyof ThemeProperties>(
    key: K,
    value: ThemeProperties[K],
  ) => {
    setState((prevState) => ({ ...prevState, [key]: value }))
  }

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this JSON field)</Paragraph>
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
            value={state.backgroundColor || ''}
            onChange={(event) => {
              updateState('backgroundColor', event.target.value)
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ThemePropertiesField
