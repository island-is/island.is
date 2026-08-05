import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildAccordionField,
  buildCheckboxField,
  buildTextField,
  buildSelectField,
  buildBankAccountField,
  buildTableRepeaterField,
  buildRadioField,
  coreMessages,
  NO,
  YES,
  buildAlertMessageField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import * as m from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import {
  getPostcodeOptions,
  getDrivingLicenseOptions,
  getHeavyMachineryOptions,
  getLanguageOptions,
  getLanguageAbilityOptions,
} from '../../utils/selectOptions'
import { getJobCodeOptions } from '../../utils/getJobCodeOptions'
import {
  getLevelsOfStudyOptions,
  getDegreeOptions,
  getCourseOfStudy,
  getYearOptions,
} from '../../utils/educationInformation'
import {
  showOtherAddress,
  showDrivingLicenseTypes,
  showHeavyMachineryLicenseTypes,
} from '../../utils/conditions'
import {
  getEducationStaticTableData,
  formatLevelOfStudy,
  formatDegree,
  formatCourseOfStudy,
  getLanguageStaticTableData,
  formatLanguage,
  formatLanguageSkill,
} from '../../utils/tableHelpers'
import {
  getOtherAddressDefault,
  getCurrentAddressIsNotDifferentDefault,
  getOtherPostcodeDefault,
  getPasswordDefault,
  getBankAccountDefault,
  getDefaultJobWishes,
  getDefaultHeavyMachineryLicenses,
  getDefaultEures,
  getDefaultHasDrivingLicense,
  getDefaultDrivingLicenses,
  getDefaultHasHeavyMachineryLicense,
} from '../../utils/defaultValues'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  title: m.application.pageTitle,
  children: [
    buildMultiField({
      id: 'mainMultiField',
      children: [
        buildDescriptionField({
          id: 'mainFormTitle',
          title: m.application.pageTitle,
          description: m.application.pageDescription,
        }),
        buildAccordionField({
          id: 'mainFormAccordion',
          marginTop: 4,
          accordionItems: [
            {
              itemTitle: m.application.addressTitle,
              children: [
                buildCheckboxField({
                  id: 'otherAddress.currentAddressIsNotDifferent',
                  description: m.application.addressDescription,
                  options: [
                    {
                      value: 'yes',
                      label: m.application.addressIsSameAsNationalRegistry,
                    },
                  ],
                  defaultValue: getCurrentAddressIsNotDifferentDefault,
                }),
                buildTextField({
                  condition: showOtherAddress,
                  id: 'otherAddress.otherAddress',
                  title: m.application.addressLabel,
                  width: 'half',
                  defaultValue: getOtherAddressDefault,
                }),
                buildSelectField({
                  condition: showOtherAddress,
                  id: 'otherAddress.otherPostcode',
                  title: m.application.postCodeLabel,
                  width: 'half',
                  options: (application) => {
                    return getPostcodeOptions(application.externalData)
                  },
                  defaultValue: getOtherPostcodeDefault,
                }),
              ],
            },
            {
              itemTitle: m.application.passwordTitle,
              children: [
                buildTextField({
                  id: 'password',
                  title: m.application.passwordLabel,
                  description: m.application.passwordDescription,
                  defaultValue: getPasswordDefault,
                }),
              ],
            },
            {
              itemTitle: m.application.accountTitle,
              children: [
                buildBankAccountField({
                  id: 'bankAccount',
                  defaultValue: getBankAccountDefault,
                }),
              ],
            },
            {
              itemTitle: m.application.jobWishesTitle,
              children: [
                buildSelectField({
                  id: 'jobWishes',
                  title: m.application.jobWishesLabel,
                  description: m.application.jobWishesDescription,
                  options: (application, _field, locale) => {
                    return getJobCodeOptions(application.externalData, locale)
                  },
                  isMulti: true,
                  defaultValue: getDefaultJobWishes,
                }),
              ],
            },
            {
              itemTitle: m.application.educationTitle,
              itemContent: m.application.educationDescription,
              children: [
                buildTableRepeaterField({
                  id: 'educationHistory',
                  title: '',
                  formTitle: m.application.educationRepeaterLabel,
                  addItemButtonText: m.application.addNewEducation,
                  saveItemButtonText: m.application.addNewEducation,
                  editField: true,
                  getStaticTableData: getEducationStaticTableData,
                  fields: {
                    levelOfStudy: {
                      component: 'select',
                      label: m.application.educationLevelOfStudyLabel,
                      width: 'half',
                      options: (application, _activeValues, lang) =>
                        getLevelsOfStudyOptions(application, lang as Locale),
                    },
                    degree: {
                      component: 'select',
                      label: m.application.educationDegreeLabel,
                      width: 'half',
                      options: (application, activeValues, lang) =>
                        getDegreeOptions(
                          application,
                          lang as Locale,
                          activeValues?.levelOfStudy ?? '',
                        ),
                      clearOnChange: ['levelOfStudy'],
                    },
                    courseOfStudy: {
                      component: 'select',
                      label: m.application.educationCourseOfStudyLabel,
                      width: 'half',
                      options: (application, activeValues, lang) =>
                        getCourseOfStudy(
                          application,
                          activeValues?.levelOfStudy ?? '',
                          activeValues?.degree ?? '',
                          lang as Locale,
                        ),
                      clearOnChange: ['levelOfStudy', 'degree'],
                    },
                    endDate: {
                      component: 'select',
                      label: m.application.educationEndLabel,
                      width: 'half',
                      options: () => getYearOptions(),
                    },
                  },
                  table: {
                    header: [
                      m.application.educationLevelOfStudyLabel,
                      m.application.educationDegreeLabel,
                      m.application.educationCourseOfStudyLabel,
                      m.application.educationEndLabel,
                    ],
                    rows: [
                      'levelOfStudy',
                      'degree',
                      'courseOfStudy',
                      'endDate',
                    ],
                    format: {
                      levelOfStudy: formatLevelOfStudy,
                      degree: formatDegree,
                      courseOfStudy: formatCourseOfStudy,
                    },
                  },
                }),
              ],
            },
            {
              itemTitle: m.application.driversLicenseTitle,
              children: [
                buildCheckboxField({
                  id: 'licenses.hasDrivingLicense',
                  large: false,
                  backgroundColor: 'white',
                  options: [
                    {
                      value: 'yes',
                      label: m.application.driversLicenseCheckbox,
                    },
                  ],
                  defaultValue: getDefaultHasDrivingLicense,
                }),
                buildCheckboxField({
                  id: 'licenses.drivingLicenseTypes',
                  description: m.application.driversLicenseDescription,
                  condition: showDrivingLicenseTypes,
                  options: (application) =>
                    getDrivingLicenseOptions(application.externalData),
                  defaultValue: getDefaultDrivingLicenses,
                  large: true,
                }),
                buildCheckboxField({
                  id: 'licenses.hasHeavyMachineryLicense',
                  large: false,
                  backgroundColor: 'white',
                  options: [
                    {
                      value: 'yes',
                      label: m.application.workMachineCheckbox,
                    },
                  ],
                  defaultValue: getDefaultHasHeavyMachineryLicense,
                }),
                buildSelectField({
                  condition: showHeavyMachineryLicenseTypes,
                  id: 'licenses.heavyMachineryLicensesTypes',
                  title: m.application.workMachineTitle,
                  isMulti: true,
                  options: (application, _field, locale) =>
                    getHeavyMachineryOptions(application.externalData, locale),
                  defaultValue: getDefaultHeavyMachineryLicenses,
                }),
              ],
            },
            {
              itemTitle: m.application.languageTitle,
              children: [
                buildTableRepeaterField({
                  id: 'languageSkills',
                  title: '',
                  formTitle: m.application.languageRepeaterLabel,
                  addItemButtonText: m.application.addLanguageLabel,
                  saveItemButtonText: m.application.addLanguageLabel,
                  editField: true,
                  getStaticTableData: getLanguageStaticTableData,
                  fields: {
                    language: {
                      component: 'select',
                      label: m.application.languageNameLabel,
                      width: 'half',
                      options: (application, _activeValues, lang) =>
                        getLanguageOptions(
                          application.externalData,
                          lang as Locale,
                        ),
                    },
                    skill: {
                      component: 'select',
                      label: m.application.languageAbilityLabel,
                      width: 'half',
                      options: (application, _activeValues, lang) =>
                        getLanguageAbilityOptions(
                          application.externalData,
                          lang as Locale,
                        ),
                    },
                  },
                  table: {
                    header: [
                      m.application.languageNameLabel,
                      m.application.languageAbilityLabel,
                    ],
                    rows: ['language', 'skill'],
                    format: {
                      language: formatLanguage,
                      skill: formatLanguageSkill,
                    },
                  },
                }),
              ],
            },
            {
              itemTitle: m.application.euresTitle,
              children: [
                buildRadioField({
                  id: 'euresAgreement',
                  description: m.application.euresDescription,
                  width: 'half',
                  options: [
                    { value: YES, label: coreMessages.radioYes },
                    { value: NO, label: coreMessages.radioNo },
                  ],
                  defaultValue: getDefaultEures,
                }),
                buildAlertMessageField({
                  id: 'eures.alertMessage',
                  message: m.application.euresInfoBox,
                  alertType: 'info',
                }),
              ],
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          title: m.application.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.application.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
