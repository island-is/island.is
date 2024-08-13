import { Box, Checkbox, Divider, Stack } from '@island.is/island-ui/core'
import React from 'react'
import { OptionsLimitations } from '../../utils/OrganDonationMock'
import { OtherLimitations } from './OtherLimitations'
interface LimitationsProps {
  data: OptionsLimitations[]
}

const Limitations = ({ data }: LimitationsProps) => {
  return (
    <Box marginTop={2}>
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {data?.map((y, yi) => {
            if (y.type === 'input') {
              return (
                <OtherLimitations
                  key={`organ-donation-limitation-${yi}`}
                  type={y.type}
                  value={y.value}
                />
              )
            }
            return (
              <React.Fragment key={`organ-donation-limitation-${yi}`}>
                <Box width="half" marginY="smallGutter">
                  <Checkbox
                    id={`organ-registration-form-${y.value.toLowerCase()}`}
                    name={`selected-limitations-${y.value.toLowerCase()}`}
                    label={y.value}
                    value={y.value.toLowerCase()}
                    key={`organ-donation-limitation-checkbox-${yi}`}
                  />
                </Box>
              </React.Fragment>
            )
          })}
        </Box>
      </Stack>
    </Box>
  )
}

export default Limitations
