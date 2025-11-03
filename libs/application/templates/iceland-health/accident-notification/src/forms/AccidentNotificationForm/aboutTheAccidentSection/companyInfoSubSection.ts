import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { companyInfo, representativeInfo } from '../../../lib/messages'
import {
  isAgricultureAccident,
  isGeneralWorkplaceAccident,
  isInternshipStudiesAccident,
} from '../../../utils/occupationUtils'
import { isReportingOnBehalfOfEmployee } from '../../../utils/reportingUtils'
import { isHomeActivitiesAccident } from '../../../utils/accidentUtils'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'

// Company information if work accident without the injured being a fisherman or in agriculture
export const companyInfoSubSection = buildSubSection({
  id: 'companyInfo.subSection',
  title: companyInfo.general.title,
  condition: (formValue) =>
    !isAgricultureAccident(formValue) &&
    !isReportingOnBehalfOfEmployee(formValue) &&
    !isHomeActivitiesAccident(formValue) &&
    (isGeneralWorkplaceAccident(formValue) ||
      isInternshipStudiesAccident(formValue)),
  children: [
    buildMultiField({
      id: 'companyInfo',
      title: companyInfo.general.title,
      description: companyInfo.general.description,
      children: [
        buildTextField({
          id: 'companyInfo.name',
          title: companyInfo.labels.name,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
          maxLength: 100,
        }),
        buildTextField({
          id: 'companyInfo.nationalRegistrationId',
          title: companyInfo.labels.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          format: '######-####',
          required: true,
        }),
        buildDescriptionField({
          id: 'companyInfo.descriptionField',
          description: companyInfo.labels.subDescription,
          space: 'containerGutter',
          titleVariant: 'h5',
          title: companyInfo.labels.descriptionField,
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),

        // These should all be required if the user is not the representative of the company.
        // Should look into if we can require conditionally
        buildTextField({
          id: 'representative.name',
          title: representativeInfo.labels.name,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
          maxLength: 100,
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),
        buildTextField({
          id: 'representative.nationalId',
          title: representativeInfo.labels.nationalId,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
          format: '######-####',
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),
        buildTextField({
          id: 'representative.email',
          title: representativeInfo.labels.email,
          backgroundColor: 'blue',
          variant: 'email',
          width: 'half',
          required: true,
          maxLength: 100,
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),
        buildTextField({
          id: 'representative.phoneNumber',
          title: representativeInfo.labels.tel,
          backgroundColor: 'blue',
          format: '###-####',
          variant: 'tel',
          width: 'half',
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),
        buildCustomField(
          {
            id: 'representativeInfo.custom',
            title: '',
            doesNotRequireAnswer: true,
            component: 'HiddenInformation',
          },
          {
            id: 'representativeInfo',
          },
        ),
      ],
    }),
  ],
})
