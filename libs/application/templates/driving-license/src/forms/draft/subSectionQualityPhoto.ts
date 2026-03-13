import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { hasNoDrivingLicenseInOtherCountry } from '../../lib/utils'
import { createPhotoComponent } from '../../fields/CreatePhoto'

interface ThjodskraPhoto {
  biometricId: string
  content: string
  contentSpecification: 'FACIAL' | 'SIGNATURE'
}

const getFacialPhotosFromThjodskra = (
  externalData: ExternalData,
): ThjodskraPhoto[] => {
  const photos: ThjodskraPhoto[] =
    getValueViaPath(externalData, 'allPhotosFromThjodskra.data.images', []) ??
    []
  return photos.filter((p) => p.contentSpecification === 'FACIAL')
}

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.photoSelectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'photoSelection',
      title: m.photoSelectionTitle,
      description: m.photoSelectionDescription,
      children: [
        buildRadioField({
          id: 'selectLicensePhoto',
          width: 'full',
          backgroundColor: 'blue',
          required: true,
          defaultValue: (application: Application) => {
            const usingFakeData =
              getValueViaPath(application.answers, 'fakeData.useFakeData') ===
              YES
            if (usingFakeData) {
              return getValueViaPath(
                application.answers,
                'fakeData.qualityPhoto',
              ) === YES
                ? 'fakePhoto'
                : 'bringNewPhoto'
            }

            const photos = getFacialPhotosFromThjodskra(
              application.externalData,
            )
            if (photos.length > 0) {
              return photos[0]?.biometricId
            }
            const qualityPhoto = getValueViaPath<string>(
              application.externalData,
              'qualityPhoto.data.qualityPhoto',
            )
            if (qualityPhoto) {
              return 'qualityPhoto'
            }
            return 'bringNewPhoto'
          },
          options: ({ answers, externalData }) => {
            const photoOptions = []

            if (getValueViaPath(answers, 'fakeData.useFakeData') === YES) {
              if (getValueViaPath(answers, 'fakeData.qualityPhoto') === YES) {
                photoOptions.push({
                  value: 'fakePhoto',
                  label: m.useFakeImage,
                  illustration: createPhotoComponent('fakePhoto'),
                })
              }
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

            photoOptions.push({
              value: 'bringNewPhoto',
              label: m.qualityPhotoAcknowledgement,
            })

            return photoOptions
          },
        }),
        buildDescriptionField({
          id: 'photodesc',
          description: m.qualityPhotoInstructionBullets,
          condition: (answers, externalData) => {
            const selected = getValueViaPath(answers, 'selectLicensePhoto')

            // If explicitly selected, use that
            if (selected) {
              return selected === 'bringNewPhoto'
            }

            // Before the user has interacted, check if "bringNewPhoto"
            // would be the default (i.e. no other photos are available)
            const usingFakeData =
              getValueViaPath(answers, 'fakeData.useFakeData') === YES
            if (usingFakeData) {
              return getValueViaPath(answers, 'fakeData.qualityPhoto') !== YES
            }

            const facialPhotos = getFacialPhotosFromThjodskra(externalData)
            if (facialPhotos.length > 0) return false

            const qualityPhoto = getValueViaPath<string>(
              externalData,
              'qualityPhoto.data.qualityPhoto',
            )
            return !qualityPhoto
          },
        }),
      ],
    }),
  ],
})
