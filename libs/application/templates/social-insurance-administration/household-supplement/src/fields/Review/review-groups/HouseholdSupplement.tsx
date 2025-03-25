import { ReviewGroup, RadioValue } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/householdSupplementUtils'

export const HouseholdSupplement = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { householdSupplementChildren } = getApplicationAnswers(
    application.answers,
  )

  const { formatMessage } = useLocale()

  return (
    householdSupplementChildren && (
      <ReviewGroup
        isEditable={editable}
        editAction={() => goToScreen?.('householdSupplement')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                householdSupplementFormMessage.info
                  .householdSupplementChildrenBetween18And25,
              )}
              value={householdSupplementChildren}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}
