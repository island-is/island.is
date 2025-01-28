import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getLanguageByCode } from '@island.is/shared/utils'
import { LanguageEnvironmentOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getLanguageEnvironments,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Languages = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    interpreter,
    languageEnvironment,
    language1,
    language2,
    language3,
    language4,
    childLanguage,
    signLanguage,
  } = getApplicationAnswers(application.answers)

  const selectedLanguageEnvironment = getLanguageEnvironments().find(
    (env) => env.value === languageEnvironment,
  )

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('languages')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="12/12">
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.overview.languageEnvironment,
              )}
              value={formatMessage(selectedLanguageEnvironment?.label || '')}
            />
          </GridColumn>
        </GridRow>

        {languageEnvironment === LanguageEnvironmentOptions.ONLY_ICELANDIC ? (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <RadioValue
                label={formatMessage(
                  newPrimarySchoolMessages.differentNeeds.signLanguage,
                )}
                value={signLanguage}
              />
            </GridColumn>
          </GridRow>
        ) : (
          <>
            <GridRow>
              <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .languageSelectionTitle,
                    { no: `${1}` },
                  )}
                  value={getLanguageByCode(language1)?.name}
                />
              </GridColumn>
              {language2 && (
                <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.differentNeeds
                        .languageSelectionTitle,
                      { no: `${2}` },
                    )}
                    value={getLanguageByCode(language2)?.name}
                  />
                </GridColumn>
              )}
            </GridRow>
            <GridRow>
              {language3 && (
                <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.differentNeeds
                        .languageSelectionTitle,
                      { no: `${3}` },
                    )}
                    value={getLanguageByCode(language3)?.name}
                  />
                </GridColumn>
              )}
              {language4 && (
                <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.differentNeeds
                        .languageSelectionTitle,
                      { no: `${4}` },
                    )}
                    value={getLanguageByCode(language4)?.name}
                  />
                </GridColumn>
              )}
            </GridRow>
            {childLanguage && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.overview.childLanguage,
                    )}
                    value={getLanguageByCode(childLanguage)?.name}
                  />
                </GridColumn>
              </GridRow>
            )}
            <GridRow>
              <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.interpreter,
                  )}
                  value={interpreter}
                />
              </GridColumn>

              <GridColumn span={['12/12', '6/12', '6/12', '6/12']}>
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds.signLanguage,
                  )}
                  value={signLanguage}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
