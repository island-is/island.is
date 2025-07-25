import { getValueViaPath, YES } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  RepeaterOptionValue,
} from '@island.is/application/types'
import {
  checkIsFreshman,
  getSchoolsData,
  getTranslatedProgram,
  LANGUAGE_CODE_DANISH,
  Program,
  SecondarySchool,
} from '../../../utils'
import { SecondarySchoolAnswers } from '../../..'
import { school } from '../../../lib/messages'
import { Locale, StaticText } from '@island.is/shared/types'
import { ApolloClient } from '@apollo/client'
import {
  Query,
  QuerySecondarySchoolProgramsBySchoolIdArgs,
  SecondarySchoolProgram,
} from '@island.is/api/schema'
import { PROGRAMS_BY_SCHOOLS_ID_QUERY } from '../../../graphql/queries'

type RepeaterOption = { label: StaticText; value: string; tooltip?: StaticText }

const getSchoolInfo = (
  externalData: ExternalData,
  activeField?: Record<string, string>,
): SecondarySchool | undefined => {
  const schoolOptions = getSchoolsData(externalData)
  const schoolId =
    activeField && getValueViaPath<string>(activeField, 'school.id')
  return schoolOptions?.find((x) => x.id === schoolId)
}

const getProgramInfo = (
  activeField?: Record<string, string>,
  programId?: string,
): Program | undefined => {
  const programOptions =
    activeField && getValueViaPath<Program[]>(activeField, 'programOptions')
  return programOptions?.find((x) => x.id === programId)
}

const getStringFromOptionValue = (optionValue: RepeaterOptionValue): string => {
  return (
    optionValue && (Array.isArray(optionValue) ? optionValue[0] : optionValue)
  )
}

export const getFormTitle = (index: number): StaticText => {
  if (index === 0) return school.firstSelection.subtitle
  else if (index === 1) return school.secondSelection.subtitle
  else if (index === 2) return school.thirdSelection.subtitle
  return ''
}

export const getRowsLimitCount = (
  answers: FormValue,
  externalData: ExternalData,
): { min: number; max: number } => {
  const schools = getSchoolsData(externalData)

  const isFreshman = checkIsFreshman(answers)

  const isFirstFirstProgramSpecialNeedsProgram = getValueViaPath<boolean>(
    answers,
    'selection.0.firstProgram.isSpecialNeedsProgram',
  )

  let minSelectionCount: number | undefined
  let maxSelectionCount: number | undefined

  const filteredSchools = schools?.filter((x) =>
    isFreshman ? x.isOpenForAdmissionFreshman : x.isOpenForAdmissionGeneral,
  )

  if (isFreshman) {
    if (isFirstFirstProgramSpecialNeedsProgram) {
      minSelectionCount = 1
      maxSelectionCount = 3
    } else {
      minSelectionCount = 2
      maxSelectionCount = 3
    }
  } else {
    minSelectionCount = 1
    maxSelectionCount = 2
  }

  // overwrite values to handle if schools length is limited
  if (filteredSchools?.length === 1) {
    minSelectionCount = 1
    maxSelectionCount = 1
  } else if (filteredSchools?.length === 2) {
    minSelectionCount = Math.min(minSelectionCount, 2)
    maxSelectionCount = 2
  }

  return { min: minSelectionCount, max: maxSelectionCount }
}

export const getSchoolOptions = (
  application: Application,
): RepeaterOption[] => {
  const schoolOptions = getSchoolsData(application.externalData)
  const isFreshman = checkIsFreshman(application.answers)

  return (schoolOptions || [])
    .filter((x) =>
      isFreshman ? x.isOpenForAdmissionFreshman : x.isOpenForAdmissionGeneral,
    )
    .map((school) => {
      return {
        label: school.name,
        value: school.id,
      }
    })
}

export const filterSchoolOptions = (
  options: RepeaterOption[],
  answers: FormValue,
  index: number,
): RepeaterOption[] => {
  const otherSchoolIds: string[] = []
  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    answers,
    'selection',
  )
  selection?.forEach((item, i) => {
    if (i !== index && item.school?.id) {
      otherSchoolIds.push(item.school.id)
    }
  })

  return options.filter((x) => !otherSchoolIds.includes(x.value))
}

export const clearOnChangeSchool = (index: number) => {
  return [
    `selection[${index}].firstProgram.id`,
    `selection[${index}].secondProgram.id`,
    `selection[${index}].thirdLanguage.code`,
    `selection[${index}].nordicLanguage.code`,
  ]
}

