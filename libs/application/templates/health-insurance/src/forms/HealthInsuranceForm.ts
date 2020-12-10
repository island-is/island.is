import {
  buildCustomField,
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildIntroductionField,
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
  name: m.formTitle,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'applicantInfo',
      name: m.applicantInfoSection,
      children: [
        buildExternalDataProvider({
          name: m.externalDataTitle,
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
          id: 'contactInfo',
          name: m.contactInfoTitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              name: m.name,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              name: m.nationalId,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.address,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              name: m.postalCode,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.city',
              name: m.city,
              width: 'half',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.nationality',
              name: m.nationality,
              width: 'half',
              disabled: true,
            }),
            buildIntroductionField({
              id: 'editNationalRegistryData',
              name: '',
              introduction: m.editNationalRegistryData,
            }),
            buildDividerField({ name: ' ', color: 'transparent' }),
            buildTextField({
              id: 'applicant.email',
              name: m.email,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildIntroductionField({
              id: 'editDigitalIslandData',
              name: '',
              introduction: m.editDigitalIslandData,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'statusAndChildrenSection',
      name: m.statusAndChildren,
      children: [
        buildMultiField({
          id: 'statusAndChildren',
          name: m.statusAndChildren,
          children: [
            buildRadioField({
              id: 'status',
              name: '',
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
              id: 'additionalInformation',
              name: '',
              introduction: m.statusAdditionalInformation,
              condition: (answers) => answers.status === StatusTypes.STUDENT,
            }),
            buildRadioField({
              id: 'children',
              name: '',
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
      id: 'formerCountryofInsuranceSection',
      name: m.formerInsuranceSection,
      children: [
        buildMultiField({
          id: 'formerCountryofInsurance',
          name: m.formerCountryOfInsuranceTitle,
          children: [
            buildRadioField({
              id: 'insuranceRegistration',
              name: '',
              description: m.formerCountryOfInsuranceDescription,
              largeButtons: true,
              options: [
                { label: m.formerCountryOfInsuranceNoOption, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildIntroductionField({
              id: 'infoFormerCountryInsurance',
              name: '',
              introduction: m.formerCountryOfInsuranceInfo,
            }),
            buildTextField({
              id: 'country',
              name: m.country,
              width: 'half',
            }),
            buildTextField({
              id: 'id',
              name: m.formerId,
              width: 'half',
            }),
            buildTextField({
              id: 'insuranceInstitution',
              name: m.insuranceInstitution,
            }),
            buildRadioField({
              id: 'insuranceEntitlement',
              name: '',
              description: m.insuranceEntitlement,
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
      name: m.confirmationSection,
      children: [
        buildMultiField({
          id: '',
          name: m.confirmationTitle,
          children: [
            buildCustomField({
              id: 'review',
              name: '',
              component: 'Review',
            }),
            buildRadioField({
              id: 'hasAdditionalInfo',
              name: '',
              description: m.hasAdditionalRemarks,
              largeButtons: true,
              width: 'half',
              options: [
                { value: NO, label: m.noOptionLabel },
                { value: YES, label: m.yesOptionLabel },
              ],
            }),
            buildTextField({
              id: 'additionalRemarks',
              name: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlacehokder,
              condition: (answers) => answers.hasAdditionalInfo === YES,
            }),
            buildFileUploadField({
              id: 'additionalFiles',
              name: '',
              introduction: '',
              condition: (answers) => answers.hasAdditionalInfo === YES,
            }),
            buildCustomField({
              id: 'correctInfo',
              name: '',
              component: 'ConfirmCheckbox',
            }),
            buildSubmitField({
              id: 'submit',
              name: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'successfulSubmission',
          name: m.succesfulSubmissionTitle,
          introduction: m.succesfulSubmissionMessage,
        }),
      ],
    }),
  ],
})
