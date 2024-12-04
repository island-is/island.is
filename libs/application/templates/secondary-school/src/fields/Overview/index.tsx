import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantOverview } from './ApplicantOverview'
import { CustodianOverview } from './CustodianOverview'
import { SupportingDocumentsOverview } from './SupportingDocumentsOverview'
import { SchoolSelectionOverview } from './SchoolSelectionOverview'
import { SecondarySchoolAnswers } from '../..'
import { ExtraInformationOverview } from './ExtraInformationOverview'
import { ReviewGroup } from '../../components/ReviewGroup'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const Overview: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('applicant')}
        editMessage={formatMessage(overview.general.editMessage)}
        title={formatMessage(overview.applicant.subtitle)}
        isFirst
      >
        <ApplicantOverview field={field} application={application} />
      </ReviewGroup>

      <Divider />

      <CustodianOverview field={field} application={application} />

      <Divider />

      {!!answers.supportingDocuments?.attachments?.length && (
        <SupportingDocumentsOverview field={field} application={application} />
      )}

      {!!answers.supportingDocuments?.attachments?.length && <Divider />}

      <SchoolSelectionOverview field={field} application={application} />

      <Divider />

      <ExtraInformationOverview field={field} application={application} />
    </Box>
  )
}