export const setOnChangeSchool = (
  optionValue: RepeaterOptionValue,
  application: Application,
  index: number,
) => {
  const schoolOptions = getSchoolsData(application.externalData)
  const selectedSchool = schoolOptions?.find(
    (x) => x.id === getStringFromOptionValue(optionValue),
  )
  return [
    {
      key: `selection[${index}].school.name`,
      value: selectedSchool?.name,
    },
    {
      key: `selection[${index}].secondProgram.require`,
      value: checkIsFreshman(application.answers),
    },
    { key: `selection[${index}].requestDormitory`, value: [] }, // clear answer
  ]
}

export const getUpdateOnSelectFirstProgram = (index: number): string[] => {
  return [
    `selection[${index}].school.id`,
    `selection[${index}].secondProgram.id`,
  ]
}

export const loadProgramOptions = async (
  apolloClient: ApolloClient<object>,
  application: Application,
  lang: Locale,
  activeField?: Record<string, string>,
  setValueAtIndex?: (
    key: string,
    value: SecondarySchoolProgram[] | boolean,
  ) => void,
  otherProgramIdFieldKey?: string,
) => {
  try {
    const schoolId =
      activeField && getValueViaPath<string>(activeField, 'school.id')
    const otherProgramId =
      activeField &&
      otherProgramIdFieldKey &&
      getValueViaPath<string>(activeField, otherProgramIdFieldKey)

    if (!schoolId) {
      return []
    }

    const { data } = await apolloClient.query<
      Query,
      QuerySecondarySchoolProgramsBySchoolIdArgs
    >({
      query: PROGRAMS_BY_SCHOOLS_ID_QUERY,
      variables: {
        isFreshman: checkIsFreshman(application.answers),
        schoolId,
      },
    })

    const programs = data?.secondarySchoolProgramsBySchoolId || []

    setValueAtIndex?.('programOptions', programs)
    setValueAtIndex?.('secondProgram.include', programs.length > 1)

    return programs
      .map((program) => ({
        value: program.id,
        label: getTranslatedProgram(lang, {
          nameIs: program.nameIs,
          nameEn: program.nameEn,
        }),
      }))
      .filter((x) => x.value !== otherProgramId)
  } catch (error) {
    console.error('Error loading program options:', error)
    return []
  }
}

export const setOnChangeFirstProgram = (
  optionValue: RepeaterOptionValue,
  application: Application,
  index: number,
  activeField?: Record<string, string>,
) => {
  const programInfo = getProgramInfo(
    activeField,
    getStringFromOptionValue(optionValue),
  )
  return [
    {
      key: `selection[${index}].firstProgram.nameIs`,
      value: programInfo?.nameIs || '',
    },
    {
      key: `selection[${index}].firstProgram.nameEn`,
      value: programInfo?.nameEn || '',
    },
    {
      key: `selection[${index}].firstProgram.registrationEndDate`,
      value: programInfo?.registrationEndDate,
    },
    {
      key: `selection[${index}].firstProgram.isSpecialNeedsProgram`,
      value: programInfo?.isSpecialNeedsProgram,
    },
    {
      key: `selection[${index}].secondProgram.require`,
      value:
        checkIsFreshman(application.answers) &&
        !programInfo?.isSpecialNeedsProgram,
    },
  ]
}

export const getRequiredSecondProgram = (
  activeField?: Record<string, string>,
): boolean => {
  const secondProgramRequire =
    (activeField &&
      getValueViaPath<boolean>(activeField, 'secondProgram.require', true)) ||
    false
  return secondProgramRequire
}

export const getIsClearableSecondProgram = (
  activeField?: Record<string, string>,
): boolean => {
  const secondProgramRequire =
    (activeField &&
      getValueViaPath<boolean>(activeField, 'secondProgram.require', true)) ||
    false
  return !secondProgramRequire
}

export const getConditionSecondProgram = (
  activeField?: Record<string, string>,
): boolean => {
  const secondProgramInclude =
    (activeField &&
      getValueViaPath<boolean>(activeField, 'secondProgram.include', true)) ||
    false
  return secondProgramInclude
}

export const getUpdateOnSelectSecondProgram = (index: number): string[] => {
  return [
    `selection[${index}].school.id`,
    `selection[${index}].firstProgram.id`,
  ]
}

