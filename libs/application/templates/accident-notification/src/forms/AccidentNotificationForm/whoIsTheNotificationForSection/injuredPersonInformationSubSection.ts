import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { injuredPersonInformation } from '../../../lib/messages'
import {
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
} from '../../../utils/reportingUtils'

export const injuredPersonInformationSubSection = buildSubSection({
  id: 'injuredPersonInformation.section',
  title: injuredPersonInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'injuredPersonInformation',
      title: injuredPersonInformation.general.heading,
      description: (formValue) =>
        isReportingOnBehalfOfEmployee(formValue.answers)
          ? injuredPersonInformation.general.juridicalDescription
          : injuredPersonInformation.general.description,
      children: [
        buildTextField({
          id: 'injuredPersonInformation.name',
          title: injuredPersonInformation.labels.name,
          width: 'half',
          backgroundColor: 'blue',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'injuredPersonInformation.nationalId',
          title: injuredPersonInformation.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'blue',
          required: true,
        }),
        buildTextField({
          id: 'injuredPersonInformation.email',
          title: injuredPersonInformation.labels.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'injuredPersonInformation.phoneNumber',
          title: injuredPersonInformation.labels.tel,
          backgroundColor: 'blue',
          format: '###-####',
          width: 'half',
          variant: 'tel',
        }),
        buildDescriptionField({
          id: 'accidentDetails.descriptionField',
          space: 'containerGutter',
          title: injuredPersonInformation.general.jobTitle,
          description: injuredPersonInformation.general.jobTitleDescription,
          width: 'full',
          marginBottom: 2,
        }),
        buildTextField({
          id: 'injuredPersonInformation.jobTitle',
          title: injuredPersonInformation.labels.jobTitle,
          backgroundColor: 'blue',
          width: 'full',
          maxLength: 100,
        }),
      ],
    }),
  ],
  condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
})
