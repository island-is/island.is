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
  getAlertMessageAddThirdSelectionCondition,
  getAlertSpecialNeedsProgramCondition,
  getAlertSpecialNeedsProgramMessage,
  getConditionSecondProgram,
  getFormTitle,
  getIsClearableSecondProgram,
  getNordicLanguageCondition,
  getNordicLanguageOptions,
  getRequestDormitoryCondition,
  getRequestDormitoryOptions,
  getRequiredSecondProgram,
  getRowsLimitCount,
  getSchoolOptions,
  getThirdLanguageCondition,
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
              setOnChange: (option, application, index) =>
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
              setOnChange: (option, application, index, activeField) =>
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
                getRequiredSecondProgram(activeField),
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
              setOnChange: (option, _, index, activeField) =>
                setOnChangeSecondProgram(option, index, activeField),
            },
            'thirdLanguage.code': {
              component: 'select',
              label: school.selection.thirdLanguageLabel,
              isClearable: true,
              condition: (application, activeField) =>
                getThirdLanguageCondition(application, activeField),
              options: (application, activeField) =>
                getThirdLanguageOptions(application, activeField),
              setOnChange: (option, application, index, activeField) =>
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
                getNordicLanguageCondition(application, activeField),
              options: (application, activeField) =>
                getNordicLanguageOptions(application, activeField),
              setOnChange: (option, application, index, activeField) =>
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
                getRequestDormitoryCondition(application, activeField),
            },
          },
        }),

        buildAlertMessageField({
          id: 'alertSpecialNeedsProgram',
          alertType: 'warning',
          title: school.selection.specialNeedsProgramAlertTitle,
          message: (application, locale) =>
            getAlertSpecialNeedsProgramMessage(application.answers, locale),
          condition: (answers) => getAlertSpecialNeedsProgramCondition(answers),
        }),

        buildAlertMessageField({
          id: 'alertAddThirdSelection',
          alertType: 'info',
          title: school.thirdSelection.addAlertTitle,
          message: school.thirdSelection.addAlertDescription,
          condition: (answers) =>
            getAlertMessageAddThirdSelectionCondition(answers),
        }),
      ],
    }),
  ],
})
