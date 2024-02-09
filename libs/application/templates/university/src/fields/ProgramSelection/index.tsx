import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'
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
import { useLazyUniversityQuery } from '../../hooks/useGetUniversityInformation'
import { UniversityGatewayUniversity } from '@island.is/api/schema'

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

  const programAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.program`,
  )

  const universityAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.university`,
  )

  const [chosenProgram, setChosenProgram] = useState(programAnswer)
  const [chosenUniversity, setChosenUniversity] = useState(universityAnswer)
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [contentfulUniversities, setContentfulUniversities] = useState<
    Array<UniversityGatewayUniversity>
  >([])

  const getUniversities = useLazyUniversityQuery()
  const getUniversityInformationCallback = useCallback(async () => {
    const { data } = await getUniversities({})
    return data
  }, [getUniversities])

  useEffect(() => {
    getUniversityInformationCallback().then((response) => {
      console.log('response', response)
      setContentfulUniversities(response.universityGatewayUniversities)
      setLoadingUniversities(false)
    })
  }, [])

  return !loadingUniversities ? (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${Routes.PROGRAMINFORMATION}.university`}
          defaultValue={chosenUniversity}
          label={formatMessage(
            information.labels.programSelection.selectUniversityPlaceholder,
          )}
          backgroundColor="blue"
          onSelect={(value) => setChosenUniversity(value.value)}
          options={universities.map((uni) => {
            return {
              label:
                contentfulUniversities.filter(
                  (x) => x.contentfulKey === uni.contentfulKey,
                )[0].contentfulTitle || '',
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
            defaultValue={chosenProgram}
            onSelect={(value) => setChosenProgram(value.value)}
            options={programs
              .filter((program) => program.universityId === chosenUniversity)
              .map((program) => {
                const extra = program.specializationNameIs
                  ? ` - ${program.specializationNameIs}`
                  : ''
                return {
                  label: `${program.nameIs}${extra}`,
                  value: program.id,
                }
              })}
          />
        )}
      </Box>
    </Box>
  ) : (
    <LoadingDots />
  )
}
