import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDescriptionField,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
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
          condition: (_, externalData) =>
            getValueViaPath(
              externalData,
              'qualitySignature.data.hasQualitySignature',
            ) === true,
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
          condition: (_, externalData) =>
            getValueViaPath(
              externalData,
              'qualitySignature.data.hasQualityPhoto',
            ) === true,
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
