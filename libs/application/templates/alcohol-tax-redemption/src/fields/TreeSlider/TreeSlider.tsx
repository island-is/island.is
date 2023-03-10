import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useFormContext, Controller } from 'react-hook-form'

import Slider from '../Components/SliderWithGraphic/Slider/Slider'
import { theme } from '@island.is/island-ui/theme'
import { Text } from '@island.is/island-ui/core'

export const TreeSlider = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [numberOfTrees, setNumberOfTrees] = useState(0)

  return (
    <Box
      marginBottom={4}
      marginTop={1}
      paddingTop={6}
      paddingX={3}
      paddingBottom={3}
      background="blue100"
    >
      <Text marginBottom={6} variant="h4">
        'Tré veijj'
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={numberOfTrees}
          name={'treesomtehing'}
          render={({ onChange }) => (
            <Slider
              min={0}
              max={20}
              step={1}
              currentIndex={numberOfTrees}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 5 }}
              onChange={(newValue: number) => {
                console.log(newValue)
                console.log(numberOfTrees)
                if (!isNaN(newValue)) {
                  onChange(newValue)
                  setNumberOfTrees(newValue)
                }
              }}
              label={{
                singular: 'Tré',
                plural: 'Tré',
              }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
            />
          )}
        />
      </Box>
    </Box>
  )
}
