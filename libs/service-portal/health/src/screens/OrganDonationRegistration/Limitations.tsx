import { Box, Checkbox, Divider, Stack } from '@island.is/island-ui/core'
import { useState } from 'react'

const Limitations = () => {
  // temp data, will be used later on
  const limitationsData: string[] = ['hjarta', 'bris', 'lungu']

  const [selectedLimitations, setSelectedLimitations] = useState<
    string[] | null
  >(null)

  const checkboxChanges = (currentValue: string) => {
    const arr = selectedLimitations ?? []
    if (selectedLimitations?.includes(currentValue)) {
      const index = arr.indexOf(currentValue)
      if (index > -1) arr.splice(index, 1)
    } else {
      arr?.push(currentValue)
    }
    setSelectedLimitations(arr)
  }
  return (
    <Box marginTop={2}>
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {limitationsData.length > 0 &&
            limitationsData.map((y, yi) => {
              return (
                <Box
                  width="half"
                  marginY="smallGutter"
                  key={`organ-donation-limitation-${yi}`}
                >
                  <Checkbox
                    name="organ-donation-form"
                    label={y}
                    value={y.toLowerCase()}
                    key={`organ-donation-limitation-checkbox-${yi}`}
                    onChange={(e) => checkboxChanges(e.currentTarget.value)}
                  />
                </Box>
              )
            })}
        </Box>
      </Stack>
    </Box>
  )
}

export default Limitations
