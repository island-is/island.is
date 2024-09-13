import React, { FC, SVGProps } from 'react'

import {
  Box,
  RadioButton,
  GridRow,
  GridColumn,
  Text,
  SkeletonLoader,
  AlertMessage,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './hooks/useQualityPhoto'
import {
  container,
  photoClass,
  signatureClass,
  placeholderClass,
} from './QualityPhoto.css'
import { useFormContext } from 'react-hook-form'
import { NO, YES } from '../../lib/constants'

interface ImageData {
  type: 'signature' | 'photo' | 'placeholder'
  image: string | null
  alt: string
  loading?: boolean
  fake?: boolean
}

enum ImageType {
  drivingLicenseImage = 'drivingLicenseImage',
  passportImage = 'passportImage',
  newImage = 'newImage',
}

const Image: FC<React.PropsWithChildren<ImageData>> = ({
  image,
  fake,
  alt,
  loading,
  type,
}: ImageData) => {
  let className: string | null = ''
  let src: string | null = ''

  switch (type) {
    case 'photo':
      className = photoClass
      src = fake ? 'https://placehold.co/413x513' : image

      if (!image && loading === true) {
        return (
          <Box className={className}>
            <SkeletonLoader width="100%" height={513} />
          </Box>
        )
      }

      return src ? (
        <img className={className} alt={alt} src={src} />
      ) : (
        <div>nothing</div>
      )
    case 'signature':
      className = signatureClass
      src = fake ? 'https://placehold.co/945x178' : image

      if (!image && loading === true) {
        return (
          <Box className={className}>
            <SkeletonLoader width="100%" height="100%" />
          </Box>
        )
      }

      if (src) {
        return <img className={className} alt={alt} src={src} />
      }

      break
    case 'placeholder':
      return (
        <div className={placeholderClass}>
          <Placeholder />
        </div>
      )
    default:
      break
  }

  return null
}

export interface ThjodskraImage {
  content?: string | null
  contentLength?: number
  contentDocumentType?: string | null
  created?: Date
  biometricId?: string | null
}

const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  console.log('application', application)
  const { setValue } = useFormContext()

  const { formatMessage } = useLocale()
  const {
    qualityPhoto: { data: qualityPhotoData, loading: qualityPhotoLoading },
    qualitySignature: {
      data: qualitySignatureData,
      loading: qualitySignatureLoading,
    },
  } = useQualityPhoto(application)

  const thjodskraSignature = (
    application.externalData?.thjodskraSignature as {
      data: string | null
    }
  )?.data

  const thjodskraImage = (
    application.externalData?.thjodskraImage as {
      data: string | null
    }
  )?.data

  const [chosenImage, setChosenImage] = React.useState<string | null>(null)

  const items = [
    {
      type: ImageType.drivingLicenseImage,
      photo: Image({
        type: 'photo',
        image: qualityPhotoData,
        alt:
          formatText(m.qualityPhotoAltText, application, formatMessage) || '',
        loading: qualityPhotoLoading,
      }),
      signature: Image({
        type: 'signature',
        image: qualitySignatureData,
        alt:
          formatText(m.qualityPhotoAltText, application, formatMessage) || '',
        loading: qualitySignatureLoading,
      }),
      label: formatMessage(m.drivingLicenseImage),
      disabled: qualityPhotoLoading || qualitySignatureLoading,
    },
    {
      type: ImageType.passportImage,
      photo: Image({
        type: 'photo',
        image: thjodskraImage,
        alt:
          formatText(m.qualityPhotoAltText, application, formatMessage) || '',
      }),
      signature: Image({
        type: 'signature',
        image: thjodskraSignature,
        alt:
          formatText(m.qualityPhotoAltText, application, formatMessage) || '',
      }),
      disabled: !thjodskraImage,
      label: formatMessage(m.passportImage),
    },
    {
      type: ImageType.newImage,
      photo: Image({
        type: 'placeholder',
        image: null,
        alt:
          formatText(m.qualityPhotoAltText, application, formatMessage) || '',
      }),
      signature: null,
      label: formatMessage(m.newImage),
    },
  ]

  const onChosenImage = (type: keyof typeof ImageType) => {
    setChosenImage(type)

    switch (type) {
      case 'newImage':
        setValue('willBringQualityPhoto', YES)
        break
      case 'drivingLicenseImage':
        setValue('willBringQualityPhoto', NO)
        break
      case 'passportImage':
        setValue('willBringQualityPhoto', NO)
        break
      default:
        break
    }
  }

  return (
    <Box>
      {!qualityPhotoLoading && !qualityPhotoData && (
        <Box marginBottom={4}>
          <AlertMessage
            type="warning"
            title={formatText(
              m.qualityPhotoWarningTitle,
              application,
              formatMessage,
            )}
            message={formatText(
              m.qualityPhotoWarningDescription,
              application,
              formatMessage,
            )}
          />
        </Box>
      )}
      <GridRow>
        {items.map(({ photo, label, signature, type }) => (
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '4/12']}>
            <Box
              padding={3}
              marginBottom={3}
              background="blue100"
              borderRadius="large"
              display={['flex', 'flex', 'flex', 'block']}
              flexDirection="rowReverse"
              justifyContent="spaceBetween"
              className={container}
              border={chosenImage === type ? 'standard' : 'disabled'}
              onClick={() => onChosenImage(type)}
            >
              <Box borderRadius="large" overflow="hidden">
                {photo}
              </Box>
              <Box
                display={['flex', 'flex', 'flex', 'block']}
                flexDirection="columnReverse"
                justifyContent="spaceBetween"
                marginRight={[3, 3, 3, 0]}
              >
                <Box
                  background="white"
                  borderRadius="large"
                  marginTop={1}
                  marginBottom={[0, 0, 0, 3]}
                  className={signatureClass}
                >
                  {signature ?? <Text variant="eyebrow">Undirskrift</Text>}
                </Box>
                <RadioButton checked={chosenImage === type} label={label} />
              </Box>
            </Box>
          </GridColumn>
        ))}
      </GridRow>
    </Box>
  )
}

