import { useEffect, useState } from 'react'
import { TextInput, FormControl } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

interface Location {
  streetAddress?: string
  floor?: string
  postalCode?: string
}

const LocationFormattedInputField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [location, setLocation] = useState<Location>(sdk.field.getValue() ?? {})
  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const updateLocation = (field: keyof Location, value: string) => {
    setLocation((prevLocation) => {
      const updatedLocation = { ...prevLocation, [field]: value }
      sdk.field.setValue(updatedLocation)
      return updatedLocation
    })
  }

  return (
    <FormControl>
      <TextInput.Group spacing="spacingXs">
        <TextInput
          value={location.streetAddress}
          style={{ width: '200px' }}
          size="small"
          placeholder="Street address"
          onChange={(ev) => {
            updateLocation('streetAddress', ev.target.value)
          }}
        ></TextInput>
        {' , '}
        <TextInput
          value={location.floor}
          style={{ width: '200px' }}
          size="small"
          placeholder="floor (optional)"
          onChange={(ev) => {
            updateLocation('floor', ev.target.value)
          }}
        ></TextInput>
        {' , '}
        <TextInput
          value={location.postalCode}
          style={{ width: '200px' }}
          size="small"
          placeholder="Region and postal code"
          onChange={(ev) => {
            updateLocation('postalCode', ev.target.value)
          }}
        ></TextInput>
      </TextInput.Group>
      <FormControl.HelpText>
        Ex. Grensásvegur 9, hæð 3, 108 Reykjavík
      </FormControl.HelpText>
    </FormControl>
  )
}

export default LocationFormattedInputField
