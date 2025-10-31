import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { isInjuredAndRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'
import { fishingCompanyInfo, representativeInfo } from '../../../lib/messages'
import { isReportingOnBehalfOfEmployee } from '../../../utils/reportingUtils'
import { isFishermanAccident } from '../../../utils/occupationUtils'

// fishery information if fisherman
export const fishingCompanyInfoSubSection = buildSubSection({
  id: 'fishingCompanyInfo.subSection',
  title: (application) =>
    isReportingOnBehalfOfEmployee(application.answers)
      ? fishingCompanyInfo.general.informationAboutShipTitle
      : fishingCompanyInfo.general.title,
  condition: (formValue) => isFishermanAccident(formValue),
  children: [
    buildMultiField({
      id: 'fishingShipInfo',
      title: fishingCompanyInfo.general.informationAboutShipTitle,
      description: fishingCompanyInfo.general.informationAboutShipDescription,
      children: [
        buildTextField({
          id: 'fishingShipInfo.shipName',
          title: fishingCompanyInfo.labels.shipName,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'fishingShipInfo.shipCharacters',
          title: fishingCompanyInfo.labels.shipCharacters,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'fishingShipInfo.homePort',
          title: fishingCompanyInfo.labels.homePort,
          backgroundColor: 'blue',
          width: 'half',
          maxLength: 100,
        }),
        buildTextField({
          id: 'fishingShipInfo.shipRegisterNumber',
          title: fishingCompanyInfo.labels.shipRegisterNumber,
          backgroundColor: 'blue',
          width: 'half',
          maxLength: 100,
        }),
      ],
    }),
    buildMultiField({
      id: 'fishingCompanyInfo',
      title: fishingCompanyInfo.general.title,
      description: fishingCompanyInfo.general.description,
      condition: (formValue) => !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildTextField({
          id: 'companyInfo.name',
          title: fishingCompanyInfo.labels.name,
          backgroundColor: 'blue',
          required: true,
          width: 'half',
          maxLength: 100,
        }),
        buildTextField({
          id: 'companyInfo.nationalRegistrationId',
          title: fishingCompanyInfo.labels.nationalId,
          backgroundColor: 'blue',
          format: '######-####',
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'fishingCompanyInfo.descriptionField',
          description: fishingCompanyInfo.labels.subDescription,
          space: 'containerGutter',
          titleVariant: 'h5',
          title: fishingCompanyInfo.labels.descriptionField,
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
