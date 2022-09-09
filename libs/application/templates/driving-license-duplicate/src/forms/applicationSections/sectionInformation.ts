import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildCustomField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../fields/QualityPhoto/hooks/useQualityPhoto'
import { HasQualitySignatureData } from '../../fields/QualitySignature/hooks/useQualitySignature'

export const sectionInformation = buildSection({
  id: 'information',
  title: m.informationTitle,
  children: [
    buildMultiField({
      id: 'list',
      title: m.informationTitle,
      description: m.informationSubtitle,
      children: [
        buildTextField({
          id: 'name',
          title: m.applicantsName,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            console.log(application)
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User
            return nationalRegistry.fullName
          },
        }),
        buildTextField({
          id: 'nationalId',
          title: m.applicantsNationalId,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildCustomField({
          id: 'qphoto',
          title: '',
          component: 'QualityPhoto',
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === true
            )
          },
        }),
        buildCustomField({
          id: 'qSignature',
          title: '',
          component: 'QualitySignature',
          condition: (_, externalData) => {
            return (
              (externalData.qualitySignature as HasQualitySignatureData)?.data
                ?.hasQualitySignature === true
            )
          },
        }),
      ],
    }),
  ],
})
