import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildAccordionField,
  buildCheckboxField,
  buildTextField,
  buildSelectField,
  buildBankAccountField,
  buildTableRepeaterField,
  getValueViaPath,
  buildRadioField,
  coreMessages,
  NO,
  YES,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
// import { application as applicationMessages } from '../../lib/messages'
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
  getDefaultDrivingLicenses,
  getDefaultEducation,
  getDefaultLanguages,
} from '../../utils/defaultValues'
import type { GaldurDomainModelsEducationProgramDTO } from '@island.is/clients/vmst-unemployment'

const EDUCATION_PATH =
  'currentApplicationInformation.data.supportData.education'

const findDegreeLabel = (application: Application, value: string): string => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      application.externalData,
      EDUCATION_PATH,
    ) ?? []
  for (const program of education) {
    const match = program.degrees?.find((d) => d.id === value)
    if (match) return match.name ?? value
  }
  return value
}

const findCourseLabel = (application: Application, value: string): string => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      application.externalData,
      EDUCATION_PATH,
    ) ?? []
  for (const program of education) {
    for (const degree of program.degrees ?? []) {
      const match = degree.subjects?.find((s) => s.id === value)
      if (match) return match.name ?? value
    }
  }
  return value
}

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
          // title: m.application.pageTitle,
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
                }),
                buildTextField({
                  condition: (answers) => {
                    const val = (answers as Record<string, unknown>)
                      .otherAddress as
                      | { currentAddressIsNotDifferent?: string[] }
                      | undefined
                    return !val?.currentAddressIsNotDifferent?.includes('yes')
                  },
                  id: 'otherAddress.otherAddress',
                  title: m.application.addressLabel,
                  width: 'half',
                }),
                buildSelectField({
                  condition: (answers) => {
                    const val = (answers as Record<string, unknown>)
                      .otherAddress as
                      | { currentAddressIsNotDifferent?: string[] }
                      | undefined
                    return !val?.currentAddressIsNotDifferent?.includes('yes')
                  },
                  id: 'otherAddress.otherPostcode',
                  title: m.application.postCodeLabel,
                  width: 'half',
                  options: (application) => {
                    return getPostcodeOptions(application.externalData)
                  },
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
                }),
              ],
            },
            {
              itemTitle: m.application.accountTitle,
              children: [
                buildBankAccountField({
                  id: 'bankAccount',
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
                  getStaticTableData: (application) => {
                    const defaults = getDefaultEducation(
                      application.externalData,
                    )
                    const levels = getLevelsOfStudyOptions(
                      application,
                      'is' as Locale,
                    )
                    return defaults.map((edu) => ({
                      levelOfStudy:
                        levels.find((o) => o.value === edu.levelOfStudy)
                          ?.label ?? edu.levelOfStudy,
                      degree:
                        getDegreeOptions(
                          application,
                          'is' as Locale,
                          edu.levelOfStudy,
                        ).find((o) => o.value === edu.degree)?.label ??
                        edu.degree,
                      courseOfStudy:
                        getCourseOfStudy(
                          application,
                          edu.levelOfStudy,
                          edu.degree,
                          'is' as Locale,
                        ).find((o) => o.value === edu.courseOfStudy)?.label ??
                        edu.courseOfStudy,
                      endDate: edu.endDate,
                    }))
                  },
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
                      levelOfStudy: (value, _, application) => {
                        if (!application) return value
                        const opts = getLevelsOfStudyOptions(
                          application,
                          'is' as Locale,
                        )
                        return (
                          opts.find((o) => o.value === value)?.label ?? value
                        )
                      },
                      degree: (value, _, application) => {
                        if (!application) return value
                        return findDegreeLabel(application, value)
                      },
                      courseOfStudy: (value, _, application) => {
                        if (!application) return value
                        return findCourseLabel(application, value)
                      },
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
                  defaultValue: (application: Application) => {
                    const defaults = getDefaultDrivingLicenses(
                      application.externalData,
                    )
                    return defaults.length > 0 ? ['yes'] : []
                  },
                }),
                buildCheckboxField({
                  id: 'licenses.drivingLicenseTypes',
                  description: m.application.driversLicenseDescription,
                  condition: (answers, externalData) => {
                    const val = (answers as Record<string, unknown>)
                      .licenses as { hasDrivingLicense?: string[] } | undefined
                    if (val?.hasDrivingLicense !== undefined) {
                      return val.hasDrivingLicense.includes('yes')
                    }
                    return getDefaultDrivingLicenses(externalData).length > 0
                  },
                  options: (application) =>
                    getDrivingLicenseOptions(application.externalData),
                  defaultValue: (application: Application) =>
                    getDefaultDrivingLicenses(application.externalData),
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
                }),
                buildSelectField({
                  condition: (answers) => {
                    const val = (answers as Record<string, unknown>)
                      .licenses as
                      | { hasHeavyMachineryLicense?: string[] }
                      | undefined
                    return (
                      val?.hasHeavyMachineryLicense?.includes('yes') ?? false
                    )
                  },
                  id: 'licenses.heavyMachineryLicensesTypes',
                  title: m.application.workMachineTitle,
                  options: (application, _field, locale) =>
                    getHeavyMachineryOptions(application.externalData, locale),
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
                  getStaticTableData: (application) => {
                    const defaults = getDefaultLanguages(
                      application.externalData,
                    )
                    const langs = getLanguageOptions(
                      application.externalData,
                      'is' as Locale,
                    )
                    const abilities = getLanguageAbilityOptions(
                      application.externalData,
                      'is' as Locale,
                    )
                    return defaults.map((lang) => ({
                      language:
                        langs.find((o) => o.value === lang.language)?.label ??
                        lang.language,
                      skill:
                        abilities.find((o) => o.value === lang.skill)?.label ??
                        lang.skill,
                    }))
                  },
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
                      language: (value, _, application) => {
                        if (!application) return value
                        const opts = getLanguageOptions(
                          application.externalData,
                          'is' as Locale,
                        )
                        return (
                          opts.find((o) => o.value === value)?.label ?? value
                        )
                      },
                      skill: (value, _, application) => {
                        if (!application) return value
                        const opts = getLanguageAbilityOptions(
                          application.externalData,
                          'is' as Locale,
                        )
                        return (
                          opts.find((o) => o.value === value)?.label ?? value
                        )
                      },
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
