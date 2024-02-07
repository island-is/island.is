import { useQuery } from '@apollo/client'
import { FieldBaseProps, RepeaterProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'
import { States } from '../../constants'
import { GetApplicationInformation } from '../../graphql/queries'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  synchronizeVMSTPeriods,
} from '../../lib/parentalLeaveUtils'

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
> = ({ application, setRepeaterItems, setFieldLoadingState }) => {
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
  return <Box></Box>
}

export default UploadAdditionalFilesInfoScreen
