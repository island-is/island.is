import {
  Select,
  Stack,
  Tabs,
  GridRow as Row,
  GridColumn as Column,
  Box,
  Input,
  Option,
} from '@island.is/island-ui/core'
import { ChangeEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'
import { FormSystemField } from '@island.is/api/schema'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
}

export const PropertyNumber = ({ item }: Props) => {
  const [propertyNumber, setPropertyNumber] = useState<string>('')
  const [ownedProperty, setOwnedProperty] = useState<string>('')
  const showPropertyNumber = propertyNumber.length === 7
  const showOwnedProperty = ownedProperty !== ''
  const isRequired = item?.isRequired ?? false
  const { formatMessage } = useIntl()

  const propertyProperties = (
    <Row>
      <Column span="5/10">
        <Box padding={2}>
          <Input
            label={formatMessage(m.address)}
            name="address"
            disabled
            value="Borgartún 1"
            backgroundColor="blue"
            required={isRequired}
          />
        </Box>
      </Column>
      <Column span="5/10">
        <Box padding={2}>
          <Input
            label={formatMessage(m.city)}
            name="city"
            disabled
            value="Reykjavík"
            backgroundColor="blue"
            required={isRequired}
          />
        </Box>
      </Column>
    </Row>
  )

  const handleOwnedPropertyChange = (e: SingleValue<Option<string>>) => {
    setOwnedProperty(e?.value ?? '')
  }

  const ownedProperties = (
    <Stack space={1}>
      <Row>
        <Column span="5/10">
          <Box padding={2}>
            <Select
              name="propertyNumber"
              label={formatMessage(m.properties)}
              placeholder={formatMessage(m.chooseProperty)}
              options={[
                { label: 'Eign 1', value: '1' },
                { label: 'Eign 2', value: '2' },
                { label: 'Eign 3', value: '3' },
              ]}
              onChange={(e) => handleOwnedPropertyChange(e)}
              backgroundColor="blue"
              required={isRequired}
            />
          </Box>
        </Column>
      </Row>
      {showOwnedProperty && propertyProperties}
    </Stack>
  )

  const handlePropertyNumberChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.value.length <= 7) {
      setPropertyNumber(e.target.value)
    }
  }

  const inputPropertyNumber = (
    <Stack space={1}>
      <Row>
        <Column span="5/10">
          <Box padding={2}>
            <Input
              label={formatMessage(m.propertyNumber)}
              name="propertyNumber"
              placeholder={formatMessage(m.enterPropertyNumber)}
              type="number"
              value={propertyNumber}
              onChange={(e) => handlePropertyNumberChange(e)}
              backgroundColor="blue"
              required={isRequired}
            />
          </Box>
        </Column>
      </Row>
      {showPropertyNumber && propertyProperties}
    </Stack>
  )

  return (
    <Stack space={2}>
      <Tabs
        label=""
        tabs={[
          {
            label: formatMessage(m.propertyChoice),
            content: ownedProperties,
          },
          {
            label: formatMessage(m.propertyNumberInput),
            content: inputPropertyNumber,
          },
        ]}
        contentBackground="white"
      />
    </Stack>
  )
}
