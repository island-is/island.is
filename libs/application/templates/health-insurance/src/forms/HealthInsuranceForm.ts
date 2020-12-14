import {
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'
import { YES, NO } from '../constants'

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
                  value: 'pensioner',
                  tooltip: m.statusPensionerInformation,
                },
                {
                  label: m.statusStudent,
                  value: 'student',
                  tooltip: m.statusStudentInformation,
                },
                {
                  label: m.statusOther,
                  value: 'other',
                  tooltip: m.statusOtherInformation,
                },
              ],
            }),
            buildFileUploadField({
              id: 'additionalInformation',
              name: '',
              introduction: m.statusAdditionalInformation,
              condition: (answers) => answers.status === 'student',
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
      id: 'info',
      name: '',
      children: [
        buildTextField({
          id: 'infoInput',
          name: 'text input',
        }),
      ],
    }),
    buildSection({
      id: 'summary',
      name: '',
      children: [
        buildTextField({
          id: 'summaryInput',
          name: 'text input',
        }),
      ],
    }),
  ],
})
