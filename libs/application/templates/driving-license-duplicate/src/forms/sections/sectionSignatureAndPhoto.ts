import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  getValueViaPath,
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
        buildRadioField({
          id: 'selectLicensePhoto',
          width: 'full',
          backgroundColor: 'blue',
          required: true,
          options: ({ externalData }) => {
            const photoOptions = []
            
            // Add quality photo if it exists
            const qualityPhoto = getValueViaPath<string>(
              externalData,
              'qualityPhoto.data.qualityPhoto',
            )
            
            // Add quality photo option if available
            if (qualityPhoto) {
              photoOptions.push({
                value: 'qualityPhoto',
                label: 'Ég staðfesti að nota núverandi mynd í ökuskírteini',
                illustration: createPhotoComponent(qualityPhoto),
              })
            }
            
            // Add photos from Thjodskra if they exist
            const photos: {
              biometricId: string
              content: string
            }[] =
              getValueViaPath(
                externalData,
                'allPhotosFromThjodskra.data.images',
                [],
              ) || []

            if (photos && photos.length > 0) {
              photos.forEach((photo) => {
                photoOptions.push({
                  value: photo.biometricId,
                  label: 'Ég staðfesti að nota núverandi mynd í vegabréfi',
                  illustration: photo.content
                    ? createPhotoComponent(photo.content)
                    : undefined,
                })
              })
            }

            return photoOptions
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
