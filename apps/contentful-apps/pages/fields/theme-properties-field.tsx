import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  FormControl,
  Paragraph,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { ChevronDownIcon, ChevronRightIcon } from '@contentful/f36-icons'
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
  const [showAdvanced, setShowAdvanced] = useState(false)

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
              isChecked={
                selectedTextColor === color ||
                (!selectedTextColor && color === 'dark400')
              }
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
      <Stack
        flexDirection="column"
        alignItems="flex-start"
        marginTop="spacingS"
      >
        <Button
          variant="transparent"
          size="small"
          style={{ paddingLeft: 0, paddingRight: 0 }}
          startIcon={showAdvanced ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setShowAdvanced((open) => !open)}
        >
          Advanced settings
        </Button>
        {showAdvanced && (
          <Stack
            flexDirection="column"
            alignItems="flex-start"
            marginTop="spacingS"
          >
            <Stack
              flexDirection="column"
              alignItems="flex-start"
              spacing="none"
            >
              <FormControl.Label>Image Display</FormControl.Label>
              <Stack flexDirection="row" alignItems="flex-start">
                <Stack
                  flexDirection="column"
                  alignItems="flex-start"
                  spacing="none"
                >
                  <Radio
                    name="imageObjectFitRadio"
                    id="imageObjectFitContain"
                    value="contain"
                    isChecked={
                      !state.imageObjectFit ||
                      state.imageObjectFit === 'contain'
                    }
                    onChange={() => {
                      updateState('imageObjectFit', 'contain')
                    }}
                  >
                    Show Full Image
                  </Radio>
                  <Text
                    marginLeft="spacingL"
                    fontSize="fontSizeS"
                    fontColor="gray500"
                  >
                    The entire image is visible, but may leave empty space to
                    preserve its proportions
                  </Text>
                </Stack>
                <Stack
                  flexDirection="column"
                  alignItems="flex-start"
                  spacing="none"
                >
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
                  <Text
                    marginLeft="spacingL"
                    fontSize="fontSizeS"
                    fontColor="gray500"
                  >
                    Fills the space completely, but may crop the edges of the
                    image
                  </Text>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              flexDirection="column"
              alignItems="flex-start"
              spacing="none"
            >
              <FormControl.Label>Image Spacing</FormControl.Label>
              <Stack flexDirection="row">
                <Radio
                  name="imagePaddingRadio"
                  id="imagePaddingNone"
                  value="0px"
                  isChecked={
                    !state.imagePadding || state.imagePadding === '0px'
                  }
                  onChange={() => {
                    updateState('imagePadding', '0px')
                  }}
                >
                  No spacing
                </Radio>
                <Radio
                  name="imagePaddingRadio"
                  id="imagePaddingSmall"
                  value="20px"
                  isChecked={state.imagePadding === '20px'}
                  onChange={() => {
                    updateState('imagePadding', '20px')
                  }}
                >
                  Add spacing around image (20px)
                </Radio>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default ThemePropertiesField
