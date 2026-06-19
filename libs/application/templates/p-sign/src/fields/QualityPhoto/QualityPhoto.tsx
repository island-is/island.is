import { FC } from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './hooks/useQualityPhoto'

interface QualityPhotoData {
  qualityPhoto: string | null
  application: Application
}

// Called as a plain function (`Photo({...})`), so it needs an explicit return type: under
// @types/react 19 an FC's call signature returns promise-inclusive `ReactNode`, which no
// longer fits the `ReactNode` slot where `img` is rendered.
const Photo = ({
  qualityPhoto,
  application,
}: QualityPhotoData): React.ReactElement | null => {
  const { formatMessage } = useLocale()

  if (!qualityPhoto) {
    return null
  }

  const src = qualityPhoto
  return (
    <img
      alt={formatText(m.qualityPhotoAltText, application, formatMessage) || ''}
      src={src}
      id="myimage"
    />
  )
}

const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { qualityPhoto } = useQualityPhoto(application)
  const img = Photo({ qualityPhoto, application })
  return (
    <Box
      marginTop={4}
      marginBottom={3}
      style={{ width: '191px', height: '242px' }}
    >
      {qualityPhoto ? img : <SkeletonLoader height={242} width={191} />}
    </Box>
  )
}

export { QualityPhoto }
