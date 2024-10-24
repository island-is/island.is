import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { representativeInfo, schoolInfo } from '../../../lib/messages'
import { isStudiesAccident } from '../../../utils/accidentUtils'
import { isInternshipStudiesAccident } from '../../../utils/occupationUtils'
import { isReportingOnBehalfOfEmployee } from '../../../utils/reportingUtils'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'

// School information if school accident
export const schoolInfoSubSection = buildSubSection({
  id: 'schoolInfo.subSection',
  title: schoolInfo.general.title,
  condition: (formValue) =>
    isStudiesAccident(formValue) &&
    !isInternshipStudiesAccident(formValue) &&
    !isReportingOnBehalfOfEmployee(formValue),
  children: [
    buildMultiField({
      id: 'schoolInfo',
      title: schoolInfo.general.title,
      description: schoolInfo.general.description,
      children: [
        buildTextField({
          id: 'companyInfo.name',
          title: schoolInfo.labels.name,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
          maxLength: 100,
        }),
        buildTextField({
          id: 'companyInfo.nationalRegistrationId',
          title: schoolInfo.labels.nationalId,
          backgroundColor: 'blue',
          format: '######-####',
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'schoolInfo.descriptionField',
          description: schoolInfo.labels.subDescription,
          space: 'containerGutter',
          titleVariant: 'h5',
          title: schoolInfo.labels.descriptionField,
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
          maxLength: 100,
          required: true,
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
            id: 'schoolInfo.custom',
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
