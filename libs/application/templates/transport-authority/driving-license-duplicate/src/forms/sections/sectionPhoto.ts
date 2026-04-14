import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildImageField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'
import { IGNORE } from '../../lib/constants'

const PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjIwIiByPSIxMiIvPjxwYXRoIGQ9Ik0xMiA1MmMwLTExLjMgOS4yLTE2IDIwLTE2czIwIDQuNyAyMCAxNmgtNDB6Ii8+PC9zdmc+'

const toBase64DataUrl = (photoData?: string): string => {
  if (!photoData) return PLACEHOLDER_SRC

  let cleaned = photoData
  const first = cleaned[0]
  if (
    (first === '"' || first === "'") &&
    cleaned.length >= 2 &&
    cleaned[cleaned.length - 1] === first
  ) {
    cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\/g, '')
  }

  const isValidBase64 =
    cleaned.length > 100 && !/[^A-Za-z0-9+/=]/.test(cleaned)

  return isValidBase64 ? `data:image/jpeg;base64,${cleaned}` : PLACEHOLDER_SRC
}

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
