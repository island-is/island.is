import {
  buildAlertMessageField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { school } from '../../../lib/messages'
import {
  checkIsFreshman,
  getOtherSchoolIds,
  getProgramInfo,
  getRowsCountForSchoolSelection,
  getSchoolInfo,
  getTranslatedProgram,
  Routes,
  SecondarySchool,
} from '../../../utils'
import {
  Query,
  QuerySecondarySchoolProgramsBySchoolIdArgs,
} from '@island.is/api/schema'
import { PROGRAMS_BY_SCHOOLS_ID_QUERY } from '../../../graphql/queries'

export const schoolSection = buildSection({
  id: 'schoolSection',
  title: school.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SCHOOL,
      title: school.general.pageTitle,
      description: school.general.description,
      children: [
        buildFieldsRepeaterField({
          id: 'selection',
          titleVariant: 'h5',
          formTitleNumbering: 'none',
          formTitle: (index) => {
            if (index === 0) return school.firstSelection.subtitle
            else if (index === 1) return school.secondSelection.subtitle
            else if (index === 2) return school.thirdSelection.subtitle
            return ''
          },
          addItemButtonText: school.selection.addButtonLabel,
          removeItemButtonText: school.selection.removeButtonLabel,
          minRows: (answers, externalData) => {
            return getRowsCountForSchoolSelection(answers, externalData).min
          },
          maxRows: (answers, externalData) => {
            return getRowsCountForSchoolSelection(answers, externalData).max
          },
          marginTop: 0,
          fields: {
            'school.id': {
              component: 'select',
              label: school.selection.schoolLabel,
              required: true,
              options: (application) => {
                const schoolOptions = getValueViaPath<SecondarySchool[]>(
                  application.externalData,
                  'schools.data',
                )
                const isFreshman = checkIsFreshman(application.answers)

                return (schoolOptions || [])
                  .filter((x) =>
                    isFreshman
                      ? x.isOpenForAdmissionFreshman
                      : x.isOpenForAdmissionGeneral,
                  )
                  .map((school) => {
                    return {
                      label: school.name,
                      value: school.id,
                    }
                  })
              },
              filterOptions: (options, answers, index) => {
                const otherSchoolIds = getOtherSchoolIds(answers, index)
                return options.filter((x) => !otherSchoolIds.includes(x.value))
              },
              clearOnChange: (index) => {
                return [
                  `selection[${index}].firstProgram.id`,
                  `selection[${index}].secondProgram.id`,
                  `selection[${index}].thirdLanguage.code`,
                  `selection[${index}].nordicLanguage.code`,
                ]
              },
              setOnChange: (option, application, index) => {
                const schoolOptions = getValueViaPath<SecondarySchool[]>(
                  application.externalData,
                  'schools.data',
                )
                const selectedSchool = schoolOptions?.find(
                  (x) => x.id === option.value,
                )

                return [
                  {
                    key: `selection[${index}].school.name`,
                    value: selectedSchool?.name,
                  },
                  { key: `selection[${index}].requestDormitory`, value: [] }, // clear answer
                ]
              },
            },
            'firstProgram.id': {
              component: 'selectAsync',
              label: school.selection.firstProgramLabel,
              required: true,
              updateOnSelect: (index) => [
                `selection[${index}].school.id`,
                `selection[${index}].secondProgram.id`,
              ],
              loadOptions: async (
                { apolloClient, application },
                lang,
                activeField,
                setValueAtIndex,
              ) => {
                const schoolId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'school.id')
                const secondProgramId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'secondProgram.id')

                if (schoolId) {
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

                  setValueAtIndex?.(
                    'programOptions',
                    data?.secondarySchoolProgramsBySchoolId,
                  )

                  setValueAtIndex?.(
                    'secondProgram.include',
                    data?.secondarySchoolProgramsBySchoolId.length > 1,
                  )

                  const options =
                    data?.secondarySchoolProgramsBySchoolId?.map((program) => ({
                      value: program.id,
                      label: getTranslatedProgram(lang, {
                        nameIs: program.nameIs,
                        nameEn: program.nameEn,
                      }),
                    })) ?? []

                  return options.filter((x) => x.value !== secondProgramId)
                }

                return []
              },
              setOnChange: (option, application, index, activeField) => {
                const programInfo = getProgramInfo(activeField, option.value)

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
              },
            },
            'secondProgram.id': {
              component: 'selectAsync',
              label: school.selection.secondProgramLabel,
              required: (_, activeField) => {
                const secondProgramRequire =
                  (activeField &&
                    getValueViaPath<boolean>(
                      activeField,
                      'secondProgram.require',
                      true,
                    )) ||
                  false
                return secondProgramRequire
              },
              isClearable: (_, activeField) => {
                const secondProgramRequire =
                  (activeField &&
                    getValueViaPath<boolean>(
                      activeField,
                      'secondProgram.require',
                      true,
                    )) ||
                  false
                return !secondProgramRequire
              },
              condition: (_, activeField) => {
                const secondProgramInclude =
                  (activeField &&
                    getValueViaPath<boolean>(
                      activeField,
                      'secondProgram.include',
                      true,
                    )) ||
                  false
                return secondProgramInclude
              },
              updateOnSelect: (index) => [
                `selection[${index}].school.id`,
                `selection[${index}].firstProgram.id`,
              ],
              loadOptions: async (
                { apolloClient, application },
                lang,
                activeField,
                setValueAtIndex,
              ) => {
                const schoolId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'school.id')

                const firstProgramId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'firstProgram.id')

                if (schoolId) {
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

                  setValueAtIndex?.(
                    'programOptions',
                    data?.secondarySchoolProgramsBySchoolId,
                  )

                  const options =
                    data?.secondarySchoolProgramsBySchoolId?.map((program) => ({
                      value: program.id,
                      label: getTranslatedProgram(lang, {
                        nameIs: program.nameIs,
                        nameEn: program.nameEn,
                      }),
                    })) ?? []

                  return options.filter((x) => x.value !== firstProgramId)
                }

                return []
              },
              setOnChange: (option, _, index, activeField) => {
                const programInfo = getProgramInfo(activeField, option.value)

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
                ]
              },
            },
            'thirdLanguage.code': {
              component: 'select',
              label: school.selection.thirdLanguageLabel,
              isClearable: true,
              options: (application, activeField) => {
                const schoolInfo = getSchoolInfo(
                  application.externalData,
                  activeField,
                )
                return (schoolInfo?.thirdLanguages || []).map((language) => {
                  return {
                    label: language.name,
                    value: language.code,
                  }
                })
              },
              setOnChange: (option, application, index, activeField) => {
                const schoolInfo = getSchoolInfo(
                  application.externalData,
                  activeField,
                )
                const languageInfo = schoolInfo?.thirdLanguages?.find(
                  (x) => x.code === option.value,
                )
                return [
                  {
                    key: `selection[${index}].thirdLanguage.name`,
                    value: languageInfo?.name,
                  },
                ]
              },
            },
            'nordicLanguage.code': {
              component: 'select',
              label: school.selection.nordicLanguageLabel,
              isClearable: true,
              options: (application, activeField) => {
                const schoolInfo = getSchoolInfo(
                  application.externalData,
                  activeField,
                )
                return (schoolInfo?.nordicLanguages || []).map((language) => {
                  return {
                    label: language.name,
                    value: language.code,
                  }
                })
              },
              setOnChange: (option, application, index, activeField) => {
                const schoolInfo = getSchoolInfo(
                  application.externalData,
                  activeField,
                )
                const languageInfo = schoolInfo?.nordicLanguages?.find(
                  (x) => x.code === option.value,
                )
                return [
                  {
                    key: `selection[${index}].nordicLanguage.name`,
                    value: languageInfo?.name,
                  },
                ]
              },
            },
            requestDormitory: {
              component: 'checkbox',
              options: [
                {
                  label: school.selection.requestDormitoryCheckboxLabel,
                  value: YES,
                },
              ],
              condition: (application, activeField) => {
                const schoolInfo = getSchoolInfo(
                  application.externalData,
                  activeField,
                )
                return schoolInfo?.allowRequestDormitory || false
              },
            },
          },
        }),

        buildAlertMessageField({
          id: 'alertAddThirdSelection',
          alertType: 'info',
          message: school.thirdSelection.addDescription,
          condition: (answers) => {
            const isFreshman = checkIsFreshman(answers)

            const includeThirdSelection = getValueViaPath<boolean>(
              answers,
              'selection.2.include',
            )

            return isFreshman && !includeThirdSelection
          },
        }),
      ],
    }),
  ],
})
