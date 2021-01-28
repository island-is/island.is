import {
  buildCustomField,
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Comparators,
  Application,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'
import { YES, NO } from '../constants'
import { StatusTypes } from '../types'
import Logo from '../assets/Logo'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.applicantInfoSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'healthInsurance',
              type: 'HealthInsuranceProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'oldPendingApplications',
              type: 'OldPendingApplications',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'directorateOfLabor',
              type: undefined,
              title: m.directorateOfLaborTitle,
              subTitle: m.directorateOfLaborSubTitle,
            }),
            buildDataProviderItem({
              id: 'internalRevenue',
              type: undefined,
              title: m.internalRevenueTitle,
              subTitle: m.internalRevenueSubTitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'confirmationOfResidency',
          title: m.confirmationOfResidencyTitle,
          description: m.confirmationOfResidencyDescription,
          children: [
            buildCustomField({
              id: 'errorModal',
              component: 'ErrorModal',
              title: '',
            }),
            buildFileUploadField({
              id: 'confirmationOfResidencyDocument',
              title: '',
              introduction: m.confirmationOfResidencyFileUpload,
              uploadHeader: m.fileUploadHeader.defaultMessage,
              uploadDescription: m.fileUploadDescription.defaultMessage,
            }),
          ],
          condition: (formValue: FormValue, externalData) => {
            // TODO: when it is possible in NationalRegistry api, check if country is Greenland or Faroe Islands
            return true
          },
        }),
        buildMultiField({
          id: 'contactInfoSection',
          title: m.contactInfoTitle,
          children: [
            buildCustomField({
              id: 'errorModal',
              component: 'ErrorModal',
              title: '',
              condition: (formValue: FormValue, externalData) => {
                // TODO: when it is possible in NationalRegistry api, check if country is Greenland or Faroe Islands
                // It should return true if confirmation of residency condition is returned as false...
                return false
              },
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  nationalId?: string
                })?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  streetAddress?: string
                })?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: m.postalCode,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  postalCode?: string
                })?.postalCode,
            }),
            buildTextField({
              id: 'applicant.city',
              title: m.city,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  city?: string
                })?.city,
            }),
            buildTextField({
              id: 'applicant.nationality',
              title: m.nationality,
              width: 'half',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.nationalRegistry?.data as {
                  citizenship?: string
                })?.citizenship,
            }),
            buildDescriptionField({
              id: 'editNationalRegistryData',
              title: '',
              description: m.editNationalRegistryData,
            }),
            buildDividerField({ title: ' ', color: 'transparent' }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              variant: 'email',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
              defaultValue: (application: Application) =>
                (application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                })?.mobilePhoneNumber,
            }),
            buildDescriptionField({
              id: 'editDigitalIslandData',
              title: '',
              description: m.editDigitalIslandData,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'statusAndChildrenSection',
      title: m.statusAndChildren,
      children: [
        buildMultiField({
          id: 'statusAndChildren',
          title: m.statusAndChildren,
          children: [
            buildRadioField({
              id: 'status',
              title: '',
              description: m.statusDescription,
              width: 'half',
              largeButtons: true,
              options: [
                {
                  label: m.statusEmployed,
                  value: StatusTypes.EMPLOYED,
                  tooltip: m.statusEmployedInformation,
                },
                {
                  label: m.statusStudent,
                  value: StatusTypes.STUDENT,
                  tooltip: m.statusStudentInformation,
                },
                {
                  label: m.statusPensioner,
                  value: StatusTypes.PENSIONER,
                  tooltip: m.statusPensionerInformation,
                },
                {
                  label: m.statusOther,
                  value: StatusTypes.OTHER,
                  tooltip: m.statusOtherInformation,
                },
              ],
            }),
            buildCustomField({
              id: 'confirmationOfStudiesDescription',
              title: m.confirmationOfStudies,
              description: m.confirmationOfStudiesTooltip,
              component: 'TextWithTooltip',
              condition: (answers) => answers.status === StatusTypes.STUDENT,
            }),
            buildFileUploadField({
              id: 'confirmationOfStudies',
              title: '',
              introduction: '',
              uploadHeader: m.fileUploadHeader.defaultMessage,
              uploadDescription: m.fileUploadDescription.defaultMessage,
              condition: (answers) => answers.status === StatusTypes.STUDENT,
            }),
            buildRadioField({
              id: 'children',
              title: '',
              description: m.childrenDescription,
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildCustomField({
              id: 'childrenInfo',
              title: '',
              component: 'InfoMessage',
              condition: (answers) => answers.children === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'formerInsuranceSection',
      title: m.formerInsuranceSection,
      children: [
        buildMultiField({
          id: 'formerInsurance',
          title: m.formerInsuranceTitle,
          children: [
            buildRadioField({
              id: 'formerInsurance.registration',
              title: '',
              description: m.formerInsuranceRegistration,
              largeButtons: true,
              options: [
                { label: m.formerInsuranceNoOption, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildDescriptionField({
              id: 'formerInsurance.details',
              title: '',
              description: m.formerInsuranceDetails,
            }),
            buildTextField({
              id: 'formerInsurance.country',
              title: m.formerInsuranceCountry,
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'formerInsurance.personalId',
              title: m.formerPersonalId,
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'formerInsurance.institution',
              title: m.formerInsuranceInstitution,
              backgroundColor: 'blue',
            }),
            buildCustomField({
              id: 'formerInsurance.entitlementDescription',
              title: m.formerInsuranceEntitlement,
              description: m.formerInsuranceEntitlementTooltip,
              component: 'TextWithTooltip',
            }),
            buildRadioField({
              id: 'formerInsurance.entitlement',
              title: '',
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildTextField({
              id: 'formerInsurance.additionalInformation',
              title: m.formerInsuranceAdditionalInformation,
              placeholder: m.formerInsuranceAdditionalInformationPlaceholder,
              variant: 'textarea',
              backgroundColor: 'blue',
              condition: (answers) =>
                (answers as {
                  formerInsurance: { entitlement: string }
                })?.formerInsurance?.entitlement === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: m.confirmationSection,
      children: [
        buildMultiField({
          id: '',
          title: m.confirmationTitle,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'Review',
            }),
            buildRadioField({
              id: 'additionalInfo.hasAdditionalInfo',
              title: '',
              description: m.additionalInfo,
              largeButtons: true,
              width: 'half',
              options: [
                { value: NO, label: m.noOptionLabel },
                { value: YES, label: m.yesOptionLabel },
              ],
            }),
            buildTextField({
              id: 'additionalInfo.remarks',
              title: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlaceholder,
              backgroundColor: 'blue',
              condition: {
                questionId: 'additionalInfo.hasAdditionalInfo',
                isMultiCheck: false,
                comparator: Comparators.GTE,
                value: YES,
              },
            }),
            buildFileUploadField({
              id: 'additionalInfo.files',
              title: '',
              introduction: '',
              uploadHeader: m.fileUploadHeader.defaultMessage,
              uploadDescription: m.fileUploadDescription.defaultMessage,
              condition: {
                questionId: 'additionalInfo.hasAdditionalInfo',
                isMultiCheck: false,
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildCustomField({
              id: 'confirmCorrectInfo',
              title: '',
              component: 'ConfirmCheckbox',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'successfulSubmission',
          title: '',
          component: 'ConfirmationScreen',
        }),
      ],
    }),
  ],
})
