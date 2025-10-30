import {
  YES,
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import {
  fileUploadSharedProps,
  maritalStatuses,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getBankIsk,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import * as kennitala from 'kennitala'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailableMonths,
  getAvailableYears,
  isExistsCohabitantBetween18and25,
  isExistsCohabitantOlderThan25,
} from '../lib/householdSupplementUtils'
import { householdSupplementFormMessage } from '../lib/messages'

export const HouseholdSupplementForm: Form = buildForm({
  id: 'HouseholdSupplementDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'infoSection',
      title: socialInsuranceAdministrationMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title:
                socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
              description:
                socialInsuranceAdministrationMessage.info
                  .infoSubSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.name',
                  title: socialInsuranceAdministrationMessage.confirm.name,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const { applicantName } = getApplicationExternalData(
                      application.externalData,
                    )
                    return applicantName
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.ID',
                  title:
                    socialInsuranceAdministrationMessage.confirm.nationalId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    kennitala.format(application.applicant),
                }),
                buildTextField({
                  id: 'applicantInfo.address',
                  title:
                    socialInsuranceAdministrationMessage.info.applicantAddress,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const { applicantAddress } = getApplicationExternalData(
                      application.externalData,
                    )
                    return applicantAddress
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.postcode',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantPostalcode,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const { applicantPostalCode } = getApplicationExternalData(
                      application.externalData,
                    )
                    return applicantPostalCode
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.municipality',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantMunicipality,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const { applicantLocality } = getApplicationExternalData(
                      application.externalData,
                    )
                    return applicantLocality
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.email',
                  title:
                    socialInsuranceAdministrationMessage.info.applicantEmail,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const { userProfileEmail } = getApplicationExternalData(
                      application.externalData,
                    )
                    return userProfileEmail
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantPhonenumber,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { userProfilePhoneNumber } =
                      getApplicationExternalData(application.externalData) || ''

                    return userProfilePhoneNumber
                  },
                }),
                buildDescriptionField({
                  id: 'applicantInfo.descriptionField',
                  space: 'containerGutter',
                  titleVariant: 'h5',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantMaritalTitle,
                  condition: (_, externalData) => {
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)

                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.maritalStatus',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantMaritalStatus,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouseV3
                    return maritalStatuses[data.maritalStatus]
                  },
                  condition: (_, externalData) => {
                    const { maritalStatus } =
                      getApplicationExternalData(externalData)
                    if (maritalStatus) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseName',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantSpouseName,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouseV3
                    return data.name
                  },
                  condition: (_, externalData) => {
                    const { spouseName } =
                      getApplicationExternalData(externalData)
                    if (spouseName) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseID',
                  title:
                    socialInsuranceAdministrationMessage.confirm.nationalId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouseV3
                    return kennitala.format(data.nationalId)
                  },
                  condition: (_, externalData) => {
                    const { spouseNationalId } =
                      getApplicationExternalData(externalData)
                    if (spouseNationalId) return true
                    return false
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: socialInsuranceAdministrationMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: socialInsuranceAdministrationMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message:
                    socialInsuranceAdministrationMessage.payment.alertMessage,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: socialInsuranceAdministrationMessage.payment.bank,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return getBankIsk(bankInfo)
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'householdSupplementSection',
      title: householdSupplementFormMessage.shared.householdSupplement,
      condition: (_, externalData) => {
        return isExistsCohabitantBetween18and25(externalData)
      },
      children: [
        buildMultiField({
          id: 'householdSupplement',
          title: householdSupplementFormMessage.shared.householdSupplement,
          description:
            householdSupplementFormMessage.info.householdSupplementDescription,
          children: [
            buildAlertMessageField({
              id: 'householdSupplement.alert',
              title:
                householdSupplementFormMessage.info
                  .householdSupplementAlertTitle,
              message:
                householdSupplementFormMessage.info
                  .householdSupplementAlertDescription,
              doesNotRequireAnswer: true,
              alertType: 'warning',
              condition: (_, externalData) => {
                return isExistsCohabitantOlderThan25(externalData)
              },
            }),
            buildRadioField({
              id: 'householdSupplement.children',
              title:
                householdSupplementFormMessage.info
                  .householdSupplementChildrenBetween18And25,
              options: getYesNoOptions(),
              width: 'half',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'periodSection',
      title: socialInsuranceAdministrationMessage.period.overviewTitle,
      children: [
        buildMultiField({
          id: 'periodField',
          title: socialInsuranceAdministrationMessage.period.title,
          description: householdSupplementFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: socialInsuranceAdministrationMessage.period.year,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.yearDefaultText,
              options: getAvailableYears(),
            }),
            buildSelectField({
              id: 'period.month',
              title: socialInsuranceAdministrationMessage.period.month,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.monthDefaultText,
              options: (application: Application) => {
                const { selectedYear } = getApplicationAnswers(
                  application.answers,
                )

                return getAvailableMonths(selectedYear)
              },
              condition: (answers) => {
                const { selectedYear, selectedYearHiddenInput } =
                  getApplicationAnswers(answers)

                return selectedYear === selectedYearHiddenInput
              },
            }),
            buildHiddenInputWithWatchedValue({
              // Needed to trigger an update on options in the select above
              id: 'period.hiddenInput',
              watchValue: 'period.year',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fileUpload',
      title: socialInsuranceAdministrationMessage.fileUpload.title,
      condition: (answers) => {
        const { householdSupplementChildren } = getApplicationAnswers(answers)
        return householdSupplementChildren === YES
      },
      children: [
        buildSubSection({
          id: 'fileUploadSchoolConfirmation',
          title:
            householdSupplementFormMessage.fileUpload.schoolConfirmationTitle,
          condition: (answers) => {
            const { householdSupplementChildren } =
              getApplicationAnswers(answers)
            return householdSupplementChildren === YES
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.schoolConfirmation',
              title:
                householdSupplementFormMessage.fileUpload
                  .schoolConfirmationTitle,
              description:
                householdSupplementFormMessage.fileUpload.schoolConfirmation,
              introduction:
                householdSupplementFormMessage.fileUpload.schoolConfirmation,
              ...fileUploadSharedProps,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: socialInsuranceAdministrationMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'commentSection',
          title:
            socialInsuranceAdministrationMessage.additionalInfo.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentSection,
              variant: 'textarea',
              rows: 10,
              description:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentDescription,
              placeholder:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentPlaceholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'confirm',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'confirmScreen',
                title: '',
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: socialInsuranceAdministrationMessage.confirm.submitButton,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      multiFieldTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.receivedTitle,
      alertTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.alertTitle,
      alertMessage:
        householdSupplementFormMessage.conclusionScreen.alertMessage,
      expandableDescription:
        householdSupplementFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        householdSupplementFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
