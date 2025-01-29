import { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Text,
} from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  field: CustomField
}

type Merking = {
  id: string
  units: {
    unitId: string
    merking: string
    unitType: string
    size: string
    numberOfRooms: string
  }[]
}

type PropertyIds = {
  propertyId: string
  size: string
  propertyType: string
  merking: Merking[]
}

type Property = {
  streetAddress: string
  regionNumber: string
  cityName: string
  propertyIds: PropertyIds[]
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
}) => {
  const { answers: formValue } = application
  const { clearErrors, register, setValue, getValues } = useFormContext()
  const { id } = field
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [pending, setPending] = useState(false)

  const [selectedProperty, setSelectedProperty] = useState<
    | {
        streetAddress: string
        regionNumber: string
        cityName: string
        propertyIds: PropertyIds[]
      }
    | undefined
  >(undefined)

  const fetchProperties = (query = '') => {
    if (query.length === 0) {
      console.log('no query')
      return
    }
    setPending(true)
    fetch('http://localhost:3001/properties')
      .then((res) => res.json())
      .then((data) => {
        setPending(false)
        const filteredData = data
          .filter((property: Property) =>
            property.streetAddress.toLowerCase().includes(query.toLowerCase()),
          )
          .sort((a: Property, b: Property) =>
            a.streetAddress.localeCompare(b.streetAddress),
          )
        if (filteredData.length) {
          setOptions(
            filteredData.map((property: Property) => ({
              label: `${property.streetAddress}, ${property.regionNumber} ${property.cityName}`,
              value: `${property.streetAddress}, ${property.regionNumber} ${property.cityName}`,
              streetAddress: property.streetAddress,
              regionNumber: property.regionNumber,
              cityName: property.cityName,
            })),
          )
        }
      })
  }

  console.log('id: ', id)
  console.log('selectedProperty: ', selectedProperty)
  console.log('selectedPropertyType: ', typeof selectedProperty)

  return (
    <>
      <Box>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            return (
              <AsyncSearch
                options={options}
                placeholder="Leitaðu eftir heimilisfangi"
                initialInputValue={value}
                closeMenuOnSubmit
                size="large"
                colored
                onChange={(selection: { value: string } | null) => {
                  clearErrors(id)
                  const selectedValue =
                    selection === null ? undefined : selection.value
                  const selectedOption = options.find(
                    (option) => option.value === selectedValue,
                  )
                  setSelectedProperty(selectedOption as unknown as Property)
                  onChange(selection === null ? undefined : selection.value)
                }}
                onInputValueChange={(newValue) => {
                  fetchProperties(newValue)
                }}
                loading={pending}
              />
            )
          }}
        />
      </Box>

      {selectedProperty && (
        <Box>
          <Text variant="h3" marginTop={12}>
            Selected Property:
          </Text>
          <Text variant="medium">{selectedProperty.streetAddress}</Text>
        </Box>
      )}
    </>
  )
}
