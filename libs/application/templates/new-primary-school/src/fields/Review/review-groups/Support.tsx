import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Support = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { developmentalAssessment, specialSupport, requestMeeting } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('support')}
      isLast={true}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="9/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds.developmentalAssessment,
              )}
              value={developmentalAssessment}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="9/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds.specialSupport,
              )}
              value={specialSupport}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="9/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds
                  .requestMeetingDescription,
              )}
              value={requestMeeting}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
