import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { FC, useState, useCallback, useEffect } from 'react'
import { school } from '../../lib/messages'
import {
  Language,
  NORDIC_LANGUAGES,
  Program,
  SecondarySchool,
} from '../../shared'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyProgramList } from '../../hooks/useLazyProgramList'

export const SelectionItem: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, setFieldLoadingState } = props
  const { setValue } = useFormContext()

  const [selectedFirstProgram, setSelectedFirstProgram] = useState<string>() //TODOx afhverju hreinsast ekki út í SelectController
  const [isLoadingPrograms, setIsLoadingPrograms] = useState<boolean>(false)

  const oldSchoolId = getValueViaPath<string | undefined>(
    application.answers,
    `${props.field.id}.school.id`,
  )

  const schools = application.externalData.schools.data as SecondarySchool[]
  const [programs, setPrograms] = useState<Program[]>([])
  const [thirdLanguages, setThirdLanguages] = useState<Language[]>(
    (oldSchoolId &&
      schools.find((x) => x.id === oldSchoolId)?.thirdLanguages) ||
      [],
  )

  const selectSchool = (schoolId: string) => {
    const schoolInfo = schools.find((x) => x.id === schoolId)

    setIsLoadingPrograms(true)
    getProgramListCallback(schoolId)
      .then((response) => {
        // set selected school
        setValue(`${props.field.id}.school.name`, schoolInfo?.name)

        // clear first program selection
        setValue(`${props.field.id}.firstProgram.id`, '')
        setValue(`${props.field.id}.firstProgram.name`, undefined)
        setValue(
          `${props.field.id}.firstProgram.registrationEndDate`,
          undefined,
        )
        setSelectedFirstProgram(undefined)

        // clear second program selection
        setValue(`${props.field.id}.secondProgram.id`, '')
        setValue(`${props.field.id}.secondProgram.name`, undefined)
        setValue(
          `${props.field.id}.secondProgram.registrationEndDate`,
          undefined,
        )

        // clear third language selection
        setValue(`${props.field.id}.thirdLanguage.code`, '')
        setValue(`${props.field.id}.thirdLanguage.name`, undefined)

        // update options in dropdowns
        setPrograms(response.secondarySchoolProgramsBySchoolId)
        setThirdLanguages(schoolInfo?.thirdLanguages || [])
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoadingPrograms(false)
      })
  }

  const selectProgram = (fieldName: string, programId: string) => {
    const programInfo = programs.find((x) => x.id === programId)
    setValue(`${props.field.id}.${fieldName}.name`, programInfo?.nameIs)
    setValue(
      `${props.field.id}.${fieldName}.registrationEndDate`,
      programInfo?.registrationEndDate,
    )
    setSelectedFirstProgram(programId)
  }

  const selectThirdLanguage = (languageCode: string) => {
    const languageInfo = thirdLanguages.find((x) => x.code === languageCode)
    setValue(`${props.field.id}.thirdLanguage.name`, languageInfo?.nameIs)
  }

  const selectNordicLanguage = (languageCode: string) => {
    const languageInfo = NORDIC_LANGUAGES.find((x) => x.code === languageCode)
    setValue(`${props.field.id}.nordicLanguage.name`, languageInfo?.nameIs)
  }

  const getProgramList = useLazyProgramList()
  const getProgramListCallback = useCallback(
    async (schoolId: string) => {
      const { data } = await getProgramList({
        schoolId,
      })
      return data
    },
    [getProgramList],
  )

  useEffect(() => {
    setFieldLoadingState?.(isLoadingPrograms)
  }, [isLoadingPrograms, setFieldLoadingState])

  return (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.school.id`}
          label={formatMessage(school.selection.schoolLabel)}
          backgroundColor="blue"
          required
          options={schools.map((school) => {
            return {
              label: school.name,
              value: school.id,
            }
          })}
          onSelect={(value) => selectSchool(value.value as string)}
        />
      </Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.firstProgram.id`}
          label={formatMessage(school.selection.firstProgramLabel)}
          backgroundColor="blue"
          required
          defaultValue={selectedFirstProgram}
          options={programs.map((program) => {
            return {
              label: program.nameIs,
              value: program.id,
            }
          })}
          onSelect={(value) =>
            selectProgram('firstProgram', value.value as string)
          }
        />
      </Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.secondProgram.id`}
          label={formatMessage(school.selection.secondProgramLabel)}
          backgroundColor="blue"
          required
          options={programs.map((program) => {
            return {
              label: program.nameIs,
              value: program.id,
            }
          })}
          onSelect={(value) =>
            selectProgram('secondProgram', value.value as string)
          }
        />
      </Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.thirdLanguage.code`}
          label={formatMessage(school.selection.thirdLanguageLabel)}
          backgroundColor="blue"
          required
          options={thirdLanguages.map((language) => {
            return {
              label: language.nameIs,
              value: language.code,
            }
          })}
          onSelect={(value) => selectThirdLanguage(value.value as string)}
        />
      </Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.nordicLanguage.code`}
          label={formatMessage(school.selection.nordicLanguageLabel)}
          backgroundColor="blue"
          options={NORDIC_LANGUAGES.map((language) => {
            return {
              label: language.nameIs,
              value: language.code,
            }
          })}
          onSelect={(value) => selectNordicLanguage(value.value as string)}
        />
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            message={formatMessage(school.selection.nordicLanguageAlertMessage)}
          />
        </Box>
      </Box>
    </Box>
  )
}
