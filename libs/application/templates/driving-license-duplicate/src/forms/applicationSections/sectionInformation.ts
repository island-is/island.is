import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../fields/QualityPhoto/hooks/useQualityPhoto'
import { HasQualitySignatureData } from '../../fields/QualitySignature/hooks/useQualitySignature'
import { requirementsMet } from '../../lib/utils'

export const sectionInformation = buildSection({
  id: 'information',
  title: m.informationTitle,
  children: [
    buildMultiField({
      id: 'list',
      title: m.informationTitle,
      description: m.informationSubtitle,
      condition: (_, externalData) => requirementsMet(externalData),
      children: [
        buildTextField({
          id: 'name',
          title: m.applicantsName,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
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
          id: 'categories',
          title: '',
          component: 'CurrentLicense',
        }),
        buildCustomField(
          {
            id: 'qualityAlert',
            title: '',
            component: 'Alert',
          },
          {
            heading: m.signatureAndImage,
            type: 'info',
            message: m.signatureAndImageAlert,
          },
        ),
        buildDescriptionField({
          id: 'information.signatureTitle',
          title: m.signature,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
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
        buildDescriptionField({
          id: 'information.imgTitle',
          title: m.image,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
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
      ],
    }),
    buildCustomField({
      condition: (_, externalData) => !requirementsMet(externalData),
      title: 'SubmitAndDecline',
      component: 'SubmitAndDecline',
      id: 'SubmitAndDecline',
    }),
  ],
})
