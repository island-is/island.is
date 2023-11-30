import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/householdSupplementUtils'

export const Comment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { comment } = getApplicationAnswers(application.answers)
  const { formatMessage } = useLocale()

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {comment && (
        <ReviewGroup
          isLast
          isEditable={editable}
          editAction={() => goToScreen?.('comment')}
        >
          <GridRow>
            <GridColumn span={['10/12', '10/12', '10/12', '10/12']}>
              <DataValue
                label={formatMessage(
                  householdSupplementFormMessage.comment.commentSection,
                )}
                value={comment}
              />
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
    </>
  )
}
