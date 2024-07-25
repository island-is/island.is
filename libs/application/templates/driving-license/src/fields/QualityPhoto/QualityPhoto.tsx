import React, { FC } from 'react'

import {
  Box,
  RadioButton,
  GridRow,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './hooks/useQualityPhoto'
import { container, image } from './QualityPhoto.css'
interface QualityPhotoData {
  qualityPhoto: string | null
  application: Application
}

enum ImageType {
  drivingLicenseImage = 'drivingLicenseImage',
  passportImage = 'passportImage',
  newImage = 'newImage',
}

const Photo: FC<React.PropsWithChildren<QualityPhotoData>> = ({
  qualityPhoto,
  application,
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()

  if (!qualityPhoto) {
    return null
  }

  //temp
  const src =
    'https://images.ctfassets.net/8k0h54kbe6bj/5u0bSKny81QfKj3gC3tu0s/1415f3e408bd9097b8d5c8c4cfcc8425/Photolicense.png'
  return (
    <img
      className={image}
      alt={formatText(m.qualityPhotoAltText, application, formatMessage) || ''}
      src={src}
      id="myimage"
    />
  )
}

const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const { qualityPhoto } = useQualityPhoto(application)
  const img = Photo({ qualityPhoto, application })
  const [chosenImage, setChosenImage] = React.useState<string | null>(null)

  const photos = [
    {
      type: ImageType.drivingLicenseImage,
      label: formatMessage(m.drivingLicenseImage),
    },
    {
      type: ImageType.passportImage,
      label: formatMessage(m.passportImage),
    },
    {
      type: ImageType.newImage,
      label: formatMessage(m.newImage),
    },
  ]

  return (
    <Box>
      {qualityPhoto && (
        <GridRow>
          {photos.map((photo) => (
            <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
              <Box
                padding={3}
                marginBottom={3}
                background="blue100"
                borderRadius="large"
                display={['flex', 'flex', 'flex', 'block']}
                flexDirection="rowReverse"
                justifyContent="spaceBetween"
                className={container}
                border={chosenImage === photo.type ? 'standard' : undefined}
                onClick={() => setChosenImage(photo.type)}
              >
                <Box borderRadius="large">{img}</Box>
                <Box
                  display={['flex', 'flex', 'flex', 'block']}
                  flexDirection="columnReverse"
                  justifyContent="spaceBetween"
                  marginRight={[3, 3, 3, 0]}
                >
                  <Box
                    background="white"
                    borderRadius="large"
                    padding={1}
                    marginTop={1}
                    marginBottom={[0, 0, 0, 3]}
                  >
                    <Text variant="eyebrow">Undirskrift</Text>
                  </Box>
                  <RadioButton
                    checked={chosenImage === photo.type}
                    label={photo.label}
                  />
                </Box>
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}

export { QualityPhoto }
