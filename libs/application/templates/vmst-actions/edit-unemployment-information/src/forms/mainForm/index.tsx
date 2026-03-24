import {
  buildDescriptionField,
  buildForm,
  buildTextField,
  buildSelectField,
  getValueViaPath,
  buildBankAccountField,
  buildFieldsRepeaterField,
  buildCheckboxField,
  buildRadioField,
  buildAlertMessageField,
  coreMessages,
  YES,
  NO,
  buildMultiField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'
import { GaldurDomainModelsSettingsPostcodesPostcodeDTO } from '@island.is/clients/vmst-unemployment'
import { Application } from '@island.is/application/types'
import { getSortedJobCodes } from '../../utils/getJobCodeOptions'
import { getRskOptions } from '../../utils/getRskOptions'
import {
  getDegreeOptions,
  getCourseOfStudy,
  getLevelsOfStudyOptions,
  getYearOptions,
} from '../../utils/educationInformation'
import {
  A,
  A1,
  A2,
  AM,
  B,
  BE,
  C,
  C1,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
} from '../../assets/drivingLicenses'
import {
  GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO,
  GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO,
  GaldurDomainModelsSelectItem,
} from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      children: [
        buildDescriptionField({
          id: 'addressInformation',
          title: applicationMessages.addressTitle,
          description: applicationMessages.addressDescription,
        }),
        buildTextField({
          id: 'applicant.otherAddress',
          title: applicationMessages.addressLabel,
          width: 'half',
        }),
        buildSelectField({
          id: 'applicant.otherPostcode',
          title: applicationMessages.postCodeLabel,
          width: 'half',
          //TODO default Value -> this will be a problem
          options: (application) => {
            const nameAndPostcode = getValueViaPath<
              GaldurDomainModelsSettingsPostcodesPostcodeDTO[]
            >(
              application.externalData,
              'currentApplicationInformation.data.supportData.postCodes', // TODO get this from the right place
            )
            return (
              nameAndPostcode
                ?.filter(
                  ({ nameAndCode }) => nameAndCode && nameAndCode.length > 0,
                )
                .map(({ nameAndCode, id }) => {
                  return {
                    label: nameAndCode ?? '',
                    value: id || '',
                  }
                }) ?? []
            )
          },
        }),

        buildDescriptionField({
          id: 'passwordInformation',
          title: applicationMessages.passwordTitle,
          description: applicationMessages.passwordDescription,
        }),
        buildTextField({
          id: 'applicant.password',
          title: applicationMessages.passwordLabel,
          maxLength: 10,
          minLength: 4,
          defaultValue: (application: Application) => {
            return (
              getValueViaPath<string>(
                application.externalData,
                'currentApplicationInformation.data.currentApplication.passCode', // TODO get this from the right place
              ) ?? ''
            )
          },
        }),

        buildBankAccountField({
          id: 'payout.bankAccount',
          title: applicationMessages.accountTitle,
          titleVariant: 'h5',
          defaultValue: (application: Application) => {
            const bankInfo = getValueViaPath<string>(
              application.externalData,
              'currentApplicationInformation.data.currentApplication.data.bankAccount', // TODO get this from the right place
              '',
            )
            return bankInfo
          },
        }),

        buildDescriptionField({
          id: 'jobWishesInformation',
          title: applicationMessages.jobWishesTitle,
          description: applicationMessages.jobWishesDescription,
        }),
        buildSelectField({
          id: 'jobWishes.jobList',
          title: applicationMessages.jobWishesLabel,
          isMulti: true,
          options: (application, _, locale) => {
            const sorted = getSortedJobCodes(application.externalData, locale)

            return sorted.map((job) => ({
              value: job.id ?? '',
              label:
                (locale === 'is' ? job.name : job.english ?? job.name) || '',
            }))
          },
        }),

        buildDescriptionField({
          id: 'educationInformation',
          title: applicationMessages.educationTitle,
          description: applicationMessages.educationDescription,
        }),
        buildFieldsRepeaterField({
          id: 'educationHistory.educationHistory',
          formTitle: applicationMessages.educationTitle,
          formTitleNumbering: 'none',
          minRows: 0,
          addItemButtonText: applicationMessages.addNewEducation,
          fields: {
            levelOfStudy: {
              label: applicationMessages.educationLevelOfStudyLabel,
              component: 'select',
              required: true,
              options: (application, _, locale) => {
                locale = locale ? locale : 'is'
                return getLevelsOfStudyOptions(application, locale)
              },
            },
            degree: {
              label: applicationMessages.educationDegreeLabel,
              component: 'select',
              required: true,
              options: (application, activeField, locale) => {
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                locale = locale ? locale : 'is'
                return getDegreeOptions(application, locale, levelOfStudy)
              },
            },
            courseOfStudy: {
              label: applicationMessages.educationCourseOfStudyLabel,
              component: 'select',
              required: true,
              options: (application, activeField, locale) => {
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const degreeAnswer = (activeField?.degree as string) ?? ''

                locale = locale ? locale : 'is'
                return getCourseOfStudy(
                  application,
                  levelOfStudy,
                  degreeAnswer,
                  locale,
                )
              },
            },
            endDate: {
              label: applicationMessages.educationEndLabel,
              component: 'select',
              placeholder: applicationMessages.educationEndLabel,
              options: getYearOptions,
            },
          },
        }),
        buildDescriptionField({
          id: 'employmentInformation',
          title: applicationMessages.employmentTitle,
          description: applicationMessages.employmentDescription,
        }),
        buildFieldsRepeaterField({
          id: 'employmentHistory.lastJobs',
          marginTop: 0,
          minRows: 1,
          formTitle: applicationMessages.employmentRepeaterLabel,
          formTitleVariant: 'h5',
          fields: {
            nationalIdWithName: {
              component: 'select',
              required: true,
              label: applicationMessages.employmentCompanyLabel,
              options: (application, _, locale, formatMessage) =>
                getRskOptions(application, formatMessage),
            },
            employer: {
              component: 'nationalIdWithName',
              required: true,
              searchPersons: true,
              searchCompanies: true,
              condition: (_, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-' || activeField === undefined
              },
            },
            jobCodeId: {
              component: 'select',
              label: applicationMessages.employmentJobTitleLabel,
              width: 'half',
              required: true,
              options: (application, _activeField, locale) => {
                const sorted = getSortedJobCodes(
                  application.externalData,
                  locale,
                )

                return sorted.map((job) => ({
                  value: job.id ?? '',
                  label:
                    (locale === 'is' ? job.name : job.english ?? job.name) ||
                    '',
                }))
              },
            },
            percentage: {
              component: 'input',
              label: applicationMessages.employmentPercentageLabel,
              width: 'half',
              type: 'number',
              suffix: '%',
              max: 100,
              allowNegative: false,
              required: true,
            },
            startDate: {
              component: 'date',
              label: applicationMessages.employmentDateFromLabel,
              width: 'half',
              required: true,
              maxDate: (_application, activeField) => {
                const endDateStr = activeField?.endDate
                return (endDateStr && new Date(endDateStr)) || undefined
              },
            },
            endDate: {
              component: 'date',
              required: true,
              label: applicationMessages.employmentDateToLabel,
              width: 'half',
              minDate: (_application, activeField) => {
                const startDateStr = activeField?.startDate
                return (startDateStr && new Date(startDateStr)) || undefined
              },
              maxDate: new Date(),
            },
          },
        }),
        buildDescriptionField({
          id: 'licenseInformation',
          title: applicationMessages.driversLicenseTitle,
        }),
        buildCheckboxField({
          id: 'licenses.hasDrivingLicense',

          options: [
            {
              value: YES,
              label: applicationMessages.driversLicenseCheckbox,
            },
          ],
        }),
        buildCheckboxField({
          id: 'licenses.drivingLicenseTypes',
          title: applicationMessages.driversLicenseDescription,
          spacing: 0,
          required: true,
          options: (application) => {
            const drivingLicenseTypes =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO>
              >(
                application.externalData,
                'currentApplicationInformation.data.supportData.drivingLicenses',
              ) || []
            return drivingLicenseTypes.map((type) => {
              const licenseComponents: Record<string, React.ComponentType> = {
                A,
                A1,
                A2,
                AM,
                B,
                BE,
                C,
                C1,
                C1E,
                CE,
                D,
                D1,
                D1E,
                DE,
              }

              const LicenseIconComponent = type.name
                ? licenseComponents[type.name]
                : undefined
              return {
                value: type.id || '',
                label: type.name || '',
                rightContent: LicenseIconComponent ? (
                  <LicenseIconComponent />
                ) : null,
              }
            })
          },
          condition: (answers) => {
            return (
              getValueViaPath<string[]>(
                answers,
                'licenses.hasDrivingLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
        buildCheckboxField({
          id: 'licenses.hasHeavyMachineryLicense',
          spacing: 0,
          options: [
            {
              value: YES,
              label: applicationMessages.workMachineCheckbox,
            },
          ],
        }),
        buildSelectField({
          id: 'licenses.heavyMachineryLicensesTypes',
          title: 'this?',
          isMulti: true,
          options: (application, _, locale) => {
            const heavyMachineryLicenses =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO>
              >(
                application.externalData,
                'currentApplicationInformation.data.supportData.workMachineRights',
              ) || []
            return heavyMachineryLicenses.map((right) => ({
              value: right.id || '',
              label:
                locale === 'is' && right.name
                  ? right.name
                  : right.english ?? '',
            }))
          },
          condition: (answers) => {
            return (
              getValueViaPath<string[]>(
                answers,
                'licenses.hasHeavyMachineryLicense',
              )?.includes(YES) ?? false
            )
          },
        }),

        buildDescriptionField({
          id: 'languageInformation',
          title: applicationMessages.languageTitle,
          description: applicationMessages.languageDescription,
        }),
        buildFieldsRepeaterField({
          id: 'languageSkills',
          formTitleNumbering: 'none',
          minRows: 0,
          addItemButtonText: applicationMessages.addLanguageLabel,
          fields: {
            language: {
              label: applicationMessages.languageNameLabel,
              component: 'select',
              width: 'half',
              options: (application, _, locale) => {
                const languages =
                  getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
                    application.externalData,
                    'currentApplicationInformation.data.supportData.languages',
                  ) || []
                return languages.map((language) => ({
                  value: language.id || '',
                  label:
                    (locale === 'is' ? language.name : language.english) || '',
                }))
              },
              // defaultValue: (
              //   application: Application,
              //   _activeField: Record<string, string>,
              //   index: number,
              //   locale: Locale,
              // ) => {

              //   return ''
              // },
            },

            skill: {
              label: applicationMessages.languageAbilityLabel,
              component: 'select',
              width: 'half',
              options: (application, _, locale) => {
                const languageSkills =
                  getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
                    application.externalData,
                    'currentApplicationInformation.data.supportData.languageAbilities',
                  ) || []
                return languageSkills.map((skill) => ({
                  value: skill.id || '',
                  label:
                    (locale === 'is'
                      ? skill.name
                      : skill.english ?? skill.name) || '',
                }))
              },
            },
          },
        }),

        buildDescriptionField({
          id: 'euresInformation',
          title: applicationMessages.euresTitle,
          description: applicationMessages.euresDescription,
        }),
        buildRadioField({
          id: 'euresJobSearch.agreement',
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'euresJobSearchAgreementAlert',
          message: applicationMessages.euresInfoBox,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
