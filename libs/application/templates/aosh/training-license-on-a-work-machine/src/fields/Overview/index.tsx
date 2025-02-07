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
import {
  getAssigneeInformation,
  getApplicantInformation,
  isContractor,
} from '../../utils'
import { getMachineTenureInformation } from '../../utils/getMachineTenureInformation'

type HideActionButtons = {
  field: {
    props: {
      hideActionButtons?: boolean
    }
  }
}

export const Overview: FC<
  React.PropsWithChildren<FieldBaseProps & HideActionButtons>
> = ({ ...props }) => {
  const { application, goToScreen, field } = props
  const { hideActionButtons } = field.props
  const { formatMessage } = useLocale()

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup
        handleClick={() => onClick('informationMultiField')}
        editMessage={
          hideActionButtons
            ? undefined
            : formatMessage(overview.labels.editMessage)
        }
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

      <ReviewGroup
        handleClick={() => onClick('certificateOfTenureMultiField')}
        editMessage={
          hideActionButtons
            ? undefined
            : formatMessage(overview.labels.editMessage)
        }
        title={formatMessage(overview.labels.machineTenure)}
        isLast={isContractor(application.answers)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getMachineTenureInformation(
              application.answers,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      {!isContractor(application.answers) && (
        <ReviewGroup
          handleClick={() => onClick('assigneeInformationMultiField')}
          editMessage={
            hideActionButtons
              ? undefined
              : formatMessage(overview.labels.editMessage)
          }
          title={formatMessage(overview.labels.assignee)}
          isLast
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
      )}
    </Box>
  )
}
