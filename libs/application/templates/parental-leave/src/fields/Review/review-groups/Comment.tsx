import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'

export const Comment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { comment } = getApplicationAnswers(application.answers)
  const { formatMessage } = useLocale()

  return (
    comment && (
      <ReviewGroup
        isLast
        isEditable={editable}
        editAction={() => goToScreen?.('comment')}
      >
        <GridRow>
          <GridColumn span={['10/12', '10/12', '10/12', '10/12']}>
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentSection,
              )}
              value={comment ?? ''}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}
