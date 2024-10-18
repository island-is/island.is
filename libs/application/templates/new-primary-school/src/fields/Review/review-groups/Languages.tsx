import { YES } from '@island.is/application/types'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getLanguageByCode } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Languages = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    nativeLanguage,
    otherLanguagesSpokenDaily,
    otherLanguages,
    icelandicNotSpokenAroundChild,
  } = getApplicationAnswers(application.answers)

  const icelandicSelected =
    nativeLanguage === 'is' || otherLanguages?.includes('is')

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('languages')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.overview.nativeLanguage,
              )}
              value={getLanguageByCode(nativeLanguage)?.name}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <RadioValue
              label={formatMessage(
                newPrimarySchoolMessages.differentNeeds
                  .otherLanguagesSpokenDaily,
              )}
              value={otherLanguagesSpokenDaily}
            />
          </GridColumn>
        </GridRow>
        {otherLanguagesSpokenDaily === YES && (
          <>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.languageTitle,
                  )}
                  value={otherLanguages
                    .map((language) => {
                      return getLanguageByCode(language)?.name
                    })
                    .join(', ')}
                />
              </GridColumn>
            </GridRow>
            {!icelandicSelected &&
              icelandicNotSpokenAroundChild?.includes(YES) && (
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                    <DataValue
                      label={formatMessage(
                        newPrimarySchoolMessages.overview
                          .icelandicSpokenAroundChild,
                      )}
                      value={formatMessage(newPrimarySchoolMessages.shared.no)}
                    />
                  </GridColumn>
                </GridRow>
              )}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
