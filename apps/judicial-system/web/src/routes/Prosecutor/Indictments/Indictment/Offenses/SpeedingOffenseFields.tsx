import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import { InputMask } from '@react-input/mask'

import { Box, Input } from '@island.is/island-ui/core'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  IndictmentCount,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { removeErrorMessageIfValid } from '@island.is/judicial-system-web/src/utils/formHelper'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './SpeedingOffenseFields.strings'

export const SpeedingOffenseFields = ({
  setWorkingCase,
  indictmentCount,
  handleIndictmentCountChanges,
  updateIndictmentCountState,
}: {
  setWorkingCase: Dispatch<SetStateAction<Case>>
  indictmentCount: IndictmentCount
  handleIndictmentCountChanges: (
    update: UpdateIndictmentCount,
    updatedOffenses?: Offense[],
  ) => void
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
    updatedOffenses?: Offense[],
  ) => void
}) => {
  const { formatMessage } = useIntl()

  const [recordedSpeedErrorMessage, setRecordedSpeedErrorMessage] =
    useState<string>('')
  const [speedLimitErrorMessage, setSpeedLimitErrorMessage] =
    useState<string>('')
  return (
    <Box marginBottom={2}>
      <SectionHeading
        title={formatMessage(strings.speedingTitle)}
        heading="h4"
        marginBottom={2}
      />
      <Box marginBottom={1}>
        <InputMask
          component={Input}
          mask="___"
          replacement={{ _: /\d/ }}
          value={indictmentCount.recordedSpeed?.toString() ?? ''}
          onChange={(event) => {
            const recordedSpeed = parseInt(event.target.value)

            removeErrorMessageIfValid(
              ['empty'],
              event.target.value,
              recordedSpeedErrorMessage,
              setRecordedSpeedErrorMessage,
            )

            updateIndictmentCountState(
              indictmentCount.id,
              { recordedSpeed },
              setWorkingCase,
            )
          }}
          onBlur={(event) => {
            const recordedSpeed = parseInt(event.target.value)

            if (Number.isNaN(recordedSpeed)) {
              setRecordedSpeedErrorMessage('Reitur má ekki vera tómur')
              return
            }

            handleIndictmentCountChanges({
              recordedSpeed,
            })
          }}
          name="recordedSpeed"
          autoComplete="off"
          label={formatMessage(strings.recordedSpeedLabel)}
          placeholder="0"
          required
          errorMessage={recordedSpeedErrorMessage}
          hasError={recordedSpeedErrorMessage !== ''}
        />
      </Box>
      <InputMask
        component={Input}
        mask="___"
        replacement={{ _: /\d/ }}
        value={indictmentCount.speedLimit?.toString() ?? ''}
        onChange={(event) => {
          const speedLimit = parseInt(event.target.value)

          removeErrorMessageIfValid(
            ['empty'],
            event.target.value,
            speedLimitErrorMessage,
            setSpeedLimitErrorMessage,
          )

          updateIndictmentCountState(
            indictmentCount.id,
            { speedLimit },
            setWorkingCase,
          )
        }}
        onBlur={(event) => {
          const speedLimit = parseInt(event.target.value)

          if (Number.isNaN(speedLimit)) {
            setSpeedLimitErrorMessage('Reitur má ekki vera tómur')
            return
          }

          handleIndictmentCountChanges({
            speedLimit,
          })
        }}
        name="speedLimit"
        autoComplete="off"
        label={formatMessage(strings.speedLimitLabel)}
        placeholder="0"
        required
        errorMessage={speedLimitErrorMessage}
        hasError={speedLimitErrorMessage !== ''}
      />
    </Box>
  )
}
