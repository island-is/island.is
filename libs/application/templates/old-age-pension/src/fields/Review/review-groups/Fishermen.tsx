import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { ApplicationType, NO, YES } from '../../../lib/constants'

export const Fishermen = ({ application }: ReviewGroupProps) => {
  const [{ applicationType }] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup>
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(oldAgePensionFormMessage.review.fishermen)}
            value={
              applicationType === ApplicationType.SAILOR_PENSION ? YES : NO
            }
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
