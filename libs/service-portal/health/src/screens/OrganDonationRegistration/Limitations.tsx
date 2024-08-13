import {
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { OptionsLimitations } from '../../utils/OrganDonationMock'
import { messages } from '../..'
import { useLocale, useNamespaces } from '@island.is/localization'

interface LimitationsProps {
  data: OptionsLimitations[]
}

const Limitations = ({ data }: LimitationsProps) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [checked, setChecked] = useState<Array<string>>([])

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setChecked((prevState) =>
      isChecked ? [...prevState, id] : prevState.filter((item) => item !== id),
    )
  }

  const input = data.find((x) => x.type === 'input')

  return (
    <Box marginTop={2} position="relative">
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {data?.map(
            (y, yi) =>
              y.type === 'checkbox' && (
                <Box
                  key={`organ-donation-limitation-${yi}`}
                  width="half"
                  marginY="smallGutter"
                >
                  <Checkbox
                    id={`organ-registration-form-${y.value.toLowerCase()}`}
                    name={`selected-limitations-${y.value.toLowerCase()}`}
                    label={y.value}
                    value={y.value.toLowerCase()}
                    onChange={(e) =>
                      handleCheckboxChange(
                        y.value.toLowerCase(),
                        e.target.checked,
                      )
                    }
                  />
                </Box>
              ),
          )}
        </Box>
      </Stack>
      {input && checked.includes(input.value.toLowerCase()) && (
        <GridContainer>
          <GridRow>
            <GridColumn span={['7/7', '5/7']}>
              <Box marginY="gutter">
                <Input
                  id="organ-donation-limitation"
                  name="otherLimitatons"
                  textarea
                  label={formatMessage(messages.organRegistrationOtherLabel)}
                  placeholder={formatMessage(
                    messages.organRegistrationOtherText,
                  )}
                  maxLength={220}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </Box>
  )
}

export default Limitations
