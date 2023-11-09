import React, { FC, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useQuery } from '@apollo/client'
import { GetApplicationInformation } from '../../graphql/queries'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  synchronizeVMSTPeriods,
} from '../../lib/parentalLeaveUtils'
import { FieldBaseProps, RepeaterProps } from '@island.is/application/types'
import { States } from '../../constants'
import PeriodsSectionImage from '../PeriodsSectionImage/PeriodsSectionImage'
import WomanWithLaptopIllustration from '../PeriodsSectionImage/WomanWithLaptopIllustration'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const UploadAdditionalFilesInfoScreen: FC<
  React.PropsWithChildren<ScreenProps>
> = ({ field, application, setRepeaterItems, setFieldLoadingState }) => {
  const { formatMessage } = useLocale()
  const rights = getAvailableRightsInDays(application)
  const { periods } = getApplicationAnswers(application.answers)
  const shouldCall =
    application.state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS

  const { data, loading } = useQuery(GetApplicationInformation, {
    variables: {
      applicationId: application.id,
      nationalId: application.applicant,
      shouldNotCall: !shouldCall,
    },
  })

  useEffect(() => {
    if (loading) {
      return
    }
    synchronizeVMSTPeriods(
      data,
      rights,
      periods,
      setRepeaterItems,
      setFieldLoadingState,
    )
  }, [loading])
  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.attachmentScreen.additionalDocumentRequired,
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
