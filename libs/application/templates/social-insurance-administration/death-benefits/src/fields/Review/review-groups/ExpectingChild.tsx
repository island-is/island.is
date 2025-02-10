import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { deathBenefitsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/deathBenefitsUtils'

export const ExpectingChild = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { isExpectingChild } = getApplicationAnswers(application.answers)
  const { formatMessage } = useLocale()

  return (
    isExpectingChild && (
      <ReviewGroup
        isLast
        isEditable={editable}
        editAction={() => goToScreen?.('expectingChild')}
      >
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                deathBenefitsFormMessage.info.expectingChildTitle,
              )}
              value={isExpectingChild}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}
