import { YES } from '@island.is/application/core'
import { RadioValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Photography = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { photographyConsent, photoSchoolPublication, photoMediaPublication } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('photography')}
      isLast={true}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="9/12">
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds.photographyConsent,
              )}
              value={photographyConsent}
            />
          </GridColumn>
        </GridRow>
        {photographyConsent === YES && (
          <>
            <GridRow>
              <GridColumn span="9/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .photoSchoolPublication,
                  )}
                  value={photoSchoolPublication}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="9/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .photoMediaPublication,
                  )}
                  value={photoMediaPublication}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
