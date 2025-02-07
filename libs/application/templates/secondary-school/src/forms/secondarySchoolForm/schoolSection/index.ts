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
  getRowsCountForSchoolSelection,
  getTranslatedProgram,
  Routes,
  SecondarySchool,
} from '../../../utils'

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
          title: '',
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
              component: 'select', // TODOx async select (need to also graphql if school id is already in answers)
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
              clearOnChangeByIndex: [
                'firstProgram.id',
                'secondProgram.id',
                'thirdLanguage.code',
                'nordicLanguage.code',
              ],
              setOnChangeByIndex: (option, application) => {
                const schoolOptions = getValueViaPath<SecondarySchool[]>(
                  application.externalData,
                  'schools.data',
                )
                const selectedSchool = schoolOptions?.find(
                  (x) => x.id === option.value,
                )

                return [
                  { key: 'school.name', value: selectedSchool?.name },
                  { key: 'requestDormitory', value: [] },
                  {
                    key: 'secondProgram.include',
                    // value: programOptions.length > 1, // TODOx get from graphql
                    value: true,
                  },
                ]
              },
            },
            'firstProgram.id': {
              component: 'select',
              label: school.selection.firstProgramLabel,
              required: true,
              // TODOx get options from graphql
              options: (_1, activeField, lang) => {
                const secondProgramId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'secondProgram.id')

                const schoolId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'school.id')
                const options = [
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 1',
                      nameEn: '',
                    }),
                    value: `${schoolId}-1`,
                  },
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 2',
                      nameEn: '',
                    }),
                    value: `${schoolId}-2`,
                  },
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 3',
                      nameEn: '',
                    }),
                    value: `${schoolId}-3`,
                  },
                ]

                return options.filter((x) => x.value !== secondProgramId)
              },
              // TODOx set isLoading+isDisabled when loading graphql
              setOnChangeByIndex: (option, application) => {
                const firstProgramIsSpecialNeedsProgram = false // TODOx get from graphql
                return [
                  { key: 'firstProgram.nameIs', value: 'x' }, // TODOx get from graphql
                  { key: 'firstProgram.nameEn', value: 'x' }, // TODOx get from graphql
                  {
                    key: 'firstProgram.registrationEndDate',
                    value: new Date().toISOString(), // TODOx get from graphql
                  },
                  {
                    key: 'firstProgram.isSpecialNeedsProgram',
                    value: firstProgramIsSpecialNeedsProgram,
                  },
                  {
                    key: 'secondProgram.require',
                    value:
                      checkIsFreshman(application.answers) &&
                      !firstProgramIsSpecialNeedsProgram,
                  },
                ]
              },
            },
            'secondProgram.id': {
              component: 'select',
              label: school.selection.secondProgramLabel,
              required: (_, activeField) => {
                const secondProgramRequire =
                  (activeField &&
                    getValueViaPath<boolean>(
                      activeField,
                      'secondProgram.require',
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
                    )) ||
                  false
                return secondProgramInclude
              },
              // TODOx get options from school graphql
              options: (_1, activeField, lang) => {
                const firstProgramId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'firstProgram.id')

                const schoolId =
                  activeField &&
                  getValueViaPath<string>(activeField, 'school.id')
                const options = [
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 1',
                      nameEn: '',
                    }),
                    value: `${schoolId}-1`,
                  },
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 2',
                      nameEn: '',
                    }),
                    value: `${schoolId}-2`,
                  },
                  {
                    label: getTranslatedProgram(lang, {
                      nameIs: 'Braut 3',
                      nameEn: '',
                    }),
                    value: `${schoolId}-3`,
                  },
                ]

                return options.filter((x) => x.value !== firstProgramId)
              },
              // TODOx set isLoading+isDisabled when loading graphql
              setOnChangeByIndex: () => {
                return [
                  { key: 'secondProgram.nameIs', value: 'x' }, // TODOx get from graphql
                  { key: 'secondProgram.nameEn', value: 'x' }, // TODOx get from graphql
                  {
                    key: 'secondProgram.registrationEndDate',
                    value: new Date().toISOString(), // TODOx get from graphql
                  },
                ]
              },
            },
            'thirdLanguage.code': {
              component: 'select',
              label: school.selection.thirdLanguageLabel,
              isClearable: true,
              // TODOx get options from school graphql
              options: [
                { label: 'Þýska', value: 'DE' },
                { label: 'Franska', value: 'FR' },
              ],
              // TODOx set isLoading+isDisabled when loading graphql
              setOnChangeByIndex: () => {
                return [
                  { key: 'thirdLanguage.name', value: 'x' }, // TODOx get from graphql
                ]
              },
            },
            'nordicLanguage.code': {
              component: 'select',
              label: school.selection.nordicLanguageLabel,
              isClearable: true,
              // TODOx get options from school graphql (minus danish)
              options: [
                { label: 'Sænska', value: 'SE' },
                { label: 'Norska', value: 'NO' },
              ],
              // TODOx set isLoading+isDisabled when loading graphql
              setOnChangeByIndex: () => {
                return [
                  { key: 'nordicLanguage.name', value: 'x' }, // TODOx get from graphql
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
              condition: () => true, // TODOx get condition from school graphql
            },
          },
        }),

        buildAlertMessageField({
          id: 'alertAddThirdSelection',
          alertType: 'info',
          title: '',
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

        // TODOx remove
        // buildCustomField({
        //   component: 'SchoolSelection',
        //   id: 'selection',
        //   title: '',
        //   description: '',
        // }),
      ],
    }),
  ],
})
