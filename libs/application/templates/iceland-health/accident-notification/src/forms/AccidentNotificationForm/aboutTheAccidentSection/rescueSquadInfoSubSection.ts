import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { representativeInfo, rescueSquadInfo } from '../../../lib/messages'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'
import { isRescueWorkAccident } from '../../../utils/accidentUtils'
import { isReportingOnBehalfOfEmployee } from '../../../utils/reportingUtils'

// Rescue squad information when accident is related to rescue squad
export const rescueSquadInfoSubSection = buildSubSection({
  id: 'rescueSquadInfo.subSection',
  title: rescueSquadInfo.general.title,
  condition: (formValue) =>
    isRescueWorkAccident(formValue) &&
    !isReportingOnBehalfOfEmployee(formValue),
  children: [
    buildMultiField({
      id: 'rescueSquad',
      title: rescueSquadInfo.general.title,
      description: rescueSquadInfo.general.description,
      children: [
        buildTextField({
          id: 'companyInfo.name',
          title: rescueSquadInfo.labels.name,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'companyInfo.nationalRegistrationId',
          title: rescueSquadInfo.labels.nationalId,
          backgroundColor: 'blue',
          format: '######-####',
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'rescueSquadInfo.descriptionField',
          description: rescueSquadInfo.labels.subDescription,
          space: 'containerGutter',
          titleVariant: 'h5',
          title: rescueSquadInfo.labels.descriptionField,
          condition: (formValue) =>
            !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
        }),
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
          doesNotRequireAnswer: true,
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
