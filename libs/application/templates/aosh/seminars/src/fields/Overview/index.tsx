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
  getPaymentArrangementForOverview,
  getPersonalInformationForOverview,
  getSeminarInformationForOverview,
  isApplyingForMultiple,
} from '../../utils'
import { ParticipantsOverviewExpandableTable } from '../Components/ParticipantsOverviewExpandableTable'
import { getValueViaPath } from '@island.is/application/core'
import { Participant } from '../../shared/types'

export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, goToScreen } = props
  const { formatMessage } = useLocale()

  const userIsApplyingForMultiple = isApplyingForMultiple(application.answers)

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <Box>
      <ReviewGroup title={formatMessage(overview.labels.seminar)} isFirst>
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getSeminarInformationForOverview(
              application.externalData,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      <ReviewGroup title={formatMessage(overview.labels.personalInfo)}>
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getPersonalInformationForOverview(
              application.answers,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      <ReviewGroup
        handleClick={
          userIsApplyingForMultiple
            ? () => onClick('paymentArrangementMultiField')
            : undefined
        }
        editMessage={
          userIsApplyingForMultiple
            ? formatMessage(overview.labels.editMessage)
            : ''
        }
        title={formatMessage(overview.labels.paymentArrangement)}
      >
        <KeyValueFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.KEY_VALUE,
            component: FieldComponents.KEY_VALUE,
            title: '',
            label: '',
            value: getPaymentArrangementForOverview(
              application.answers,
              formatMessage,
            ),
          }}
        />
      </ReviewGroup>

      {userIsApplyingForMultiple && (
        <ReviewGroup
          handleClick={() => onClick('participantsMultiField')}
          editMessage={formatMessage(overview.labels.editMessage)}
          title={formatMessage(overview.labels.participants)}
          isLast
        >
          <ParticipantsOverviewExpandableTable
            data={
              getValueViaPath<Participant[]>(
                application.answers,
                'participantList',
              ) ?? []
            }
          />
        </ReviewGroup>
      )}
    </Box>
  )
}
