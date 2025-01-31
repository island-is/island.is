import { FC, Fragment, useEffect, useState } from 'react'
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

interface Unit {
  unitId: string
  markingNr: string
  unitType: string
  size: string
  numberOfRooms: string
}

interface PropertyId {
  propertyId: string
  marking: string
  propertySize: string
  units: Unit[]
}

interface Property {
  streetAddress: string
  regionNumber: string
  cityName: string
  propertyIds: PropertyId[]
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  field,
}) => {
  const { clearErrors, register, setValue, getValues } = useFormContext()
  const { id } = field
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [pending, setPending] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<
    | {
        streetAddress: string
        regionNumber: string
        cityName: string
        propertyIds: PropertyId[]
      }
    | undefined
  >(undefined)

  useEffect(() => {
    const storedValue = getValues(id)
    if (storedValue) {
      try {
        setSelectedProperty(storedValue)
        setQuery(storedValue.label)
      } catch (error) {
        console.error('Error parsing stored value:', error)
      }
    }
  }, [getValues, id])

  const fetchProperties = (query = '') => {
    console.log('fetchProperties query:', query)
    if (query.length === 0) {
      console.log('no query')
      return
    }
    setPending(true)
    fetch('http://localhost:3001/properties')
      .then((res) => res.json())
      .then((data: Property[]) => {
        setPending(false)
        const filteredData = data
          .filter((property: Property) =>
            property.streetAddress.toLowerCase().includes(query.toLowerCase()),
          )
          .sort((a: Property, b: Property) =>
            a.streetAddress.localeCompare(b.streetAddress),
          )
          .slice(0, 10)
        if (filteredData.length) {
          setOptions(
            filteredData.map((property: Property) => ({
              label: `${property.streetAddress}, ${property.regionNumber} ${property.cityName}`,
              value: `${property.streetAddress}, ${property.regionNumber} ${property.cityName}`,
              propertyIds: property.propertyIds,
              propertyId: property.propertyIds[0].propertyId,
              streetAddress: property.streetAddress,
              regionNumber: property.regionNumber,
              cityName: property.cityName,
              marking: property.propertyIds[0].marking,
              size: property.propertyIds[0].units[0].size,
              numberOfRooms: property.propertyIds[0].units[0].numberOfRooms,
            })),
          )
        }
      })
  }

  return (
    <>
      <Box>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            console.log('query:', query)
            console.log('value:', value)
            console.log('selectedProperty: ', selectedProperty)

            return (
              <AsyncSearch
                options={options}
                placeholder="Leitaðu eftir heimilisfangi"
                initialInputValue={
                  selectedProperty
                    ? `${selectedProperty.streetAddress}, ${selectedProperty.regionNumber} ${selectedProperty.cityName}`
                    : ''
                }
                inputValue={
                  query ||
                  (selectedProperty
                    ? `${selectedProperty.streetAddress}, ${selectedProperty.regionNumber} ${selectedProperty.cityName}`
                    : '')
                }
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
                  onChange(selection ? selection : undefined)
                  setValue(id, selection ? selection : undefined)
                  setQuery(selection ? selection.value : '')
                }}
                onInputValueChange={(newValue) => {
                  setQuery(newValue)
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
          <Text variant="medium">
            {selectedProperty.streetAddress}, {selectedProperty.regionNumber}{' '}
            {selectedProperty.cityName}
          </Text>
          {selectedProperty.propertyIds.map((propertyId) => (
            <Fragment key={propertyId.propertyId}>
              <Text variant="medium">
                {`Fasteignanúmer: ${propertyId.propertyId}, Merking: ${propertyId.marking}, Stærð fasteignar: ${propertyId.propertySize}m²`}
              </Text>
              {propertyId.units.map((unit) => (
                <Text key={unit.unitId} variant="medium">
                  {`Unit ID: ${unit.unitId}, Merking: ${unit.markingNr}, Stærð: ${unit.size}, Fjöldi herbergja: ${unit.numberOfRooms}`}
                </Text>
              ))}
            </Fragment>
          ))}
        </Box>
      )}
    </>
  )
}
