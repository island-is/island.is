import React, { FC, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import Slider from '../components/Slider'

import * as styles from './Duration.treat'
import { theme } from '@island.is/island-ui/theme'

import { FieldDescription } from '@island.is/shared/form-fields'

const ParentalLeaveUsage: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { clearErrors } = useFormContext()
  const { answers } = application
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const monthsToUse = (answers.usage as number) || 1
  const [chosenDuration, setChosenDuration] = useState<number>(monthsToUse)
  const [percent, setPercent] = useState<number>(100)
  const minMonths = 1
  const maxMonths = 18

  useEffect(() => {
    const newPercent = Math.min(
      100,
      Math.round((monthsToUse / chosenDuration) * 100),
    )
    setPercent(newPercent)
  }, [chosenDuration, monthsToUse])

  return (
    <Box>
      <FieldDescription description="Some people choose to take the full leave all at once, but others like to spread it over a longer period which might in turn affect the payments. Please confirm your choice below by dragging the lever:" />
      <Box
        background="blue100"
        paddingTop={3}
        paddingX={3}
        paddingBottom={10}
        marginTop={3}
      >
        <Box
          width="full"
          background="white"
          borderColor="blue200"
          borderWidth="standard"
          borderStyle="solid"
          borderRadius="large"
          padding={3}
          display="flex"
          alignItems="stretch"
          justifyContent="spaceBetween"
        >
          <Box
            display="flex"
            alignItems="center"
            paddingRight={[2, 3, 3]}
            marginRight={[2, 3, 3]}
            className={styles.percentLabel}
          >
            <Text variant="h4" as="span">
              For this length of time you will get payments up to&nbsp;&nbsp;
              <Tooltip text="Payments amount to 80% of the average of the parent’s total wages during a specific period before the birth of the child." />
            </Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            className={styles.percentNumber}
          >
            <Text variant="h2" as="span" color="blue400">
              {percent}%
            </Text>
          </Box>
        </Box>
        <Box marginTop={8}>
          <Controller
            defaultValue={monthsToUse}
            name={id}
            render={({ onChange, value }) => (
              <Slider
                min={minMonths}
                max={maxMonths}
                trackStyle={{ gridTemplateRows: 8 }}
                calculateCellStyle={() => {
                  return {
                    background: theme.color.dark200,
                  }
                }}
                showMinMaxLabels
                showToolTip
                label={{ singular: 'mánuður', plural: 'mánuðir' }}
                currentIndex={value}
                onChange={(selectedMonths: number) => {
                  clearErrors(id)
                  onChange(selectedMonths)
                  setChosenDuration(selectedMonths)
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ParentalLeaveUsage
