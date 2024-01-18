import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { UniversityExternalData } from '../../types'
import { ProgramBase } from '@island.is/clients/university-gateway-api'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'

export const ProgramSelection: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const externalData = application.externalData

  const { formatMessage } = useLocale()

  const universities = externalData.universities
    .data as Array<UniversityExternalData>
  const programs = externalData.programs.data as Array<ProgramBase>
  const locations = ['location1 '] // TODO application.externalData.locations

  const programAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.program`,
  )

  const universityAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.university`,
  )

  const modeOfDeliveryAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.modeOfDelivery`,
  )

  const locationAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.examLocation`,
  )

  const [chosenProgram, setChosenProgram] = useState(programAnswer)
  const [chosenUniversity, setChosenUniversity] = useState(universityAnswer)
  const [chosenModeOfDelivery, setChosenModeOfDelivery] =
    useState(modeOfDeliveryAnswer)

  return (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${Routes.PROGRAMINFORMATION}.university`}
          label={formatMessage(
            information.labels.programSelection.selectUniversityPlaceholder,
          )}
          backgroundColor="blue"
          onSelect={(value) => setChosenUniversity(value.value)}
          options={universities.map((uni) => {
            return {
              label: uni.contentfulKey,
              value: uni.id,
            }
          })}
        />
      </Box>
      <Box marginTop={2}>
        {!!chosenUniversity && (
          <SelectController
            id={`${Routes.PROGRAMINFORMATION}.program`}
            label={formatMessage(
              information.labels.programSelection.selectProgramPlaceholder,
            )}
            onSelect={(value) => setChosenProgram(value.value)}
            options={programs
              .filter((program) => program.universityId === chosenUniversity)
              .map((program) => {
                return {
                  label: program.nameIs,
                  value: program.id,
                }
              })}
          />
        )}
      </Box>
      <Box marginTop={2}>
        {!!chosenProgram &&
          programs.filter((program) => program.id === chosenProgram)[0]
            .modeOfDelivery.length > 0 && (
            <RadioController
              id={`${Routes.PROGRAMINFORMATION}.modeOfDelivery`}
              split="1/2"
              onSelect={(value) => setChosenModeOfDelivery(value)}
              options={programs
                .filter((program) => program.id === chosenProgram)[0]
                .modeOfDelivery.map((deliveryMethod) => {
                  return {
                    label: deliveryMethod.modeOfDelivery,
                    value: deliveryMethod.modeOfDelivery,
                  }
                })}
            />
          )}
      </Box>
      <Box marginTop={2}>
        {(chosenModeOfDelivery === 'ONLINE' ||
          chosenModeOfDelivery === 'ONLINE_WITH_SESSION') && (
          <SelectController
            id={`${Routes.PROGRAMINFORMATION}.examLocation`}
            label={formatMessage(
              information.labels.programSelection.selectExamLocationPlaceholder,
            )}
            defaultValue={locationAnswer}
            options={locations.map((location) => {
              return {
                label: location,
                value: location,
              }
            })}
          />
        )}
      </Box>
    </Box>
  )
}
