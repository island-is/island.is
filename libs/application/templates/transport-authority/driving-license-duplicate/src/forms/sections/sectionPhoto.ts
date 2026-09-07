import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildImageField,
  getValueViaPath,
  toBase64DataUrl,
  YES,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'
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
                illustration: buildImageField({
                  id: 'fakePhoto-illustration',
                  image: toBase64DataUrl('fakePhoto'),
                }),
              })
            } else {
              const facialPhotos = getFacialPhotosFromThjodskra(externalData)

              facialPhotos.forEach((photo) => {
                photoOptions.push({
                  value: photo.biometricId,
                  label: m.usePassportImage,
                  illustration: photo.content
                    ? buildImageField({
                        id: `photo-${photo.biometricId}`,
                        image: toBase64DataUrl(photo.content),
                      })
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
                  illustration: buildImageField({
                    id: 'qualityPhoto-illustration',
                    image: toBase64DataUrl(qualityPhoto),
                  }),
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
