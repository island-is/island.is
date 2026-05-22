import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Accordion,
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
              isChecked={selectedTextColor === color || color === 'dark400'}
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
        <FormControl.Label>Background Color (e.g. #FFFFFF)</FormControl.Label>
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
      <Accordion>
        <Accordion.Item title="Advanced Settings">
          <Stack flexDirection="column" alignItems="flex-start" spacing="none">
            <FormControl.Label>Image Display</FormControl.Label>
            <Stack flexDirection="row">
              <Radio
                name="imageObjectFitRadio"
                id="imageObjectFitContain"
                value="contain"
                isChecked={
                  !state.imageObjectFit || state.imageObjectFit === 'contain'
                }
                onChange={() => {
                  updateState('imageObjectFit', 'contain')
                }}
              >
                Show Full Image
              </Radio>
              <Radio
                name="imageObjectFitRadio"
                id="imageObjectFitCover"
                value="cover"
                isChecked={state.imageObjectFit === 'cover'}
                onChange={() => {
                  updateState('imageObjectFit', 'cover')
                }}
              >
                Fill Area (Crop Image)
              </Radio>
            </Stack>
          </Stack>
        </Accordion.Item>
      </Accordion>
    </Stack>
  )
}

export default ThemePropertiesField
