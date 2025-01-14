import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ReviewGroup } from '../Components/ReviewGroup'
import { KeyValueFormField } from '@island.is/application/ui-fields'
import { overview } from '../../lib/messages'
import { getAssigneeInformation, getApplicantInformation } from '../../utils'
// import { ParticipantsOverviewExpandableTable } from '../Components/ParticipantsOverviewExpandableTable'
// import { getValueViaPath } from '@island.is/application/core'
// import { Participant } from '../../shared/types'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, goToScreen } = props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('importerInformationMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
        title={formatMessage(overview.labels.applicant)}
        isFirst
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getApplicantInformation(application.answers, formatMessage),
          }}
        />
      </ReviewGroup>

      {/* <ReviewGroup title={formatMessage(overview.labels.machineTenure)}>
        <ParticipantsOverviewExpandableTable
          data={
            getValueViaPath<Participant[]>(
              application.answers,
              'participantList',
            ) ?? []
          }
        />
      </ReviewGroup> */}

      <ReviewGroup
        handleClick={() => onClick('assigneeInformationMultiField')}
        editMessage={formatMessage(overview.labels.editMessage)}
        title={formatMessage(overview.labels.assignee)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getAssigneeInformation(application.answers, formatMessage),
          }}
        />
      </ReviewGroup>
    </Box>
  )
}
