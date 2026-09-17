import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { MANUAL, ParentalRelations, SINGLE, SPOUSE } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getOtherParentId,
  getOtherParentName,
  getSelectedChild,
  requiresOtherParentApproval,
} from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { NO, YES } from '@island.is/application/core'

export const OtherParent = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    otherParent,
    otherParentEmail,
    otherParentPhoneNumber,
    otherParentRightOfAccess,
    otherParentName: otherParentNameFromAnswers,
    otherParentId: otherParentIdFromAnswers,
  } = getApplicationAnswers(application.answers)

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const otherParentName =
    getOtherParentName(application) || otherParentNameFromAnswers
  const otherParentId =
    getOtherParentId(application) || otherParentIdFromAnswers

  const otherParentWillApprove = requiresOtherParentApproval(
    application.answers,
    application.externalData,
  )

  return (
    <ReviewGroup
      isEditable={editable && isPrimaryParent && otherParent !== SINGLE}
      editAction={() =>
        goToScreen?.(
          otherParent === SPOUSE ? 'otherParentSpouse' : 'otherParentObj',
        )
      }
    >
      <Stack space={2}>
        {(otherParent === NO || otherParent === SINGLE) && (
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.shared.otherParentTitle,
            )}
            value={NO}
          />
        )}
        {(otherParent === SPOUSE || otherParent === MANUAL) && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentName,
                )}
                value={otherParentName || ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentID,
                )}
                value={otherParentId ? formatKennitala(otherParentId) : ''}
              />
            </GridColumn>
          </GridRow>
        )}
        {otherParent === MANUAL && otherParentRightOfAccess && (
          <DataValue
            label={formatMessage(parentalLeaveFormMessages.rightOfAccess.title)}
            value={
              otherParentRightOfAccess === YES
                ? formatMessage(
                    parentalLeaveFormMessages.rightOfAccess.yesOption,
                  )
                : formatMessage(
                    parentalLeaveFormMessages.rightOfAccess.noOption,
                  )
            }
          />
        )}
        {otherParentWillApprove && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentEmailSubSection,
                )}
                value={otherParentEmail ?? ''}
              />
            </GridColumn>
            {otherParentPhoneNumber && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared
                      .otherParentPhoneNumberSubSection,
                  )}
                  value={formatPhoneNumber(otherParentPhoneNumber) ?? ''}
                />
              </GridColumn>
            )}
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
