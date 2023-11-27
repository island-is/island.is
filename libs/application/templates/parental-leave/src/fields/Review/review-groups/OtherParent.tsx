import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  MANUAL,
  NO,
  ParentalRelations,
  SINGLE,
  SPOUSE,
} from '../../../constants'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import {
  getOtherParentId,
  getOtherParentName,
  getSelectedChild,
  requiresOtherParentApproval,
} from '../../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../..'
import { format as formatKennitala } from 'kennitala'
import { ReviewGroupProps } from './props'

export const OtherParent = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [{ otherParent, otherParentEmail, otherParentPhoneNumber }] =
    useStatefulAnswers(application)

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
      editAction={() => goToScreen?.('otherParentObj')}
    >
      {(otherParent === NO || otherParent === SINGLE) && (
        <RadioValue
          label={formatMessage(
            parentalLeaveFormMessages.shared.otherParentTitle,
          )}
          value={NO}
        />
      )}

      {otherParent === SPOUSE && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentName,
              )}
              value={otherParentName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentID,
              )}
              value={formatKennitala(otherParentId!)}
            />
          </GridColumn>
        </GridRow>
      )}

      {otherParent === MANUAL && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentName,
              )}
              value={otherParentName}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentID,
              )}
              value={
                otherParentId ? formatKennitala(otherParentId) : otherParentId
              }
            />
          </GridColumn>
        </GridRow>
      )}
      {otherParentWillApprove && (
        <GridRow marginTop={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.otherParentEmailSubSection,
              )}
              value={otherParentEmail}
            />
          </GridColumn>
          {otherParentPhoneNumber && (
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared
                    .otherParentPhoneNumberSubSection,
                )}
                value={formatPhoneNumber(otherParentPhoneNumber)}
              />
            </GridColumn>
          )}
        </GridRow>
      )}
    </ReviewGroup>
  )
}