export { QualityPhoto }

const Placeholder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={128}
    height={128}
    fill="none"
    {...props}
  >
    <path
      fill="url(#a)"
      d="M53.632 97.31H21.056l-2.592 6.111h37.12a16.511 16.511 0 0 1-1.952-6.112Zm23.808 6.111h36.032l-3.2-6.112H77.44v6.112Zm0 5.856v3.2H70.4a16.853 16.853 0 0 1-9.6-3.2H17.216v6.112h96.992v-6.112H77.44Zm21.152-58.4h-8.128c0-2.432 1.088-23.744-13.024-23.744 0 0 4.224 21.312-10.144 23.744H51.744a2.303 2.303 0 0 0-1.056 1.632c-.576 2.848 3.2 10.656 3.2 10.656v2.912c-8.896-2.496-11.84-15.2-11.84-15.2h-4.032A10.434 10.434 0 0 1 28 37.565 32.864 32.864 0 0 1 44 16.83a57.92 57.92 0 0 1 31.712-3.2c2.048.448 4.128.992 6.4 1.696a41.118 41.118 0 0 1 24.32 24.544 8.198 8.198 0 0 1-.993 7.53 8.19 8.19 0 0 1-6.751 3.478h-.096Z"
    />
    <path
      fill="#6A2EA0"
      fillRule="evenodd"
      d="M88.678 34.07a.8.8 0 0 1 .964.592c2.465 10.313 1.796 19.377-.094 26.285-.945 3.453-2.197 6.374-3.52 8.648-1.316 2.257-2.734 3.93-4.04 4.825l-.006.004a16.095 16.095 0 0 1-17.948 0 .8.8 0 1 1 .892-1.328 14.496 14.496 0 0 0 16.16.002c1.03-.706 2.303-2.152 3.559-4.309 1.248-2.142 2.448-4.933 3.36-8.264 1.822-6.66 2.48-15.451.08-25.491a.8.8 0 0 1 .593-.964ZM36.127 89.056h17.857a.8.8 0 1 1 0 1.6H36.129A18.144 18.144 0 0 0 18.016 108.8a.8.8 0 1 1-1.6 0 19.743 19.743 0 0 1 19.71-19.744Zm40.513.8a.8.8 0 0 1 .8-.8h17.856a19.71 19.71 0 0 1 19.712 19.746.8.8 0 0 1-1.6-.003 18.104 18.104 0 0 0-5.294-12.827 18.104 18.104 0 0 0-12.818-5.316H77.44a.8.8 0 0 1-.8-.8Z"
      clipRule="evenodd"
    />
    <path
      fill="#6A2EA0"
      fillRule="evenodd"
      d="M54.687 62.787v-.001l-.003-.006-.013-.024-.052-.099a43.204 43.204 0 0 1-.86-1.747c-.53-1.135-1.168-2.635-1.631-4.124-.473-1.518-.723-2.906-.58-3.867.07-.465.22-.753.406-.926.177-.165.478-.313 1.038-.313h5.696a.8.8 0 0 0 0-1.6h-5.696c-.856 0-1.586.236-2.13.743-.534.499-.793 1.17-.896 1.859-.2 1.342.15 3.026.634 4.58.493 1.583 1.164 3.155 1.707 4.323a44.991 44.991 0 0 0 .877 1.782V96a17.15 17.15 0 0 0 17.218 17.152h2.974a.8.8 0 1 0 0-1.6h-2.979A15.551 15.551 0 0 1 54.784 96V63.168a.8.8 0 0 0-.096-.38M77.44 75.552a.8.8 0 0 1 .8.8v36a.8.8 0 1 1-1.6 0v-36a.8.8 0 0 1 .8-.8ZM68.504 63.49a.8.8 0 0 1 1.127-.105 12 12 0 0 0 8.01 2.76.8.8 0 1 1 .046 1.599 13.6 13.6 0 0 1-9.078-3.128.8.8 0 0 1-.105-1.127Z"
      clipRule="evenodd"
    />
    <defs>
      <linearGradient
        id="a"
        x1={113.12}
        x2={-33.312}
        y1={41.117}
        y2={187.549}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4C90FF" />
        <stop offset={1} stopColor="#FF4C84" />
      </linearGradient>
    </defs>
  </svg>
)
