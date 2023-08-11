import React, { FC } from 'react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualitySignature } from './hooks/useQualitySignature'

interface QualitySignatureData {
  qualitySignature: string | null
  application: Application
}

const Signature: FC<React.PropsWithChildren<QualitySignatureData>> = ({
  qualitySignature,
  application,
}: QualitySignatureData) => {
  const { formatMessage } = useLocale()

  if (!qualitySignature) {
    return null
  }

  const src = qualitySignature
  return (
    <img
      // TODO: UPDATE ALT
      alt={formatText(m.qualityPhotoAltText, application, formatMessage) || ''}
      src={src}
      id="mySignature"
    />
  )
}

const QualitySignature: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { qualitySignature } = useQualitySignature(application)
  const img = Signature({ qualitySignature, application })
  return (
    <Box marginTop={4} marginBottom={3} width="full">
      {qualitySignature ? img : <SkeletonLoader height={242} width={191} />}
    </Box>
  )
}

export { QualitySignature }
