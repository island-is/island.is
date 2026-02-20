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
  getConditionNordicLanguage,
  getConditionRequestDormitory,
  getConditionSecondProgram,
  getConditionThirdLanguage,
  getFormTitle,
  getIsClearableSecondProgram,
  getNordicLanguageOptions,
  getRequestDormitoryOptions,
  getRequireSecondProgram,
  getRequireThirdLanguage,
  getRowsLimitCount,
  getSchoolOptions,
  getThirdLanguageOptions,
  getUpdateOnSelectFirstProgram,
  getUpdateOnSelectSecondProgram,
  loadProgramOptions,
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
          formTitle: (index) => getFormTitle(index),
          addItemButtonText: school.selection.addButtonLabel,
          removeItemButtonText: school.selection.removeButtonLabel,
          minRows: (answers, externalData) =>
            getRowsLimitCount(answers, externalData).min,
          maxRows: (answers, externalData) =>
            getRowsLimitCount(answers, externalData).max,
          marginTop: 0,
          fields: {
            'school.id': {
              component: 'select',
              label: school.selection.schoolLabel,
              required: true,
              options: (application) => getSchoolOptions(application),
              filterOptions: (options, answers, index) =>
                filterSchoolOptions(options, answers, index),
              clearOnChange: (index) => clearOnChangeSchool(index),
              setOnChange: async (option, application, index) =>
                setOnChangeSchool(option, application, index),
            },
            'firstProgram.id': {
              component: 'selectAsync',
              label: school.selection.firstProgramLabel,
              required: true,
              updateOnSelect: (index) => getUpdateOnSelectFirstProgram(index),
              loadOptions: (
                { apolloClient, application },
                lang,
                activeField,
                setValueAtIndex,
              ) =>
                loadProgramOptions(
                  apolloClient,
                  application,
                  lang,
                  activeField,
                  setValueAtIndex,
                  'secondProgram.id',
                ),
              setOnChange: async (option, application, index, activeField) =>
                setOnChangeFirstProgram(
                  option,
                  application,
                  index,
                  activeField,
                ),
            },
            'secondProgram.id': {
              component: 'selectAsync',
              label: school.selection.secondProgramLabel,
              required: (_, activeField) =>
                getRequireSecondProgram(activeField),
              isClearable: (_, activeField) =>
                getIsClearableSecondProgram(activeField),
              condition: (_, activeField) =>
                getConditionSecondProgram(activeField),
              updateOnSelect: (index) => getUpdateOnSelectSecondProgram(index),
              loadOptions: (
                { apolloClient, application },
                lang,
                activeField,
                setValueAtIndex,
              ) =>
                loadProgramOptions(
                  apolloClient,
                  application,
                  lang,
                  activeField,
                  setValueAtIndex,
                  'firstProgram.id',
                ),
              setOnChange: async (option, _, index, activeField) =>
                setOnChangeSecondProgram(option, index, activeField),
            },
            'thirdLanguage.code': {
              component: 'select',
              label: school.selection.thirdLanguageLabel,
              required: (_, activeField) =>
                getRequireThirdLanguage(activeField),
              isClearable: true,
              condition: (application, activeField) =>
                getConditionThirdLanguage(application, activeField),
              options: (application, activeField) =>
                getThirdLanguageOptions(application, activeField),
              setOnChange: async (option, application, index, activeField) =>
                setOnChangeThirdLanguage(
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
              condition: (application, activeField) =>
                getConditionNordicLanguage(application, activeField),
              options: (application, activeField) =>
                getNordicLanguageOptions(application, activeField),
              setOnChange: async (option, application, index, activeField) =>
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
              condition: (application, activeField) =>
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
