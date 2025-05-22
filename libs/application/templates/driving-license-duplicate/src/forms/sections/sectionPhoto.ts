import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'
import { createPhotoComponent } from '../../fields/CreatePhoto'

export const sectionPhoto = buildSection({
  id: 'photo',
  title: m.image,
  children: [
    buildMultiField({
      id: 'photo',
      title: m.image,
      description: m.imageDescription,
      condition: (answers, externalData) =>
        requirementsMet(answers, externalData),
      children: [
        buildRadioField({
          id: 'selectLicensePhoto',
          width: 'full',
          backgroundColor: 'blue',
          required: true,
          options: ({ answers, externalData }) => {
            const photoOptions = []

            if (
              getValueViaPath<string>(answers, 'fakeData.useFakeData') === YES
            ) {
              photoOptions.push({
                value: 'fakePhoto',
                label: m.useFakeImage,
                illustration: createPhotoComponent('fakePhoto'),
              })
            } else {
              // Add quality photo if it exists
              const qualityPhoto = getValueViaPath<string>(
                externalData,
                'qualityPhoto.data.qualityPhoto',
              )

              // Add quality photo option if available
              if (qualityPhoto) {
                photoOptions.push({
                  value: 'qualityPhoto',
                  label: m.useDriversLicenseImage,
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
                    label: m.usePassportImage,
                    illustration: photo.content
                      ? createPhotoComponent(photo.content)
                      : undefined,
                  })
                })
              }
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
