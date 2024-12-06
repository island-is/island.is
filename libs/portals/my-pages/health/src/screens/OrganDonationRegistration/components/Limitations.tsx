import { HealthDirectorateOrganDonationOrgan } from '@island.is/api/schema'
import { Box, Checkbox, Divider, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { useState } from 'react'

interface LimitationsProps {
  data: HealthDirectorateOrganDonationOrgan[]
  selected?: string[] | null
}

const Limitations = ({ data, selected }: LimitationsProps) => {
  useNamespaces('sp.health')
  const [checked, setChecked] = useState<Array<string>>(selected ?? [])
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
                  id={y.id?.toString()}
                  name={`selected-limitations-${y.id}`}
                  label={y.name}
                  value={y.id ?? ''}
                  onChange={(e) =>
                    handleCheckboxChange(y.id ?? '', e.target.checked)
                  }
                  checked={checked.includes(y.id ?? '')}
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
