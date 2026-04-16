import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildHiddenInput,
  getValueViaPath,
  buildAccordionField,
  buildSelectField,
  buildTextField,
  buildCheckboxField,
  buildRadioField,
  buildBankAccountField,
  buildAlertMessageField,
  YES,
  NO,
  coreMessages,
  buildFieldsRepeaterField,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { Locale } from '@island.is/shared/types'
import {
  getOtherAddressDefault,
  getOtherPostcodeDefault,
  getPasswordDefault,
  getBankAccountDefault,
  getDefaultJobWishes,
  getDefaultDrivingLicenses,
  getDefaultEures,
  getDefaultEducation,
  getDefaultLanguages,
} from '../../utils/defaultValues'
import {
  getPostcodeOptions,
  getDrivingLicenseOptions,
  getHeavyMachineryOptions,
  getLanguageOptions,
  getLanguageAbilityOptions,
} from '../../utils/selectOptions'
import { getSortedJobCodes } from '../../utils/getJobCodeOptions'
import {
  getLevelsOfStudyOptions,
  getDegreeOptions,
  getCourseOfStudy,
  getYearOptions,
} from '../../utils/educationInformation'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildMultiField({
      id: 'mainMultiField',
      children: [
        buildDescriptionField({
          id: 'mainFormTitle',
          title: applicationMessages.pageTitle,
          description: applicationMessages.pageDescription,
          marginBottom: 'gutter',
        }),
        buildAccordionField({
          id: 'mainFormAccordion',
          title: '',
          accordionItems: [
            // 1. Address
            {
              itemTitle: applicationMessages.addressTitle,
              itemContent: applicationMessages.addressDescription,
              children: [
                buildCheckboxField({
                  id: 'otherAddress.useNationalRegistryAddress',
                  options: [
                    {
                      value: YES,
                      label: applicationMessages.addressCheckbox,
                    },
                  ],
                  condition: (formValue) =>
                    getValueViaPath<boolean>(
                      formValue,
                      'otherAddress.currentAddressIsDifferent',
                    ) === true,
                  width: 'full',
                  defaultValue: (application: Application) =>
                    getValueViaPath<boolean>(
                      application.externalData,
                      'currentApplicationInformation.data.currentApplication.useNationalRegistryAddress',
                    ) === true
                      ? [YES]
                      : [],
                }),
                buildTextField({
                  id: 'otherAddress.otherAddress',
                  title: applicationMessages.addressLabel,
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    getOtherAddressDefault(application.externalData),
                  width: 'half',
                }),
                buildSelectField({
                  id: 'otherAddress.otherPostcode',
                  title: applicationMessages.postCodeLabel,
                  options: (application) =>
                    getPostcodeOptions(application.externalData),
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    getOtherPostcodeDefault(application.externalData),
                  width: 'half',
                }),
              ],
            },
            // 2. Password
            {
              itemTitle: applicationMessages.passwordTitle,
              itemContent: applicationMessages.passwordDescription,
              children: [
                buildTextField({
                  id: 'password',
                  title: applicationMessages.passwordLabel,
                  defaultValue: (application: Application) =>
                    getPasswordDefault(application.externalData),
                  maxLength: 10,
                  backgroundColor: 'blue',
                }),
              ],
            },
            // 3. Bank Account
            {
              itemTitle: applicationMessages.accountTitle,
              children: [
                buildBankAccountField({
                  id: 'bankAccount',
                  title: applicationMessages.accountTitle,
                  defaultValue: (application: Application) =>
                    getBankAccountDefault(application.externalData),
                }),
              ],
            },
            // 4. Job Wishes
            {
              itemTitle: applicationMessages.jobWishesTitle,
              itemContent: applicationMessages.jobWishesDescription,
              children: [
                buildSelectField({
                  id: 'jobWishes',
                  title: applicationMessages.jobWishesLabel,
                  options: (application, _field, locale) => {
                    const sorted = getSortedJobCodes(
                      application.externalData,
                      locale as Locale,
                    )
                    return sorted.map((job) => ({
                      value: job.id ?? '',
                      label:
                        (locale === 'is'
                          ? job.name
                          : job.english ?? job.name) || '',
                    }))
                  },
                  isMulti: true,
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    getDefaultJobWishes(application.externalData),
                }),
              ],
            },
            // 5. Education
            {
              itemTitle: applicationMessages.educationTitle,
              itemContent: applicationMessages.educationDescription,
              children: [
                buildFieldsRepeaterField({
                  id: 'educationHistory',
                  title: '',
                  formTitle: applicationMessages.educationRepeaterLabel,
                  formTitleNumbering: 'suffix',
                  addItemButtonText: applicationMessages.addNewEducation,
                  minRows: (_answers, externalData) =>
                    getDefaultEducation(externalData).length,
                  defaultValue: (application: Application) =>
                    getDefaultEducation(application.externalData),
                  fields: {
                    levelOfStudy: {
                      component: 'select',
                      label: applicationMessages.educationLevelOfStudyLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.levelOfStudy ?? ''
                      },
                      options: (application, _activeField, locale) =>
                        getLevelsOfStudyOptions(
                          application,
                          (locale ?? 'is') as Locale,
                        ),
                    },
                    degree: {
                      component: 'select',
                      label: applicationMessages.educationDegreeLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.degree ?? ''
                      },
                      options: (application, activeField, locale) =>
                        getDegreeOptions(
                          application,
                          (locale ?? 'is') as Locale,
                          activeField?.levelOfStudy ?? '',
                        ),
                    },
                    courseOfStudy: {
                      component: 'select',
                      label: applicationMessages.educationCourseOfStudyLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.courseOfStudy ?? ''
                      },
                      options: (application, activeField, locale) =>
                        getCourseOfStudy(
                          application,
                          activeField?.levelOfStudy ?? '',
                          activeField?.degree ?? '',
                          (locale ?? 'is') as Locale,
                        ),
                    },
                    endDate: {
                      component: 'select',
                      label: applicationMessages.educationEndLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultEducation(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.endDate ?? ''
                      },
                      options: () => getYearOptions(),
                    },
                  },
                }),
              ],
            },
            // 6. Driving & Machinery Licenses
            {
              itemTitle: applicationMessages.driversLicenseTitle,
              children: [
                buildCheckboxField({
                  id: 'licenses.hasDrivingLicense',
                  title: '',
                  options: [
                    {
                      value: YES,
                      label: applicationMessages.driversLicenseCheckbox,
                    },
                  ],
                }),
                buildDescriptionField({
                  id: 'licenses.drivingLicenseDescription',
                  title: applicationMessages.driversLicenseDescription,
                  titleVariant: 'h5',
                  condition: (answers) => {
                    const val = getValueViaPath<string[]>(
                      answers,
                      'licenses.hasDrivingLicense',
                      [],
                    )
                    return Array.isArray(val) && val.includes(YES)
                  },
                }),
                buildCheckboxField({
                  id: 'licenses.drivingLicenseTypes',
                  title: '',
                  options: (application) =>
                    getDrivingLicenseOptions(application.externalData),
                  large: true,
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    getDefaultDrivingLicenses(application.externalData),
                  condition: (answers) => {
                    const val = getValueViaPath<string[]>(
                      answers,
                      'licenses.hasDrivingLicense',
                      [],
                    )
                    return Array.isArray(val) && val.includes(YES)
                  },
                }),
                buildCheckboxField({
                  id: 'licenses.hasHeavyMachineryLicense',
                  title: '',
                  options: [
                    {
                      value: YES,
                      label: applicationMessages.workMachineCheckbox,
                    },
                  ],
                }),
                buildSelectField({
                  id: 'licenses.heavyMachineryLicensesTypes',
                  title: applicationMessages.workMachineTitle,
                  options: (application, _field, locale) =>
                    getHeavyMachineryOptions(
                      application.externalData,
                      locale as Locale,
                    ),
                  isMulti: true,
                  backgroundColor: 'blue',
                  condition: (answers) => {
                    const val = getValueViaPath<string[]>(
                      answers,
                      'licenses.hasHeavyMachineryLicense',
                      [],
                    )
                    return Array.isArray(val) && val.includes(YES)
                  },
                }),
              ],
            },
            // 7. Languages
            {
              itemTitle: applicationMessages.languageTitle,
              children: [
                buildFieldsRepeaterField({
                  id: 'languageSkills',
                  title: '',
                  formTitle: applicationMessages.languageTitle,
                  formTitleNumbering: 'suffix',
                  addItemButtonText: applicationMessages.addLanguageLabel,
                  minRows: (_answers, externalData) =>
                    getDefaultLanguages(externalData).length,
                  defaultValue: (application: Application) =>
                    getDefaultLanguages(application.externalData),
                  fields: {
                    language: {
                      component: 'select',
                      label: applicationMessages.languageNameLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultLanguages(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultLanguages(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.language ?? ''
                      },
                      options: (application, _activeField, locale) =>
                        getLanguageOptions(
                          application.externalData,
                          (locale ?? 'is') as Locale,
                        ),
                    },
                    skill: {
                      component: 'select',
                      label: applicationMessages.languageAbilityLabel,
                      width: 'half',
                      backgroundColor: 'blue',
                      readonly: (application, _activeField, index) => {
                        const defaults = getDefaultLanguages(
                          application.externalData,
                        )
                        return (index ?? 0) < defaults.length
                      },
                      defaultValue: (
                        application: Application,
                        _activeField: unknown,
                        index?: number,
                      ) => {
                        const defaults = getDefaultLanguages(
                          application.externalData,
                        )
                        return defaults[index ?? 0]?.skill ?? ''
                      },
                      options: (application, _activeField, locale) =>
                        getLanguageAbilityOptions(
                          application.externalData,
                          (locale ?? 'is') as Locale,
                        ),
                    },
                  },
                }),
              ],
            },
            // 8. EURES
            {
              itemTitle: applicationMessages.euresTitle,
              itemContent: applicationMessages.euresDescription,
              children: [
                buildRadioField({
                  id: 'euresAgreement',
                  title: '',
                  options: [
                    { value: YES, label: coreMessages.radioYes },
                    { value: NO, label: coreMessages.radioNo },
                  ],
                  defaultValue: (application: Application) =>
                    getDefaultEures(application.externalData),
                  space: 'gutter',
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'euresInfo',
                  title: '',
                  message: applicationMessages.euresInfoBox,
                  alertType: 'info',
                }),
              ],
            },
          ],
        }),
        buildHiddenInput({
          id: 'otherAddress.currentAddressIsDifferent',
          defaultValue: (application: Application) => {
            const currentAddressIsDifferent = getValueViaPath<boolean>(
              application.externalData,
              'currentApplicationInformation.data.currentApplication.currentAddressIsDifferent',
            )
            return currentAddressIsDifferent === true ? 'true' : 'false'
          },
        }),

        buildCustomField({
          id: 'bankAccountValidation',
          component: 'BankAccountValidation',
        }),
        buildSubmitField({
          id: 'submit',
          title: applicationMessages.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: applicationMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
