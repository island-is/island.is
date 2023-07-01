import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import YourRightsBoxChart from './YourRightsBoxChart'

const ReviewRights: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  return (
    <Box marginY={3} key={field.id}>
      <YourRightsBoxChart application={application} showDisclaimer />
    </Box>
  )
}

export default ReviewRights
