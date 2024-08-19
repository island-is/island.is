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
import { HealthDirectorateOrganDonationExceptionObject } from '@island.is/api/schema'

interface LimitationsProps {
  data: HealthDirectorateOrganDonationExceptionObject[]
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

  //const input = data.find((x) => x.type === 'input')

  return (
    <Box marginTop={2} position="relative">
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {data?.map(
            (y, yi) => (
              // y.type === 'checkbox' && (
              <Box
                key={`organ-donation-limitation-${yi}`}
                width="half"
                marginY="smallGutter"
              >
                <Checkbox
                  id={`organ-registration-form-${y.name?.toLowerCase() ?? ''}`}
                  name={`selected-limitations-${y.name?.toLowerCase() ?? ''}`}
                  label={y.name}
                  value={y.name?.toLowerCase() ?? ''}
                  onChange={(e) =>
                    handleCheckboxChange(
                      y.name?.toLowerCase() ?? '',
                      e.target.checked,
                    )
                  }
                />
              </Box>
            ),
            // ),
          )}
        </Box>
      </Stack>
      {/* This is commented out because of feature that was removed. May be included later on */}
      {/* {input && checked.includes(input.name.toLowerCase()) && (
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
      )} */}
    </Box>
  )
}

export default Limitations
