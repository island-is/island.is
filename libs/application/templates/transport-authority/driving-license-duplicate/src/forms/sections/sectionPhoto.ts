import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'
import { createPhotoComponent } from '../../fields/CreatePhoto'
import { IGNORE } from '../../lib/constants'

interface ThjodskraPhoto {
  biometricId: string
  content: string
  contentSpecification: 'FACIAL' | 'SIGNATURE'
}

const getFacialPhotosFromThjodskra = (
  externalData: ExternalData,
): ThjodskraPhoto[] => {
  const photos: ThjodskraPhoto[] =
    getValueViaPath(externalData, 'allPhotosFromThjodskra.data.images', []) ||
    []
  return photos.filter((p) => p.contentSpecification === 'FACIAL')
}

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
          defaultValue: (application: Application) => {
            const photos = getFacialPhotosFromThjodskra(
              application.externalData,
            )
            return photos[0]?.biometricId ?? 'qualityPhoto'
          },
          options: ({ answers, externalData }) => {
            const photoOptions = []

            if (
              getValueViaPath(answers, 'fakeData.useFakeData') === YES ||
              getValueViaPath(answers, 'fakeData.useFakeData') === IGNORE
            ) {
              photoOptions.push({
                value: 'fakePhoto',
                label: m.useFakeImage,
                illustration: createPhotoComponent('fakePhoto'),
              })
            } else {
              const facialPhotos = getFacialPhotosFromThjodskra(externalData)

              facialPhotos.forEach((photo) => {
                photoOptions.push({
                  value: photo.biometricId,
                  label: m.usePassportImage,
                  illustration: photo.content
                    ? createPhotoComponent(photo.content)
                    : undefined,
                })
              })

              // Add quality photo if it exists
              const qualityPhoto = getValueViaPath<string>(
                externalData,
                'qualityPhoto.data.qualityPhoto',
              )

              if (qualityPhoto) {
                photoOptions.push({
                  value: 'qualityPhoto',
                  label: m.useDriversLicenseImage,
                  illustration: createPhotoComponent(qualityPhoto),
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
