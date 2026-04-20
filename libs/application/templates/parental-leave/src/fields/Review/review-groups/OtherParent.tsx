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
  getApplicationExternalData,
  getOtherParentId,
  getOtherParentName,
  getSelectedChild,
  requiresOtherParentApproval,
} from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { NO } from '@island.is/application/core'

export const OtherParent = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { otherParent, otherParentEmail, otherParentPhoneNumber } =
    getApplicationAnswers(application.answers)
  const { VMSTOtherParent } = getApplicationExternalData(
    application.externalData,
  )

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  const isPrimaryParent =
    selectedChild?.parentalRelation === ParentalRelations.primary

  const otherParentName = getOtherParentName(application)
  const otherParentId = getOtherParentId(application)
  const otherParentWillApprove = requiresOtherParentApproval(
    application.answers,
    application.externalData,
  )

  return (
    <ReviewGroup
      isEditable={editable && isPrimaryParent}
      editAction={() =>
        goToScreen?.(
          otherParent === SPOUSE ? 'otherParentSpouse' : 'otherParentObj',
        )
      }
    >
      <Stack space={2}>
        {(otherParent === NO || otherParent === SINGLE) &&
          !VMSTOtherParent.otherParentId && (
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentTitle,
              )}
              value={NO}
            />
          )}
        {(otherParent === SPOUSE ||
          otherParent === MANUAL ||
          VMSTOtherParent.otherParentId) && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentName,
                )}
                value={
                  VMSTOtherParent?.otherParentName ?? otherParentName ?? ''
                }
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.otherParentID,
                )}
                value={
                  VMSTOtherParent?.otherParentId
                    ? formatKennitala(VMSTOtherParent.otherParentId)
                    : otherParentId
                    ? formatKennitala(otherParentId)
                    : ''
                }
              />
            </GridColumn>
          </GridRow>
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
