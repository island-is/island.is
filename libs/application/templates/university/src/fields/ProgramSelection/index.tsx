import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { AlertMessage, Box, LoadingDots } from '@island.is/island-ui/core'
import { UniversityApplication } from '../../lib/dataSchema'
import { EMPTY_MODE_OF_DELIVERY, Routes } from '../../lib/constants'
import { SelectController } from '@island.is/shared/form-fields'
import { UniversityExternalData } from '../../types'
import { Program } from '@island.is/clients/university-gateway-api'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyUniversityQuery } from '../../hooks/useGetUniversityInformation'
import { UniversityGatewayUniversity } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'

export const ProgramSelection: FC<FieldBaseProps> = ({ application }) => {
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

  const preSelectedProgram = getValueViaPath(answers, `initialQuery`, '')
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
  const modeOfDeliveryAnswer = getValueViaPath(
    answers,
    `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
  ) as string | undefined

  const [selectedUniversity, setSelectedUniversity] = useState<string>()
  const [selectedProgram, setSelectedProgram] = useState<string>()
  const [filteredPrograms, setFilteredPrograms] = useState<Array<Program>>([])
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [loadingPreAnswer, setLoadingPreAnswer] = useState(true)
  const [contentfulUniversities, setContentfulUniversities] = useState<
    Array<UniversityGatewayUniversity>
  >([])

  const getUniversities = useLazyUniversityQuery()
  const getUniversityInformationCallback = useCallback(async () => {
    const { data } = await getUniversities({})
    return data
  }, [getUniversities])

  useEffect(() => {
    //Get university information from contentful
    getUniversityInformationCallback().then((response) => {
      const responseUniversities = response.universityGatewayUniversities
      setContentfulUniversities(responseUniversities)
      setLoadingUniversities(false)

      let universityId: string | undefined

      // We have a predetermined the program selection and there is no value yet in application answers
      if (
        preSelectedProgram &&
        universityAnswer === '' &&
        programAnswer === ''
      ) {
        const programInfo = programs.find((x) => x.id === preSelectedProgram)

        const universityInfo = responseUniversities.find(
          (x) => x.id === programInfo?.universityId,
        )

        // set selected university
        if (universityInfo) {
          setSelectedUniversity(universityInfo.id)
          setValue(
            `${Routes.PROGRAMINFORMATION}.universityName`,
            universityInfo.contentfulTitle,
          )
        }

        // set selected program
        if (programInfo) {
          setSelectedProgram(programInfo.id)
          setValue(
            `${Routes.PROGRAMINFORMATION}.programName`,
            getProgramNameAndExtra(programInfo),
          )

          updateDefaultModeOfDelivery(programInfo)
        }

        // set universityId to filter programs
        universityId = universityInfo?.id
      } else {
        // Otherwise apply the answers we already have
        if (universityAnswer) setSelectedUniversity(universityAnswer)
        if (programAnswer) setSelectedProgram(programAnswer)

        // set universityId to filter programs
        universityId = universityAnswer
      }

      // filter program list by selected university
      setFilteredPrograms(
        universityId
          ? sortedProgramsDeepCopy.filter(
              (program) => program.universityId === universityId,
            )
          : [],
      )

      setLoadingPreAnswer(false)
    })
  }, [])

  // to make sure chosenMode value is not cleared when going back and forth
  useEffect(() => {
    setValue(
      `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
      modeOfDeliveryAnswer,
    )
  }, [modeOfDeliveryAnswer, setValue])

  const selectUniversity = (universityId: string) => {
    const universityInfo = contentfulUniversities.find(
      (x) => x.id === universityId,
    )

    // set selected university
    setSelectedUniversity(universityId)
    setValue(
      `${Routes.PROGRAMINFORMATION}.universityName`,
      universityInfo?.contentfulTitle,
    )

    // clear program selection
    setSelectedProgram(undefined)
    setValue(`${Routes.PROGRAMINFORMATION}.program`, '') // set as empty string to make dropdown look empty
    setValue(`${Routes.PROGRAMINFORMATION}.programName`, undefined) // set as undefined to make zod validation stop user from continuing to next step

    // filter program list by selected university
    setFilteredPrograms(
      universityId
        ? sortedProgramsDeepCopy.filter(
            (program) => program.universityId === universityId,
          )
        : [],
    )
  }

  const selectProgram = (programId: string) => {
    const programInfo = programs.find(
      (program) =>
        program.universityId === selectedUniversity && program.id === programId,
    )

    // set selected program
    setSelectedProgram(programId)
    setValue(
      `${Routes.PROGRAMINFORMATION}.programName`,
      programInfo && getProgramNameAndExtra(programInfo),
    )

    // set default mode of delivery (or clear selection)
    updateDefaultModeOfDelivery(programInfo)

    // clear testing site selection
    clearModeOfDeliveryTestingSite()
  }

  const updateDefaultModeOfDelivery = (program: Program | undefined) => {
    if (program?.modeOfDelivery.length === 1) {
      setValue(
        `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
        program.modeOfDelivery[0].modeOfDelivery,
      )
    } else {
      setValue(
        `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
        EMPTY_MODE_OF_DELIVERY,
      )
    }
  }

  const clearModeOfDeliveryTestingSite = () => {
    setValue(`${Routes.MODEOFDELIVERYINFORMATION}.location`, '')
  }

  const getProgramNameAndExtra = (program: Program) => {
    const extra =
      lang === 'is' && program
        ? program.specializationNameIs
          ? ` - ${formatMessage(
              information.labels.programSelection.specializationLabel,
            )}: ${program.specializationNameIs}`
          : ''
        : program && program.specializationNameEn
        ? ` - ${formatMessage(
            information.labels.programSelection.specializationLabel,
          )}: ${program.specializationNameEn}`
        : ''

    return (
      program && `${lang === 'is' ? program.nameIs : program.nameEn}${extra}`
    )
  }

  return !loadingUniversities && !loadingPreAnswer ? (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${Routes.PROGRAMINFORMATION}.university`}
          defaultValue={selectedUniversity}
          label={formatMessage(
            information.labels.programSelection.selectUniversityPlaceholder,
          )}
          backgroundColor="blue"
          onSelect={(value) => selectUniversity(value.value as string)}
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
      {!!selectedUniversity && (
        <Box marginTop={2}>
          {!!filteredPrograms.length && (
            <SelectController
              id={`${Routes.PROGRAMINFORMATION}.program`}
              label={formatMessage(
                information.labels.programSelection.selectProgramPlaceholder,
              )}
              backgroundColor="blue"
              defaultValue={selectedProgram}
              onSelect={(value) => selectProgram(value.value as string)}
              options={filteredPrograms
                .sort((x, y) => {
                  if (lang === 'is' && x.nameIs > y.nameIs) return 1
                  else if (lang === 'en' && x.nameEn > y.nameEn) return 1
                  else return -1
                })
                .map((program) => {
                  return {
                    label: getProgramNameAndExtra(program),
                    value: program.id,
                  }
                })}
            />
          )}
          {!filteredPrograms.length && (
            <AlertMessage
              type="warning"
              title={formatMessage(
                information.labels.programSelection
                  .warningEmptyProgramListTitle,
              )}
              message={formatMessage(
                information.labels.programSelection
                  .warningEmptyProgramListMessage,
              )}
            />
          )}
        </Box>
      )}
    </Box>
  ) : (
    <LoadingDots />
  )
}