export const setOnChangeSecondProgram = (
  optionValue: RepeaterOptionValue,
  index: number,
  activeField?: Record<string, string>,
) => {
  const programInfo = getProgramInfo(
    activeField,
    getStringFromOptionValue(optionValue),
  )
  return [
    {
      key: `selection[${index}].secondProgram.nameIs`,
      value: programInfo?.nameIs || '',
    },
    {
      key: `selection[${index}].secondProgram.nameEn`,
      value: programInfo?.nameEn || '',
    },
    {
      key: `selection[${index}].secondProgram.registrationEndDate`,
      value: programInfo?.registrationEndDate,
    },
    {
      key: `selection[${index}].secondProgram.isSpecialNeedsProgram`,
      value: programInfo?.isSpecialNeedsProgram,
    },
  ]
}

export const getThirdLanguageCondition = (
  application: Application,
  activeField?: Record<string, string>,
): boolean => {
  return !!getThirdLanguageOptions(application, activeField).length
}

export const getThirdLanguageOptions = (
  application: Application,
  activeField?: Record<string, string>,
): RepeaterOption[] => {
  const schoolInfo = getSchoolInfo(application.externalData, activeField)
  return (schoolInfo?.thirdLanguages || []).map((language) => {
    return {
      label: language.name,
      value: language.code,
    }
  })
}

export const setOnChangeThirdLanguage = (
  optionValue: RepeaterOptionValue,
  application: Application,
  index: number,
  activeField?: Record<string, string>,
) => {
  const schoolInfo = getSchoolInfo(application.externalData, activeField)
  const languageInfo = schoolInfo?.thirdLanguages?.find(
    (x) => x.code === getStringFromOptionValue(optionValue),
  )
  return [
    {
      key: `selection[${index}].thirdLanguage.name`,
      value: languageInfo?.name,
    },
  ]
}

export const getNordicLanguageCondition = (
  application: Application,
  activeField?: Record<string, string>,
): boolean => {
  return !!getNordicLanguageOptions(application, activeField).length
}

export const getNordicLanguageOptions = (
  application: Application,
  activeField?: Record<string, string>,
): RepeaterOption[] => {
  const schoolInfo = getSchoolInfo(application.externalData, activeField)
  return (schoolInfo?.nordicLanguages || [])
    .filter((x) => x.code !== LANGUAGE_CODE_DANISH)
    .map((language) => {
      return {
        label: language.name,
        value: language.code,
      }
    })
}

export const setOnChangeNordicLanguage = (
  optionValue: RepeaterOptionValue,
  application: Application,
  index: number,
  activeField?: Record<string, string>,
) => {
  const schoolInfo = getSchoolInfo(application.externalData, activeField)
  const languageInfo = schoolInfo?.nordicLanguages?.find(
    (x) => x.code === getStringFromOptionValue(optionValue),
  )
  return [
    {
      key: `selection[${index}].nordicLanguage.name`,
      value: languageInfo?.name,
    },
  ]
}

export const getRequestDormitoryOptions = (): RepeaterOption[] => {
  return [
    {
      label: school.selection.requestDormitoryCheckboxLabel,
      value: YES,
    },
  ]
}

export const getRequestDormitoryCondition = (
  application: Application,
  activeField?: Record<string, string>,
): boolean => {
  const schoolInfo = getSchoolInfo(application.externalData, activeField)
  return schoolInfo?.allowRequestDormitory || false
}

export const getAlertMessageAddThirdSelectionCondition = (
  answers: FormValue,
): boolean => {
  const isFreshman = checkIsFreshman(answers)
  const includeThirdSelection = getValueViaPath<boolean>(
    answers,
    'selection.2.include',
  )
  return isFreshman && !includeThirdSelection
}

export const getAlertSpecialNeedsProgramCondition = (
  answers: FormValue,
): boolean => {
  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    answers,
    'selection',
  )

  return !!selection?.find(
    (x) =>
      x.firstProgram?.isSpecialNeedsProgram ||
      x.secondProgram?.isSpecialNeedsProgram,
  )
}

export const getAlertSpecialNeedsProgramMessage = (
  answers: FormValue,
  lang: Locale,
) => {
  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    answers,
    'selection',
  )

  const programNames =
    selection?.flatMap(({ firstProgram, secondProgram }) =>
      [firstProgram, secondProgram]
        .filter((x) => x?.isSpecialNeedsProgram)
        .map((x) =>
          getTranslatedProgram(lang, {
            nameIs: x?.nameIs,
            nameEn: x?.nameEn,
          }),
        ),
    ) || []

  return {
    ...school.selection.specialNeedsProgramAlertDescription,
    values: {
      programNameList: programNames.join(', '),
    },
  }
}
