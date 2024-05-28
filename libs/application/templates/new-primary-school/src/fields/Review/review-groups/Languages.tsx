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
  const { otherLanguages, languages } = getApplicationAnswers(
    application.answers,
  )

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('languages')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
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
            {/* TODO: Á ég að bæta við 'Það er ekki töluð íslenska í nærumhverfi barnsins' spurningunni hérna? */}
            {/* <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.languageTitle,
                  )}
                  value={languages}
                />
              </GridColumn>
            </GridRow> */}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
