import {
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

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
      id: 'occupation',
      name: '',
      children: [
        buildTextField({
          id: 'occupationText',
          name: 'text input',
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
