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
} from '@island.is/application/core'
import { m } from './messages'
import { YES, NO } from '../constants'
import { StatusTypes } from '../types'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
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
              id: 'nationalRegistry',
              type: 'NationalRegistry',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'directorateOfLabor',
              type: 'DirectorateOfLabor',
              title: m.directorateOfLaborTitle,
              subTitle: m.directorateOfLaborSubTitle,
            }),
            buildDataProviderItem({
              id: 'internalRevenue',
              type: 'InternalRevenue',
              title: m.internalRevenueTitle,
              subTitle: m.internalRevenueSubTitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'contactInfoSection',
          title: m.contactInfoTitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: m.postalCode,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.city',
              title: m.city,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.nationality',
              title: m.nationality,
              width: 'half',
              disabled: true,
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
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
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
                  label: m.statusPensioner,
                  value: StatusTypes.PENSIONER,
                  tooltip: m.statusPensionerInformation,
                },
                {
                  label: m.statusStudent,
                  value: StatusTypes.STUDENT,
                  tooltip: m.statusStudentInformation,
                },
                {
                  label: m.statusOther,
                  value: StatusTypes.OTHER,
                  tooltip: m.statusOtherInformation,
                },
              ],
            }),
            buildFileUploadField({
              id: 'confirmationOfStudies',
              title: '',
              introduction: m.confirmationOfStudies,
              condition: (answers) => answers.status === StatusTypes.STUDENT,
            }),
            buildRadioField({
              id: 'children',
              title: '',
              description: m.childrenDescription,
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.yesOptionLabel, value: YES },
                { label: m.noOptionLabel, value: NO },
              ],
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
              id: 'formerInsuranceRegistration',
              title: '',
              description: m.formerInsuranceRegistration,
              largeButtons: true,
              options: [
                { label: m.formerInsuranceNoOption, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildDescriptionField({
              id: 'formerInsuranceDetails',
              title: '',
              description: m.formerInsuranceDetails,
            }),
            buildTextField({
              id: 'formerInsuranceCountry',
              title: m.formerInsuranceCountry,
              width: 'half',
            }),
            buildTextField({
              id: 'formerPersonalId',
              title: m.formerPersonalId,
              width: 'half',
            }),
            buildTextField({
              id: 'formerInsuranceInstitution',
              title: m.formerInsuranceInstitution,
            }),
            buildRadioField({
              id: 'formerInsuranceEntitlement',
              title: '',
              description: m.formerInsuranceEntitlement,
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
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
              id: 'additionalInfo',
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
              id: 'additionalRemarks',
              title: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlacehokder,
              condition: (answers) => answers.additionalInfo === YES,
            }),
            buildFileUploadField({
              id: 'additionalFiles',
              title: '',
              introduction: '',
              condition: (answers) => answers.additionalInfo === YES,
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
        buildDescriptionField({
          id: 'successfulSubmission',
          title: m.succesfulSubmissionTitle,
          description: m.succesfulSubmissionMessage,
        }),
      ],
    }),
  ],
})
