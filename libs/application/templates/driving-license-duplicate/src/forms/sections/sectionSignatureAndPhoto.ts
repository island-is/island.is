import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildAlertMessageField,
  getValueViaPath,
  buildRadioField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'
import { SvgImage } from '../../assets/test'

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
        buildCustomField({
          id: 'qphoto',
          component: 'QualityPhoto',
          condition: (_, externalData) =>
            getValueViaPath(
              externalData,
              'qualityPhoto.data.hasQualityPhoto',
            ) === true,
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
        buildRadioField({
          id: 'testSelectPhoto',
          width: 'full',
          backgroundColor: 'white',
          options: [
            {
              value: '1',
              label: 'Test mynd 1',
              illustration: SvgImage,
            },
            {
              value: '2',
              label: 'Test mynd 2',
              illustration: SvgImage,
            },
            {
              value: '3',
              label: 'Test mynd 3',
              illustration: SvgImage,
            },
          ],
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
