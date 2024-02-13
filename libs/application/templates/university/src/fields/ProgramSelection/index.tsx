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
import { Program } from '@island.is/clients/university-gateway-api'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyUniversityQuery } from '../../hooks/useGetUniversityInformation'
import { UniversityGatewayUniversity } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'

export const ProgramSelection: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const externalData = application.externalData

  const { formatMessage, lang } = useLocale()

  const { setValue } = useFormContext()

  const universities = externalData.universities
    .data as Array<UniversityExternalData>
  const programs = externalData.programs.data as Array<Program>

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
      setContentfulUniversities(response.universityGatewayUniversities)
      setLoadingUniversities(false)
    })
  }, [])

  const ChooseUniversity = (value: string) => {
    setChosenUniversity(value)
    setValue(
      `${Routes.PROGRAMINFORMATION}.universityName`,
      contentfulUniversities.filter((x) => x.id === value)[0].contentfulTitle ||
        '',
    )
  }

  const ChooseProgram = (value: string) => {
    const programInfo = programs.filter(
      (program) => program.universityId === chosenUniversity,
    )[0]
    const extra =
      lang === 'is'
        ? programInfo.specializationNameEn
          ? ` - ${programInfo.specializationNameEn}`
          : ''
        : programInfo.specializationNameEn
        ? ` - ${programInfo.specializationNameEn}`
        : ''
    const programName = `${
      lang === 'is' ? programInfo.nameIs : programInfo.nameEn
    }${extra}`
    setChosenProgram(value)
    setValue(`${Routes.PROGRAMINFORMATION}.programName`, programName)
  }

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
          onSelect={(value) => ChooseUniversity(value.value as string)}
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
            onSelect={(value) => ChooseProgram(value.value as string)}
            options={programs
              .filter((program) => program.universityId === chosenUniversity)
              .map((program) => {
                const extra =
                  lang === 'is'
                    ? program.specializationNameEn
                      ? ` - ${program.specializationNameEn}`
                      : ''
                    : program.specializationNameEn
                    ? ` - ${program.specializationNameEn}`
                    : ''
                return {
                  label: `${
                    lang === 'is' ? program.nameIs : program.nameEn
                  }${extra}`,
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
