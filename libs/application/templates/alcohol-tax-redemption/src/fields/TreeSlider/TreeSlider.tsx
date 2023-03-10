import React, { useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { theme } from '@island.is/island-ui/theme'
import { draft } from '../../lib/messages'
import Slider from '../Components/SliderWithGraphic/Slider/Slider'
import { formatMessage } from '@island.is/cms-translations'
import { useLocale } from '@island.is/localization'

export const TreeSlider = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const treeAnswer = getValueViaPath(application.answers, 'numberOfTrees', 0)

  const [numberOfTrees, setNumberOfTrees] = useState(0)

  return (
    <Box
      marginBottom={4}
      marginTop={5}
      paddingTop={6}
      paddingX={3}
      paddingBottom={3}
      background="blue100"
    >
      <Box marginBottom={12}>
        <Controller
          defaultValue={treeAnswer}
          name={'numberOfTrees'}
          render={({ onChange }) => (
            <Slider
              min={0}
              max={20}
              step={1}
              currentIndex={numberOfTrees}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 10 }}
              onChange={(newValue: number) => {
                if (!isNaN(newValue)) {
                  onChange(newValue)
                  setValue('numberOfTrees', newValue)
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
      <Box>
        <p>
          {formatMessage(draft.treeSliderCo2EffectDescriptor, {
            trees: numberOfTrees,
            co2: (numberOfTrees * 0.1).toFixed(1),
          })}
        </p>
      </Box>
    </Box>
  )
}
