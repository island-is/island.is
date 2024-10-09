import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { applicantInformation } from '../../lib/messages'
import {
  getProcureAddress,
  getProcureMunicipality,
  getProcureName,
  getProcureNationalId,
  getProcurePostalCode,
} from '../../utils/procureUtils'
export const procureApplicantInformationSection = buildSection({
  id: 'procureApplicantInformationSection',
  title: applicantInformation.general.title,
  condition: (_application, externalData) => {
    if (externalData.identity) {
      return true
    }
    return false
  },
  children: [
    buildMultiField({
      id: 'procureApplicantInformation',
      title: applicantInformation.general.title,
      children: [
        buildTextField({
          id: 'procureApplicantInformation.name',
          title: applicantInformation.procure.name,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: getProcureName,
        }),
        buildTextField({
          id: 'procureApplicantInformation.nationalId',
          title: applicantInformation.labels.nationalId,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: getProcureNationalId,
          width: 'half',
        }),
        buildTextField({
          id: 'procureApplicantInformation.address',
          title: applicantInformation.labels.address,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: getProcureAddress,
          width: 'half',
        }),
        buildTextField({
          id: 'procureApplicantInformation.postalCode',
          title: applicantInformation.labels.postalCode,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: getProcurePostalCode,
          width: 'half',
        }),
        buildTextField({
          id: 'procureApplicantInformation.municipality',
          title: applicantInformation.labels.city,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: getProcureMunicipality,
          width: 'half',
        }),
        buildTextField({
          id: 'procureApplicantInformation.email',
          title: applicantInformation.labels.email,
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'procureApplicantInformation.tel',
          title: applicantInformation.labels.tel,
          width: 'half',
          variant: 'tel',
        }),
      ],
    }),
  ],
})
