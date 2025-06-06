import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getApplicationAnswers } from '../../../utils/medicalAndRehabilitationPaymentsUtils'
import { ReviewGroupProps } from './props'

export const Comment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { comment } = getApplicationAnswers(application.answers)

  return (
    comment && (
      <ReviewGroup
        isLast
        isEditable={editable}
        editAction={() => goToScreen?.('comment')}
      >
        <GridRow>
          <GridColumn span="10/12">
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentSection,
              )}
              value={comment}
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}
