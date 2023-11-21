import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'

export const Comment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ comment }] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('comment')}
    >
      <GridRow>
        <GridColumn span={['10/12', '10/12', '10/12', '10/12']}>
          <DataValue
            label={formatMessage(
              oldAgePensionFormMessage.comment.commentSection,
            )}
            value={comment}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
