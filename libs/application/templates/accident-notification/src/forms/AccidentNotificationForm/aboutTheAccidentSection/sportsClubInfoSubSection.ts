import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'
import { representativeInfo, sportsClubInfo } from '../../../lib/messages'
import { isProfessionalAthleteAccident } from '../../../utils/occupationUtils'
import { isReportingOnBehalfOfEmployee } from '../../../utils/reportingUtils'

// Sports club information when the injured has a sports related accident
export const sportsClubInfoSubSection = buildSubSection({
  id: 'sportsClubInfo.subSection',
  title: sportsClubInfo.general.title,
  condition: (formValue) =>
    isProfessionalAthleteAccident(formValue) &&
    !isReportingOnBehalfOfEmployee(formValue),
  children: [
    buildMultiField({
      id: 'sportsClubInfo',
      title: sportsClubInfo.general.title,
      description: sportsClubInfo.general.description,
      children: [
        buildTextField({
          id: 'companyInfo.name',
          title: sportsClubInfo.labels.name,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'companyInfo.nationalRegistrationId',
          title: sportsClubInfo.labels.nationalId,
          backgroundColor: 'blue',
          format: '######-####',
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'sportsClubInfo.descriptionField',
          description: sportsClubInfo.labels.subDescription,
          space: 'containerGutter',
          titleVariant: 'h5',
          title: sportsClubInfo.labels.descriptionField,
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
