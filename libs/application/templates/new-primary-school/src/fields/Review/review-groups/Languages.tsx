import { YES } from '@island.is/application/types'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Languages = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { otherLanguages, languages, icelandicNotSpokenAroundChild } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('languages')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds.languageQuestion,
              )}
              value={otherLanguages}
            />
          </GridColumn>
        </GridRow>
        {otherLanguages === YES && (
          <>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.languageTitle,
                  )}
                  value={languages}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.confirm.icelandicSpokenAroundChild,
                  )}
                  value={formatMessage(
                    icelandicNotSpokenAroundChild?.includes(YES)
                      ? newPrimarySchoolMessages.shared.no
                      : newPrimarySchoolMessages.shared.yes,
                  )}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
