import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { NO, YES, parentalLeaveFormMessages } from '../../..'
import { GridColumn, GridRow } from '@island.is/island-ui/core'

export const PersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [{ usePersonalAllowance, personalUseAsMuchAsPossible, personalUsage }] =
    useStatefulAnswers(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowance')}
    >
      <GridRow marginBottom={2}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.personalAllowance.title,
            )}
            value={usePersonalAllowance}
          />
        </GridColumn>

        {usePersonalAllowance === YES && personalUseAsMuchAsPossible === YES && (
          <GridColumn
            paddingTop={[2, 2, 2, 0]}
            span={['12/12', '12/12', '12/12', '5/12']}
          >
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.reviewScreen.usePersonalAllowance,
              )}
              value={personalUseAsMuchAsPossible}
            />
          </GridColumn>
        )}

        {usePersonalAllowance === YES && personalUseAsMuchAsPossible === NO && (
          <GridColumn
            paddingTop={[2, 2, 2, 0]}
            span={['12/12', '12/12', '12/12', '5/12']}
          >
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.allowanceUsage,
              )}
              value={`${personalUsage ?? 0}%`}
            />
          </GridColumn>
        )}
      </GridRow>
    </ReviewGroup>
  )
}
