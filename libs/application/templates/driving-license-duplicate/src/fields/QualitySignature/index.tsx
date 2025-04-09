import React, { FC } from 'react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualitySignature } from './useQualitySignature'

interface QualitySignatureData {
  qualitySignature: string | null
  application: Application
}

export const Signature: FC<React.PropsWithChildren<QualitySignatureData>> = ({
  qualitySignature,
}: QualitySignatureData) => {
  const { formatMessage } = useLocale()

  if (!qualitySignature) {
    return null
  }

  const src = qualitySignature
  return (
    <img
      alt={formatMessage(m.qualityPhotoAltText)}
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
    <Box marginTop={2}>
      {qualitySignature ? img : <SkeletonLoader height={242} width={191} />}
    </Box>
  )
}

export { QualitySignature }
