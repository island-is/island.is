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
import { ChangeEvent, Dispatch, useState } from 'react'
import { useIntl } from 'react-intl'
import { FormSystemField } from '@island.is/api/schema'
import { m, webMessages } from '../../../lib/messages'
import { getValue } from '../../../lib/getValue'
import { Action, PropertyNumberType } from '../../../lib'

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

export const PropertyNumber = ({ item, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const [hasCustomPropertyNumber, setCustomPropertyNumber] = useState(false)
  const [property, setProperty] = useState<PropertyNumberType>({
    propertyNumber: getValue(item, 'propertyNumber') || '',
    address: getValue(item, 'address') || '',
    municipality: getValue(item, 'municipality') || '',
    postalCode: getValue(item, 'postalCode') || '',
  })
  // Fetch properties from API from user nationalId
  const [properties, setProperties] = useState<PropertyNumberType[]>([
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

  const getProperty = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const propertyNumber = e.target.value
    if (propertyNumber.length <= 7) {
      setProperty((prev) => ({
        ...prev,
        propertyNumber: propertyNumber,
      }))
      if (propertyNumber.length === 7) {
        // Mock API call to fetch property data
        setProperties((prev) => [
          ...prev,
          {
            propertyNumber: propertyNumber,
            address: 'Borgartún 4',
            municipality: 'Reykjavík',
            postalCode: '105',
          },
        ])
        setProperty((prev) => ({
          ...prev,
          address: 'Borgartún 4',
          municipality: 'Reykjavík',
          postalCode: '105',
        }))
      }
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
                <Input
                  type="number"
                  name="customPropertyNumber"
                  label={formatMessage(m.propertyNumber)}
                  backgroundColor="blue"
                  onChange={(e) => getProperty(e)}
                  value={property.propertyNumber}
                />
              </Column>
            </Row>
            <Row>
              <Column span="1/2">
                <Input
                  type="text"
                  name="customAddress"
                  label={formatMessage(m.address)}
                  backgroundColor="blue"
                  disabled
                  value={property.address}
                />
              </Column>
              <Column span="1/2">
                <Input
                  type="text"
                  name="customMunicipality"
                  label={formatMessage(m.city)}
                  backgroundColor="blue"
                  disabled
                  value={property.municipality}
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
