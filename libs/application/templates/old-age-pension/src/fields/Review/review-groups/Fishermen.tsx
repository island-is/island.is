import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const Fishermen = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ isFishermen }, setStateful] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup>
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.fishermen)}
            value={isFishermen}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
