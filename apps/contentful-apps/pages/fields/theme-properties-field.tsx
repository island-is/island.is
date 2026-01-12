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
        <FormControl.Label>Full Width</FormControl.Label>
        <Stack flexDirection="row">
          <Radio
            name="fullWidthRadio"
            id="fullWidthOn"
            value="Yes"
            isChecked={state.fullWidth}
            onChange={() => {
              updateState('fullWidth', true)
            }}
          >
            Yes
          </Radio>
          <Radio
            name="fullWidthRadio"
            id="fullWidthOff"
            value="No"
            isChecked={!state.fullWidth}
            onChange={() => {
              updateState('fullWidth', false)
            }}
          >
            No
          </Radio>
        </Stack>
      </Stack>
      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Image Is Full Height</FormControl.Label>
        <Stack flexDirection="row">
          <Radio
            name="imageIsFullHeightRadio"
            id="imageIsFullHeightOn"
            value="Yes"
            isChecked={state.imageIsFullHeight !== false}
            onChange={() => {
              updateState('imageIsFullHeight', true)
            }}
          >
            Yes
          </Radio>
          <Radio
            name="imageIsFullHeightRadio"
            id="imageIsFullHeightOff"
            value="No"
            isChecked={state.imageIsFullHeight === false}
            onChange={() => {
              updateState('imageIsFullHeight', false)
            }}
          >
            No
          </Radio>
        </Stack>
      </Stack>
      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Image Padding</FormControl.Label>
        <Stack flexDirection="row">
          <Radio
            name="imagePaddingRadio"
            id="imagePaddingOn"
            value="Yes"
            isChecked={state.imagePadding === '20px'}
            onChange={() => {
              updateState('imagePadding', '20px')
            }}
          >
            20px
          </Radio>
          <Radio
            name="imagePaddingRadio"
            id="imagePaddingOff"
            value="No"
            isChecked={!state.imagePadding || state.imagePadding === '0px'}
            onChange={() => {
              updateState('imagePadding', '0px')
            }}
          >
            0px
          </Radio>
        </Stack>
      </Stack>

      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Image Object Fit</FormControl.Label>
        <Stack flexDirection="row">
          <Radio
            name="imageObjectFitRadio"
            id="imageObjectFitContain"
            value="contain"
            isChecked={state.imageObjectFit === 'contain'}
            onChange={() => {
              updateState('imageObjectFit', 'contain')
            }}
          >
            contain
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
            cover
          </Radio>
        </Stack>
      </Stack>

      <Stack flexDirection="column" alignItems="flex-start" spacing="none">
        <FormControl.Label>Image Object Position</FormControl.Label>
        <Stack flexDirection="row">
          <Radio
            name="imageObjectPositionRadio"
            id="imageObjectPositionLeft"
            value="left"
            isChecked={state.imageObjectPosition === 'left'}
            onChange={() => {
              updateState('imageObjectPosition', 'left')
            }}
          >
            left
          </Radio>
          <Radio
            name="imageObjectPositionRadio"
            id="imageObjectPositionCenter"
            value="center"
            isChecked={
              !state.imageObjectPosition ||
              state.imageObjectPosition === 'center'
            }
            onChange={() => {
              updateState('imageObjectPosition', 'center')
            }}
          >
            center
          </Radio>
          <Radio
            name="imageObjectPositionRadio"
            id="imageObjectPositionRight"
            value="right"
            isChecked={state.imageObjectPosition === 'right'}
            onChange={() => {
              updateState('imageObjectPosition', 'right')
            }}
          >
            right
          </Radio>
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
          <FormControl.HelpText>Use gradient color</FormControl.HelpText>
          <Stack flexDirection="row">
            <Radio
              name="useGradientColorRadio"
              id="useGradientColorOn"
              value="Yes"
              isChecked={state.useGradientColor}
              onChange={() => {
                updateState('useGradientColor', true)
              }}
            >
              Yes
            </Radio>
            <Radio
              name="useGradientColorRadio"
              id="useGradientColorOff"
              value="No"
              isChecked={!state.useGradientColor}
              onChange={() => {
                updateState('useGradientColor', false)
              }}
            >
              No
            </Radio>
          </Stack>

          {state.useGradientColor && (
            <Stack>
              <Stack
                flexDirection="column"
                spacing="spacingXs"
                alignItems="flex-start"
              >
                <FormControl.HelpText>Start Color</FormControl.HelpText>
                <TextInput
                  value={state.gradientStartColor || ''}
                  onChange={(event) => {
                    updateState('gradientStartColor', event.target.value)
                  }}
                />
              </Stack>
              <Stack
                flexDirection="column"
                spacing="spacingXs"
                alignItems="flex-start"
              >
                <FormControl.HelpText>End Color</FormControl.HelpText>
                <TextInput
                  value={state.gradientEndColor || ''}
                  onChange={(event) => {
                    updateState('gradientEndColor', event.target.value)
                  }}
                />
              </Stack>
            </Stack>
          )}

          {!state.useGradientColor && (
            <Stack>
              <Stack
                flexDirection="column"
                spacing="spacingXs"
                alignItems="flex-start"
              >
                <FormControl.HelpText>Color</FormControl.HelpText>
                <TextInput
                  value={state.backgroundColor || ''}
                  onChange={(event) => {
                    updateState('backgroundColor', event.target.value)
                  }}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ThemePropertiesField
