import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { pensionSupplementFormMessage } from '../../lib/messages'
import { FieldBaseProps, RepeaterProps } from '@island.is/application/types'
import PeriodsSectionImage from '../PeriodsSectionImage/PeriodsSectionImage'
import WomanWithLaptopIllustration from '../../assets/Images/WomanWithLaptopIllustration'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const UploadAdditionalFilesInfoScreen: FC<ScreenProps> = ({
  field,
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          pensionSupplementFormMessage.fileUpload.additionalDocumentRequired,
        )}
      />
      <PeriodsSectionImage
        field={field}
        application={application}
        alignItems={'center'}
      >
        <WomanWithLaptopIllustration />
      </PeriodsSectionImage>
    </Box>
  )
}

export default UploadAdditionalFilesInfoScreen
