import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicantOverview } from './ApplicantOverview'
import { CustodianOverview } from './CustodianOverview'
import { SchoolSelectionOverview } from './SchoolSelectionOverview'
import { ExtraInformationOverview } from './ExtraInformationOverview'

export const Overview: FC<FieldBaseProps> = (props) => {
  return (
    <Box>
      <ApplicantOverview {...props} />

      <CustodianOverview {...props} />

      <SchoolSelectionOverview {...props} />

      <ExtraInformationOverview {...props} />
    </Box>
  )
}
