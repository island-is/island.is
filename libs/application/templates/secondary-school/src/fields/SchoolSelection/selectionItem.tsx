import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { FC, useState } from 'react'
import { school } from '../../lib/messages'
import {
  Language,
  NORDIC_LANGUAGES,
  Program,
  SecondarySchool,
} from '../../shared'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

export const SelectionItem: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application } = props
  const { setValue } = useFormContext()

  const schools = application.externalData.schools.data as SecondarySchool[]

  const getThirdLanguages = (schoolId: string | undefined): Language[] => {
    if (!schoolId) return []

    const schoolInfo = schools.find((x) => x.id === schoolId)
    return schoolInfo?.thirdLanguages || []
  }

  //TODOx graphql
  const programs: Program[] = [
    { id: '1', name: 'Náttúrufræðibraut' },
    { id: '2', name: 'Félagsfræðibraut' },
  ]

  const [thirdLanguages, setThirdLanguages] = useState<Language[]>(
    getThirdLanguages(
      getValueViaPath<string | undefined>(
        application.answers,
        `${props.field.id}.school.id`,
      ),
    ),
  )

  const selectSchool = (schoolId: string) => {
    const schoolInfo = schools.find((x) => x.id === schoolId)

    // set selected school
    setValue(`${props.field.id}.school.name`, schoolInfo?.name)

    // clear program selection
    setValue(`${props.field.id}.firstProgram.id`, '')
    setValue(`${props.field.id}.firstProgram.name`, undefined)
    setValue(`${props.field.id}.secondProgram.id`, '')
    setValue(`${props.field.id}.secondProgram.name`, undefined)
    //TODOx update programList

    // clear language selection
    setValue(`${props.field.id}.thirdLanguage.code`, '')
    setValue(`${props.field.id}.thirdLanguage.name`, undefined)
    setThirdLanguages(getThirdLanguages(schoolId))
  }

  const selectProgram = (fieldName: string, programId: string) => {
    const programInfo = programs.find((x) => x.id === programId)
    setValue(`${props.field.id}.${fieldName}.name`, programInfo?.name)
  }

  const selectThirdLanguage = (languageCode: string) => {
    const languageInfo = thirdLanguages.find((x) => x.code === languageCode)
    setValue(`${props.field.id}.thirdLanguage.name`, languageInfo?.name)
  }

  const selectNordicLanguage = (languageCode: string) => {
    const languageInfo = NORDIC_LANGUAGES.find((x) => x.code === languageCode)
    setValue(`${props.field.id}.nordicLanguage.name`, languageInfo?.name)
  }

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
          options={programs.map((program) => {
            return {
              label: program.name,
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
              label: program.name,
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
              label: language.name,
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
              label: language.name,
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
