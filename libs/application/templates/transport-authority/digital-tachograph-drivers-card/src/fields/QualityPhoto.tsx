import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { applicant } from '../lib/messages'
import { useLocale } from '@island.is/localization'

export const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const src = getValueViaPath(
    application.externalData,
    'qualityPhotoAndSignature.data.photoDataUri',
    '',
  ) as string

  return (
    <Box
      marginTop={4}
      marginBottom={3}
      style={{ width: '191px', height: '242px' }}
    >
      <img
        alt={
          formatText(
            applicant.labels.userInformation.qualityPhotoAltText,
            application,
            formatMessage,
          ) || ''
        }
        src={src}
        id="myimage"
      />
    </Box>
  )
}
