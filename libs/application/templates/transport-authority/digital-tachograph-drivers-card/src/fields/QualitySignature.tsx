import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { applicant } from '../lib/messages'
import { useLocale } from '@island.is/localization'

export const QualitySignature: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const src = getValueViaPath(
    application.externalData,
    'qualityPhotoAndSignature.data.signatureDataUri',
    '',
  ) as string

  return (
    <Box marginTop={4} marginBottom={3} width="full">
      <img
        alt={
          formatText(
            applicant.labels.userInformation.qualitySignatureAltText,
            application,
            formatMessage,
          ) || ''
        }
        src={src}
        id="mySignature"
      />
    </Box>
  )
}
