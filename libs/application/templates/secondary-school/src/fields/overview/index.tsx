import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicantOverview } from './ApplicantOverview'
import { CustodianOverview } from './CustodianOverview'
import { SchoolSelectionOverview } from './SchoolSelectionOverview'
import { ExtraInformationOverview } from './ExtraInformationOverview'
import { applicationDataHasBeenPruned, States } from '../../utils'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'

export const Overview: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()

  return applicationDataHasBeenPruned(props.application.answers) ? (
    <Box>
      {props.application.state === States.SUBMITTED &&
        formatMessage(overview.applicationDataHasBeenPruned.submitted)}
      {props.application.state === States.IN_REVIEW &&
        formatMessage(overview.applicationDataHasBeenPruned.inReview)}
      {props.application.state === States.COMPLETED &&
        formatMessage(overview.applicationDataHasBeenPruned.completed)}
    </Box>
  ) : (
    <Box>
      <ApplicantOverview {...props} />

      <CustodianOverview {...props} />

      <SchoolSelectionOverview {...props} />

      <ExtraInformationOverview {...props} />
    </Box>
  )
}
