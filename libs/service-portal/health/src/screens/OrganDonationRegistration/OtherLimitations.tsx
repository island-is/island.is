import {
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Checkbox,
  Input,
} from '@island.is/island-ui/core'
import React from 'react'
import { useState } from 'react'
import { messages } from '../..'
import { useLocale, useNamespaces } from '@island.is/localization'
import { OptionsLimitations } from '../../utils/OrganDonationMock'

export const OtherLimitations = ({ value }: OptionsLimitations) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [checked, setChecked] = useState(false)

  return (
    <React.Fragment>
      <Box width="half" marginY="smallGutter">
        <Checkbox
          id={`organ-registration-form-${value.toLowerCase()}`}
          name={`selected-limitations-${value.toLowerCase()}`}
          label={value}
          value={value.toLowerCase()}
          onChange={() => setChecked(!checked)}
        />
      </Box>
      {checked && (
        <GridContainer>
          <GridRow>
            <GridColumn span="5/7">
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
    </React.Fragment>
  )
}
