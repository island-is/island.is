import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FC, useState, useCallback, useEffect } from 'react'
import { school } from '../../lib/messages'
import {
  checkIsFreshman,
  getTranslatedProgram,
  Language,
  LANGUAGE_CODE_DANISH,
  Program,
  SecondarySchool,
} from '../../utils'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath, YES } from '@island.is/application/core'
import { useLazyProgramList } from '../../hooks/useLazyProgramList'

type Option = {
  value: string
  label: string
}

interface SelectionItemProps {
  otherFieldIds: string[]
}

export const SelectionItem: FC<FieldBaseProps & SelectionItemProps> = (
  props,
) => {
  const { formatMessage, lang } = useLocale()
  const { application, setFieldLoadingState } = props
  const { setValue, watch } = useFormContext()
  const [isLoadingPrograms, setIsLoadingPrograms] = useState<boolean>(false)
  const [showSecondProgram, setShowSecondProgram] = useState<boolean>(true)
  const [isSecondProgramRequired, setIsSecondProgramRequired] =
    useState<boolean>(true)

  const isFreshman = checkIsFreshman(application.answers)

  // options for dropdowns
  const schoolOptions = getValueViaPath<SecondarySchool[]>(
    application.externalData,
    'schools.data',
  )
  const [programOptions, setProgramOptions] = useState<Program[]>([])
  const [thirdLanguageOptions, setThirdLanguageOptions] = useState<Language[]>(
    [],
  )
  const [nordicLanguageOptions, setNordicLanguageOptions] = useState<
    Language[]
  >([])
  const [allowRequestDormitory, setAllowRequestDormitory] =
    useState<boolean>(false)

  // state variables to make sure you cannot select duplicate programs
  const [selectedFirstProgramId, setSelectedFirstProgramId] = useState(
    getValueViaPath<string | undefined>(
      application.answers,
      `${props.field.id}.firstProgram.id`,
    ),
  )
  const [selectedSecondProgramId, setSelectedSecondProgramId] = useState(
    getValueViaPath<string | undefined>(
      application.answers,
      `${props.field.id}.secondProgram.id`,
    ),
  )

  // callback to get programs per school id
  const getProgramList = useLazyProgramList()
  const getProgramListCallback = useCallback(
    async (schoolId: string) => {
      const { data } = await getProgramList({
        schoolId,
        isFreshman,
      })
      return data
    },
    [getProgramList, isFreshman],
  )

  // initialize options in dropdowns
  useEffect(() => {
    const schoolIdAnswer = getValueViaPath<string | undefined>(
      application.answers,
      `${props.field.id}.school.id`,
    )

    // if school is set in answers, then initialize selections and options in dropdowns
    if (schoolIdAnswer) {
      // fetch programs per school
      setIsLoadingPrograms(true)
      getProgramListCallback(schoolIdAnswer)
        .then((response) => {
          const schoolInfo = schoolOptions?.find((x) => x.id === schoolIdAnswer)
          const programs = response.secondarySchoolProgramsBySchoolId

          // initialize options in dropdowns and checkbox visibility
          setProgramOptions(programs)
          setThirdLanguageOptions(schoolInfo?.thirdLanguages || [])
          setNordicLanguageOptions(schoolInfo?.nordicLanguages || [])
          setAllowRequestDormitory(schoolInfo?.allowRequestDormitory || false)
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsLoadingPrograms(false)
        })
    }
  }, [
    application.answers,
    getProgramListCallback,
    props.field.id,
    schoolOptions,
  ])

  const selectSchool = (option: Option) => {
    const schoolId = option.value
    const schoolInfo = schoolOptions?.find((x) => x.id === schoolId)
    setValue(`${props.field.id}.school.name`, schoolInfo?.name)

    setIsLoadingPrograms(true)
    getProgramListCallback(schoolId)
      .then((response) => {
        const programs = response.secondarySchoolProgramsBySchoolId

        // clear checkbox value
        setValue(`${props.field.id}.requestDormitory`, [])

        // update options in dropdowns and checkbox visibility
        setProgramOptions(programs)
        setThirdLanguageOptions(schoolInfo?.thirdLanguages || [])
        setNordicLanguageOptions(schoolInfo?.nordicLanguages || [])
        setAllowRequestDormitory(schoolInfo?.allowRequestDormitory || false)
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoadingPrograms(false)
      })
  }

  const selectFirstProgram = (option: Option) => {
    const programId = option.value
    const programInfo = programOptions.find((x) => x.id === programId)
    const isSecondRequired = isFreshman && !programInfo?.isSpecialNeedsProgram
    setValue(`${props.field.id}.firstProgram.nameIs`, programInfo?.nameIs || '')
    setValue(`${props.field.id}.firstProgram.nameEn`, programInfo?.nameEn || '')
    setValue(
      `${props.field.id}.firstProgram.registrationEndDate`,
      programInfo?.registrationEndDate || '',
    )
    setValue(
      `${props.field.id}.firstProgram.isSpecialNeedsProgram`,
      programInfo?.isSpecialNeedsProgram,
    )
    setValue(`${props.field.id}.secondProgram.require`, isSecondRequired)
    setIsSecondProgramRequired(isSecondRequired)
    setSelectedFirstProgramId(programId)
  }

  const selectSecondProgram = (option: Option) => {
    const programId = option.value
    const programInfo = programOptions.find((x) => x.id === programId)
    setValue(
      `${props.field.id}.secondProgram.nameIs`,
      programInfo?.nameIs || '',
    )
    setValue(
      `${props.field.id}.secondProgram.nameEn`,
      programInfo?.nameEn || '',
    )
    setValue(
      `${props.field.id}.secondProgram.registrationEndDate`,
      programInfo?.registrationEndDate || '',
    )
    setSelectedSecondProgramId(programId)
  }

  const selectThirdLanguage = (option: Option) => {
    const languageCode = option.value
    const languageInfo = thirdLanguageOptions.find(
      (x) => x.code === languageCode,
    )
    setValue(`${props.field.id}.thirdLanguage.name`, languageInfo?.name || '')
  }

  const selectNordicLanguage = (option: Option) => {
    const languageCode = option.value
    const languageInfo = nordicLanguageOptions.find(
      (x) => x.code === languageCode,
    )
    setValue(`${props.field.id}.nordicLanguage.name`, languageInfo?.name || '')
  }

  // initialize include for second program
  useEffect(() => {
    const showSecondProgram = programOptions.length !== 1
    setValue(`${props.field.id}.secondProgram.include`, showSecondProgram)
    setShowSecondProgram(showSecondProgram)
  }, [programOptions.length, props.field.id, setValue])

  // initialize require for second program
  useEffect(() => {
    const firstProgramIdAnswer = getValueViaPath<string | undefined>(
      application.answers,
      `${props.field.id}.firstProgram.id`,
    )
    const firstProgramInfo = programOptions.find(
      (x) => x.id === firstProgramIdAnswer,
    )
    const isSecondRequired =
      isFreshman && !firstProgramInfo?.isSpecialNeedsProgram
    setValue(`${props.field.id}.secondProgram.require`, isSecondRequired)
    setIsSecondProgramRequired(isSecondRequired)
  }, [
    programOptions,
    props.field.id,
    setValue,
    isFreshman,
    application.answers,
  ])

  useEffect(() => {
    setFieldLoadingState?.(isLoadingPrograms)
  }, [isLoadingPrograms, setFieldLoadingState])

  const otherSchoolIds: string[] = props.otherFieldIds
    .filter((fieldId) => watch(`${fieldId}.include`) === true)
    .map((fieldId) => watch(`${fieldId}.school.id`))

  const getErrorMessage = (fieldId: string) => {
    return props.errors && getErrorViaPath(props.errors, fieldId)
  }

  return (
    <Box>
      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.school.id`}
          label={formatMessage(school.selection.schoolLabel)}
          backgroundColor="blue"
          required
          error={getErrorMessage(`${props.field.id}.school.id`)}
          options={(schoolOptions || [])
            .filter(
              (x) =>
                (isFreshman
                  ? x.isOpenForAdmissionFreshman
                  : x.isOpenForAdmissionGeneral) &&
                !otherSchoolIds.includes(x.id),
            )
            .map((school) => {
              return {
                label: school.name,
                value: school.id,
              }
            })}
          onSelect={(value) => selectSchool(value)}
          clearOnChange={[
            `${props.field.id}.firstProgram.id`,
            `${props.field.id}.secondProgram.id`,
            `${props.field.id}.thirdLanguage.code`,
            `${props.field.id}.nordicLanguage.code`,
          ]}
        />
      </Box>

      <Box marginTop={2}>
        <SelectController
          id={`${props.field.id}.firstProgram.id`}
          label={formatMessage(school.selection.firstProgramLabel)}
          backgroundColor="blue"
          required
          error={getErrorMessage(`${props.field.id}.firstProgram.id`)}
          isLoading={isLoadingPrograms}
          disabled={isLoadingPrograms}
          options={programOptions
            .filter((x) => x.id !== selectedSecondProgramId)
            .map((program) => {
              return {
                label: getTranslatedProgram(lang, program),
                value: program.id,
              }
            })}
          onSelect={(value) => selectFirstProgram(value)}
        />
      </Box>

      {showSecondProgram && (
        <Box marginTop={2}>
          <SelectController
            id={`${props.field.id}.secondProgram.id`}
            label={formatMessage(school.selection.secondProgramLabel)}
            backgroundColor="blue"
            required={isSecondProgramRequired}
            error={getErrorMessage(`${props.field.id}.secondProgram.id`)}
            isClearable={!isSecondProgramRequired}
            isLoading={isLoadingPrograms}
            disabled={isLoadingPrograms}
            options={programOptions
              .filter((x) => x.id !== selectedFirstProgramId)
              .map((program) => {
                return {
                  label: getTranslatedProgram(lang, program),
                  value: program.id,
                }
              })}
            onSelect={(value) => selectSecondProgram(value)}
          />
        </Box>
      )}

      {(isLoadingPrograms || !!thirdLanguageOptions.length) && (
        <Box marginTop={2}>
          <SelectController
            id={`${props.field.id}.thirdLanguage.code`}
            label={formatMessage(school.selection.thirdLanguageLabel)}
            backgroundColor="blue"
            isClearable
            isLoading={isLoadingPrograms}
            disabled={isLoadingPrograms}
            options={thirdLanguageOptions.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })}
            onSelect={(value) => selectThirdLanguage(value)}
          />
        </Box>
      )}

      {(isLoadingPrograms ||
        !!nordicLanguageOptions.filter((x) => x.code !== LANGUAGE_CODE_DANISH)
          .length) && (
        <Box marginTop={2}>
          <SelectController
            id={`${props.field.id}.nordicLanguage.code`}
            label={formatMessage(school.selection.nordicLanguageLabel)}
            backgroundColor="blue"
            isClearable
            isLoading={isLoadingPrograms}
            disabled={isLoadingPrograms}
            options={nordicLanguageOptions
              .filter((x) => x.code !== LANGUAGE_CODE_DANISH)
              .map((language) => {
                return {
                  label: language.name,
                  value: language.code,
                }
              })}
            onSelect={(value) => selectNordicLanguage(value)}
          />
        </Box>
      )}

      {allowRequestDormitory && (
        <Box marginTop={2}>
          <CheckboxController
            id={`${props.field.id}.requestDormitory`}
            backgroundColor="blue"
            large
            spacing={2}
            options={[
              {
                label: formatMessage(
                  school.selection.requestDormitoryCheckboxLabel,
                ),
                value: YES,
              },
            ]}
          />
        </Box>
      )}
    </Box>
  )
}
