import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { SelectController } from '@island.is/shared/form-fields'
import { UniversityExternalData } from '../../types'
import { Program } from '@island.is/clients/university-gateway-api'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyUniversityQuery } from '../../hooks/useGetUniversityInformation'
import { UniversityGatewayUniversity } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { ModeOfDelivery } from '@island.is/university-gateway'

export const ProgramSelection: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const externalData = application.externalData
  const universities = externalData.universities
    .data as Array<UniversityExternalData>
  const programs = externalData.programs.data as Array<Program>
  const sortedProgramsDeepCopy = JSON.parse(
    JSON.stringify(programs),
  ) as Array<Program>

  const { formatMessage, lang } = useLocale()
  const { setValue } = useFormContext()

  const preChosenProgram = getValueViaPath(answers, `initialQuery`, '')
  const programAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.program`,
    '',
  )
  const universityAnswer = getValueViaPath(
    answers,
    `${Routes.PROGRAMINFORMATION}.university`,
    '',
  )

  const [chosenProgram, setChosenProgram] = useState<string>()
  const [chosenUniversity, setChosenUniversity] = useState<string>()
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [loadingPreAnswer, setLoadingPreAnswer] = useState(true)
  const [contentfulUniversities, setContentfulUniversities] = useState<
    Array<UniversityGatewayUniversity>
  >([])

  useEffect(() => {
    //Get university information from contentful
    getUniversityInformationCallback().then((response) => {
      setContentfulUniversities(response.universityGatewayUniversities)
      setLoadingUniversities(false)
    })

    //We have a predetermined choice and no answer already in application
    if (preChosenProgram && programAnswer === '' && universityAnswer === '') {
      setChosenProgram(preChosenProgram)
      const programUniversityId = programs.find(
        (x) => x.id === preChosenProgram,
      )?.universityId
      setChosenUniversity(
        universities.find((x) => x.id === programUniversityId)?.id || '',
      )
    } else {
      // Otherwise apply the answers we already have
      setChosenProgram(programAnswer)
      setChosenUniversity(universityAnswer)
    }
    setLoadingPreAnswer(false)
  }, [])

  const getUniversities = useLazyUniversityQuery()
  const getUniversityInformationCallback = useCallback(async () => {
    const { data } = await getUniversities({})
    return data
  }, [getUniversities])

  const ChooseUniversity = (value: string) => {
    setChosenUniversity(value)
    setValue(
      `${Routes.PROGRAMINFORMATION}.universityName`,
      contentfulUniversities.filter((x) => x.id === value)[0].contentfulTitle ||
        '',
    )
  }

  const ChooseProgram = (value: string) => {
    const chosenProgram = programs.find(
      (program) =>
        program.universityId === chosenUniversity && program.id === value,
    )

    const extra =
      lang === 'is' && chosenProgram
        ? chosenProgram.specializationNameIs
          ? ` - ${formatMessage(
              information.labels.programSelection.specializationLabel,
            )}: ${chosenProgram.specializationNameIs}`
          : ''
        : chosenProgram && chosenProgram.specializationNameEn
        ? ` - ${formatMessage(
            information.labels.programSelection.specializationLabel,
          )}: ${chosenProgram.specializationNameEn}`
        : ''
    const programName = `${
      lang === 'is' && chosenProgram
        ? chosenProgram.nameIs
        : chosenProgram && chosenProgram.nameEn
    }${extra}`
    setChosenProgram(value)
    if (
      chosenProgram?.modeOfDelivery &&
      chosenProgram?.modeOfDelivery.length <= 1
    ) {
      setValue(`modeOfDeliveryInformation.chosenMode`, ModeOfDelivery.ON_SITE)
    }
    setValue(`${Routes.PROGRAMINFORMATION}.programName`, programName)
  }

  return !loadingUniversities && !loadingPreAnswer ? (
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
            options={sortedProgramsDeepCopy
              .sort((x, y) => {
                if (lang === 'is' && x.nameIs > y.nameIs) return 1
                else if (lang === 'en' && x.nameEn > y.nameEn) return 1
                else return -1
              })
              .filter((program) => program.universityId === chosenUniversity)
              .map((program) => {
                const extra =
                  lang === 'is'
                    ? program.specializationNameIs
                      ? ` - ${formatMessage(
                          information.labels.programSelection
                            .specializationLabel,
                        )}: ${program.specializationNameIs}`
                      : ''
                    : program.specializationNameEn
                    ? ` - ${formatMessage(
                        information.labels.programSelection.specializationLabel,
                      )}: ${program.specializationNameEn}`
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
