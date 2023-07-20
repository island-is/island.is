import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { pensionSupplementFormMessage } from '../../../lib/messages'
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {comment && (
        <ReviewGroup
          isEditable={editable}
          editAction={() => goToScreen?.('comment')}
        >
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  pensionSupplementFormMessage.additionalInfo.commentSection,
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
