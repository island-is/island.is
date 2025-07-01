import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Box,
  Input,
  Text,
  Checkbox,
  Button,
} from '@island.is/island-ui/core'
import { Dispatch, useState } from 'react'
import { useIntl } from 'react-intl'
import { FormSystemField } from '@island.is/api/schema'
import { m, webMessages } from '../../../lib/messages'
import { getValue } from '../../../lib/getValue'
import { Action, PropertyNumberType } from '../../../lib'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  hasError?: boolean
}

const emptyProperty: PropertyNumberType = {
  propertyNumber: '',
  address: '',
  municipality: '',
  postalCode: '',
}

const PROPERTY_NUMBER_REGEX = /^\d{7}$/

export const PropertyNumber = ({ item, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const { control, setValue } = useFormContext()
  const [hasCustomPropertyNumber, setCustomPropertyNumber] = useState(false)
  const [property, setProperty] = useState<PropertyNumberType>({
    propertyNumber: getValue(item, 'propertyNumber') || '',
    address: getValue(item, 'address') || '',
    municipality: getValue(item, 'municipality') || '',
    postalCode: getValue(item, 'postalCode') || '',
  })
  // Fetch properties from API from user nationalId
  const [properties] = useState<PropertyNumberType[]>([
    {
      propertyNumber: '1234567',
      address: 'Borgartún 1',
      municipality: 'Reykjavík',
      postalCode: '105',
    },
    {
      propertyNumber: '1234568',
      address: 'Borgartún 2',
      municipality: 'Reykjavík',
      postalCode: '105',
    },
    {
      propertyNumber: '1234569',
      address: 'Borgartún 3',
      municipality: 'Reykjavík',
      postalCode: '105',
    },
  ])
  const [chosenProperty, setChosenProperty] =
    useState<PropertyNumberType | null>(property ? property : null)

  // Simulate fetching property info for a custom property number
  const fetchPropertyInfo = (propertyNumber: string) => {
    // Mock API call to fetch property data
    return {
      propertyNumber,
      address: 'Borgartún 4',
      municipality: 'Reykjavík',
      postalCode: '105',
    }
  }

  return (
    <Box background="white" padding={2} borderRadius="large">
      <Text variant="h4">{formatMessage(webMessages.yourProperties)}</Text>
      <Box paddingTop={2} paddingBottom={hasCustomPropertyNumber ? 4 : 0}>
        <Stack space={2}>
          {properties.map((property) => (
            <Checkbox
              key={property.propertyNumber}
              label={`${property.propertyNumber} - ${property.address}, ${property.municipality}, ${property.postalCode}`}
              name={property.propertyNumber}
              value={property.propertyNumber}
              checked={
                chosenProperty?.propertyNumber === property.propertyNumber
              }
              onChange={(e) => {
                setChosenProperty(e.target.checked ? property : emptyProperty)
                if (dispatch) {
                  dispatch({
                    type: 'SET_PROPERTY_NUMBER',
                    payload: {
                      value: e.target.checked ? property : emptyProperty,
                      id: item.id,
                    },
                  })
                }
              }}
            />
          ))}
        </Stack>
      </Box>
      {hasCustomPropertyNumber && (
        <Box
          border="standard"
          borderRadius="large"
          borderStyle="solid"
          padding={4}
        >
          <Stack space={2}>
            <Row>
              <Column span="1/2">
                <Controller
                  name={`${item.id}.customPropertyNumber`}
                  control={control}
                  defaultValue={property.propertyNumber}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.required),
                    },
                    pattern: {
                      value: PROPERTY_NUMBER_REGEX,
                      message: formatMessage(m.invalidPropertyNumber),
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      type="number"
                      name="customPropertyNumber"
                      label={formatMessage(m.propertyNumber)}
                      backgroundColor="blue"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 7)
                        field.onChange(value)
                        let info
                        // Fetch property info if 7 digits
                        if (value.length === 7) {
                          info = fetchPropertyInfo(value)
                          setProperty(info)
                          setValue(`${item.id}.customAddress`, info.address)
                          setValue(
                            `${item.id}.customMunicipality`,
                            info.municipality,
                          )
                          setValue(
                            `${item.id}.customPostalCode`,
                            info.postalCode,
                          )
                        } else {
                          info = {
                            propertyNumber: value,
                            address: '',
                            municipality: '',
                            postalCode: '',
                          }
                          setProperty(info)
                          setValue(`${item.id}.customAddress`, '')
                          setValue(`${item.id}.customMunicipality`, '')
                          setValue(`${item.id}.customPostalCode`, '')
                        }
                        if (dispatch) {
                          dispatch({
                            type: 'SET_PROPERTY_NUMBER',
                            payload: {
                              value: {
                                ...info,
                                propertyNumber: value,
                              },
                              id: item.id,
                            },
                          })
                        }
                      }}
                      errorMessage={fieldState.error?.message}
                      required
                    />
                  )}
                />
              </Column>
            </Row>
            <Row>
              <Column span="1/2">
                <Controller
                  name={`${item.id}.customAddress`}
                  control={control}
                  defaultValue={property.address}
                  render={({ field }) => (
                    <Input
                      type="text"
                      name="customAddress"
                      label={formatMessage(m.address)}
                      backgroundColor="blue"
                      disabled
                      value={field.value}
                    />
                  )}
                />
              </Column>
              <Column span="1/2">
                <Controller
                  name={`${item.id}.customMunicipality`}
                  control={control}
                  defaultValue={property.municipality}
                  render={({ field }) => (
                    <Input
                      type="text"
                      name="customMunicipality"
                      label={formatMessage(m.city)}
                      backgroundColor="blue"
                      disabled
                      value={field.value}
                    />
                  )}
                />
              </Column>
            </Row>
            <Row>
              <Column span="1/2">
                <Controller
                  name={`${item.id}.customPostalCode`}
                  control={control}
                  defaultValue={property.postalCode}
                  render={({ field }) => (
                    <Input
                      type="text"
                      name="customPostalCode"
                      label={formatMessage(webMessages.postalCode)}
                      backgroundColor="blue"
                      disabled
                      value={field.value}
                    />
                  )}
                />
              </Column>
            </Row>
          </Stack>
        </Box>
      )}
      <Box paddingTop={4}>
        <Button
          variant="ghost"
          iconType="outline"
          preTextIcon="add"
          size="medium"
          onClick={() => {
            setCustomPropertyNumber(!hasCustomPropertyNumber)
          }}
        >
          {formatMessage(m.propertyNumberInput)}
        </Button>
      </Box>
    </Box>
  )
}
