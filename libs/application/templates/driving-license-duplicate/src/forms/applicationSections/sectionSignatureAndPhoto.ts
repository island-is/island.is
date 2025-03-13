import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDescriptionField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../fields/QualityPhoto/hooks/useQualityPhoto'
import { HasQualitySignatureData } from '../../fields/QualitySignature/hooks/useQualitySignature'
import { requirementsMet } from '../../lib/utils'

export const sectionSignatureAndPhoto = buildSection({
  id: 'signatureAndPhoto',
  title: m.signatureAndImage,
  children: [
    buildMultiField({
      id: 'signatureAndPhoto',
      title: m.signatureAndImage,
      description: m.informationSubtitle,
      condition: (answers, externalData) =>
        requirementsMet(answers, externalData),
      children: [
        buildAlertMessageField({
          id: 'digitalLicenseInfo',
          message: m.signatureAndImageAlert,
          alertType: 'info',
        }),
        buildDescriptionField({
          id: 'signatureTitle',
          title: m.signature,
          titleVariant: 'h4',
          description: '',
          marginTop: 'gutter',
        }),
        buildCustomField({
          id: 'qSignature',
          component: 'QualitySignature',
          condition: (_, externalData) => {
            return (
              (externalData.qualitySignature as HasQualitySignatureData)?.data
                ?.hasQualitySignature === true
            )
          },
        }),
        buildDescriptionField({
          id: 'imgTitle',
          title: m.image,
          titleVariant: 'h4',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qphoto',
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
      condition: (answers, externalData) =>
        !requirementsMet(answers, externalData),
      title: 'SubmitAndDecline',
      component: 'SubmitAndDecline',
      id: 'SubmitAndDecline',
    }),
  ],
})
