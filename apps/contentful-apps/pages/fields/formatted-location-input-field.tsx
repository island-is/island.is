import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  FormControl,
  Radio,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const INPUT_BOX_WIDTH = '200px'

interface Location {
  streetAddress?: string
  floor?: string
  postalCode?: string
  useFreeText?: boolean
  freeText?: string
}

const FormattedLocationInputField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [location, setLocation] = useState<Location>(sdk.field.getValue() ?? {})
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const updateLocation = <K extends keyof Location>(
    field: K,
    value: Location[K],
  ) => {
    setLocation((prevLocation) => {
      const updatedLocation = { ...prevLocation, [field]: value }
      sdk.field.setValue(updatedLocation)
      return updatedLocation
    })
  }

  return (
    <FormControl>
      <Stack flexDirection="column" alignItems="flex-start">
        <Box>
          <FormControl.Label>Use free text</FormControl.Label>
          <Stack flexDirection="row">
            <Radio
              id="yes"
              isChecked={location.useFreeText}
              onChange={() => {
                updateLocation('useFreeText', true)
              }}
            >
              Yes
            </Radio>
            <Radio
              id="no"
              isChecked={!location.useFreeText}
              onChange={() => {
                updateLocation('useFreeText', false)
              }}
            >
              No
            </Radio>
          </Stack>
        </Box>

        {location.useFreeText && (
          <TextInput
            value={location.freeText}
            onChange={(ev) => {
              updateLocation('freeText', ev.target.value)
            }}
          />
        )}

        {!location.useFreeText && (
          <Box>
            <TextInput.Group spacing="spacingXs">
              <TextInput
                value={location.streetAddress}
                style={{ width: INPUT_BOX_WIDTH }}
                size="small"
                placeholder="Street address"
                onChange={(ev) => {
                  updateLocation('streetAddress', ev.target.value)
                }}
              />
              {' , '}
              <TextInput
                value={location.floor}
                style={{ width: INPUT_BOX_WIDTH }}
                size="small"
                placeholder="Floor (optional)"
                onChange={(ev) => {
                  updateLocation('floor', ev.target.value)
                }}
              />
              {' , '}
              <TextInput
                value={location.postalCode}
                style={{ width: INPUT_BOX_WIDTH }}
                size="small"
                placeholder="Region and postal code"
                onChange={(ev) => {
                  updateLocation('postalCode', ev.target.value)
                }}
              />
            </TextInput.Group>
            <FormControl.HelpText>
              Example: Grensásvegur 9, hæð 3, 108 Reykjavík
            </FormControl.HelpText>
          </Box>
        )}
      </Stack>
    </FormControl>
  )
}

export default FormattedLocationInputField
