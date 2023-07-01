import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  getMaxMultipleBirthsDays,
  getMaxMultipleBirthsAndDefaultMonths,
  getMultipleBirthRequestDays,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { defaultMonths, daysInMonth } from '../../config'
import { formatText } from '@island.is/application/core'
import { NO } from '../../constants'
import { useEffectOnce } from 'react-use'

const RequestMultipleBirthsDaysSlider: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, application }) => {
  const { id, description } = field
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const multipleBirthsRequestDays = getMultipleBirthRequestDays(
    application.answers,
  )

  const maxDays = getMaxMultipleBirthsDays(application.answers)
  const maxMonths = getMaxMultipleBirthsAndDefaultMonths(application.answers)

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(
    multipleBirthsRequestDays,
  )
  useEffectOnce(() => {
    setValue('requestRights.isRequestingRights', NO)
    setValue('requestRights.requestDays', '0')
    setValue('giveRights.isGivingRights', NO)
    setValue('giveRights.giveDays', '0')
  })

  const requestedMonths = defaultMonths + chosenRequestDays / daysInMonth

  const daysStringKey =
    chosenRequestDays === 1
      ? parentalLeaveFormMessages.shared.requestMultipleBirthsDay
      : parentalLeaveFormMessages.shared.requestMultipleBirthsDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: chosenRequestDays } }),
      bulletStyle: 'purpleWithLines',
    },
  ]

  return (
    <>
      <p>{formatText(description!, application, formatMessage)}</p>
      <Box marginBottom={6} marginTop={5}>
        <Box marginBottom={12}>
          <Controller
            defaultValue={chosenRequestDays}
            name={id}
            render={({ field: { onChange, value } }) => (
              <Slider
                label={{
                  singular: formatMessage(parentalLeaveFormMessages.shared.day),
                  plural: formatMessage(parentalLeaveFormMessages.shared.days),
                }}
                min={0}
                max={maxDays}
                step={1}
                currentIndex={value}
                showMinMaxLabels
                showToolTip
                trackStyle={{ gridTemplateRows: 8 }}
                calculateCellStyle={() => {
                  return {
                    background: theme.color.dark200,
                  }
                }}
                onChange={(newValue: number) => {
                  onChange(newValue.toString())
                  setChosenRequestDays(newValue)
                }}
              />
            )}
          />
        </Box>
        <BoxChart
          application={application}
          boxes={Math.ceil(maxMonths)}
          calculateBoxStyle={(index) => {
            if (index < defaultMonths) {
              return 'blue'
            }

            if (index < requestedMonths) {
              return 'purpleWithLines'
            }

            return 'grayWithLines'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      </Box>
    </>
  )
}

export default RequestMultipleBirthsDaysSlider
