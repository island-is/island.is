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
import { createPhotoComponent } from '../../fields/CreatePhoto'

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
          id: 'selectPhotoFromThodskra',
          width: 'full',
          backgroundColor: 'white',
          options: ({ externalData }) => {
            const photos: {
              biometricId: string
              content: string
            }[] =
              getValueViaPath(
                externalData,
                'allPhotosFromThodskra.data.images',
                [],
              ) || []

            return photos?.map((photo, index) => ({
              value: photo.biometricId,
              label: `Photo ${index + 1}`,
              illustration: photo.content
                ? createPhotoComponent(photo.content)
                : undefined,
            }))
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
