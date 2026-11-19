import {
  buildAlertMessageField,
  buildCustomField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { school } from '../../../lib/messages'
import { Routes } from '../../../utils'
import {
  clearOnChangeSchool,
  filterSchoolOptions,
  getAlertMessageConditionAddThirdSelection,
  getAlertMessageConditionSpecialNeedsProgram,
  getAlertMessageSpecialNeedsProgram,
  getFallbackThirdLanguageOptions,
  getConditionFallbackThirdLanguage,
  getConditionNordicLanguage,
  getConditionProgramApplicationMessage,
  getConditionRequestDormitory,
  getConditionSecondProgram,
  getConditionThirdLanguage,
  getFormTitle,
  getIsClearableSecondProgram,
  getNordicLanguageOptions,
  getProgramApplicationMessage,
  getRequestDormitoryOptions,
  getRequireFallbackThirdLanguage,
  getRequireSecondProgram,
  getRequireThirdLanguage,
  getRowsLimitCount,
  getSchoolOptions,
  getThirdLanguageOptions,
  getUpdateOnSelectFirstProgram,
  getUpdateOnSelectSecondProgram,
  loadProgramOptions,
  setOnChangeFallbackThirdLanguage,
  setOnChangeFirstProgram,
  setOnChangeNordicLanguage,
  setOnChangeSchool,
  setOnChangeSecondProgram,
  setOnChangeThirdLanguage,
} from './utils'

export const schoolSection = buildSection({
  id: 'schoolSection',
  title: school.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SCHOOL,
      title: school.general.pageTitle,
      description: school.general.description,
      children: [
        buildCustomField({
          component: 'UpdateExternalDataSchools',
          id: 'updateExternalDataSchools',
        }),
        buildFieldsRepeaterField({
          id: 'selection',
          titleVariant: 'h5',
          formTitleNumbering: 'none',
          formTitle: ({ index }) => getFormTitle(index),
          addItemButtonText: school.selection.addButtonLabel,
          removeItemButtonText: school.selection.removeButtonLabel,
          minRows: ({ application: { answers, externalData } }) =>
            getRowsLimitCount(answers, externalData).min,
          maxRows: ({ application: { answers, externalData } }) =>
            getRowsLimitCount(answers, externalData).max,
          marginTop: 0,
          fields: {
            'school.id': {
              component: 'select',
              label: school.selection.schoolLabel,
              required: true,
              options: ({ application }) => getSchoolOptions(application),
              filterOptions: (options, { application: { answers }, index }) =>
                filterSchoolOptions(options, answers, index),
              clearOnChange: () => clearOnChangeSchool(),
              setOnChange: async (option, { application, index }) =>
                setOnChangeSchool(option, application, index),
            },
            'firstProgram.id': {
              component: 'selectAsync',
              label: school.selection.firstProgramLabel,
              required: true,
              updateOnSelect: ({ index }) =>
                getUpdateOnSelectFirstProgram(index),
              loadOptions: (
                { apolloClient, application },
                { locale: lang, row: activeField, setValueAtIndex },
              ) =>
                loadProgramOptions(
                  apolloClient,
                  application,
                  lang,
                  activeField,
                  setValueAtIndex,
                  'secondProgram.id',
                ),
              setOnChange: async (
                option,
                { application, index, row: activeField },
              ) =>
                setOnChangeFirstProgram(
                  option,
                  application,
                  index,
                  activeField,
                ),
            },
            firstProgramAlert: {
              component: 'alertMessage',
              alertType: 'info',
              message: ({ application, index, locale }) =>
                getProgramApplicationMessage(
                  'firstProgram',
                  application.answers,
                  index,
                  locale,
                ),
              condition: ({ application, index, locale }) =>
                getConditionProgramApplicationMessage(
                  'firstProgram',
                  application.answers,
                  index,
                  locale,
                ),
            },
            'secondProgram.id': {
              component: 'selectAsync',
              label: school.selection.secondProgramLabel,
              required: ({ row: activeField }) =>
                getRequireSecondProgram(activeField),
              isClearable: ({ row: activeField }) =>
                getIsClearableSecondProgram(activeField),
              condition: ({ row: activeField }) =>
                getConditionSecondProgram(activeField),
              updateOnSelect: ({ index }) =>
                getUpdateOnSelectSecondProgram(index),
              loadOptions: (
                { apolloClient, application },
                { locale: lang, row: activeField, setValueAtIndex },
              ) =>
                loadProgramOptions(
                  apolloClient,
                  application,
                  lang,
                  activeField,
                  setValueAtIndex,
                  'firstProgram.id',
                ),
              setOnChange: async (option, { index, row: activeField }) =>
                setOnChangeSecondProgram(option, index, activeField),
            },
            secondProgramAlert: {
              component: 'alertMessage',
              alertType: 'info',
              message: ({ application, index, locale }) =>
                getProgramApplicationMessage(
                  'secondProgram',
                  application.answers,
                  index,
                  locale,
                ),
              condition: ({ application, index, locale }) =>
                getConditionProgramApplicationMessage(
                  'secondProgram',
                  application.answers,
                  index,
                  locale,
                ),
            },
            'thirdLanguage.code': {
              component: 'select',
              label: school.selection.thirdLanguageLabel,
              required: ({ row: activeField }) =>
                getRequireThirdLanguage(activeField),
              isClearable: true,
              condition: ({ application, row: activeField }) =>
                getConditionThirdLanguage(application, activeField),
              options: ({ application, row: activeField }) =>
                getThirdLanguageOptions(application, activeField),
              setOnChange: async (
                option,
                { application, index, row: activeField },
              ) =>
                setOnChangeThirdLanguage(
                  option,
                  application,
                  index,
                  activeField,
                ),
            },
            'fallbackThirdLanguage.code': {
              component: 'select',
              label: school.selection.fallbackThirdLanguageLabel,
              required: ({ row: activeField }) =>
                getRequireFallbackThirdLanguage(activeField),
              isClearable: true,
              condition: ({ application, row: activeField }) =>
                getConditionFallbackThirdLanguage(application, activeField),
              options: ({ application, row: activeField }) =>
                getFallbackThirdLanguageOptions(application, activeField),
              setOnChange: async (
                option,
                { application, index, row: activeField },
              ) =>
                setOnChangeFallbackThirdLanguage(
                  option,
                  application,
                  index,
                  activeField,
                ),
            },
            'nordicLanguage.code': {
              component: 'select',
              label: school.selection.nordicLanguageLabel,
              isClearable: true,
              condition: ({ application, row: activeField }) =>
                getConditionNordicLanguage(application, activeField),
              options: ({ application, row: activeField }) =>
                getNordicLanguageOptions(application, activeField),
              setOnChange: async (
                option,
                { application, index, row: activeField },
              ) =>
                setOnChangeNordicLanguage(
                  option,
                  application,
                  index,
                  activeField,
                ),
            },
            requestDormitory: {
              component: 'checkbox',
              options: getRequestDormitoryOptions(),
              condition: ({ application, row: activeField }) =>
                getConditionRequestDormitory(application, activeField),
            },
          },
        }),

        buildAlertMessageField({
          id: 'alertSpecialNeedsProgram',
          alertType: 'warning',
          title: school.selection.specialNeedsProgramAlertTitle,
          message: (application, locale) =>
            getAlertMessageSpecialNeedsProgram(application.answers, locale),
          condition: (answers) =>
            getAlertMessageConditionSpecialNeedsProgram(answers),
        }),

        buildAlertMessageField({
          id: 'alertAddThirdSelection',
          alertType: 'info',
          title: school.thirdSelection.addAlertTitle,
          message: school.thirdSelection.addAlertDescription,
          condition: (answers) =>
            getAlertMessageConditionAddThirdSelection(answers),
        }),
      ],
    }),
  ],
})
