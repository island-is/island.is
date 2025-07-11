import { coreErrorMessages } from '@island.is/application/core'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getLanguageByCode } from '@island.is/shared/utils'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { LanguageEnvironmentOptions, OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Languages = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
  } = getApplicationAnswers(application.answers)

  const {
    options: languageEnvironmentOptions,
    loading,
    error,
  } = useFriggOptions(OptionsType.LANGUAGE_ENVIRONMENT)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('languages')}
    >
      {loading ? (
        <SkeletonLoader height={40} width="80%" borderRadius="large" />
      ) : (
        <Stack space={2}>
          <GridRow>
            <GridColumn span="12/12">
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.overview.languageEnvironment,
                )}
                value={
                  getSelectedOptionLabel(
                    languageEnvironmentOptions,
                    languageEnvironment,
                  ) || ''
                }
                error={
                  error
                    ? formatMessage(coreErrorMessages.failedDataProvider)
                    : undefined
                }
              />
            </GridColumn>
          </GridRow>
          {languageEnvironment !==
            LanguageEnvironmentOptions.ONLY_ICELANDIC && (
            <>
              <GridRow rowGap={2}>
                {selectedLanguages?.map(
                  ({ code }, index) =>
                    code && (
                      <GridColumn
                        key={`${code}-${index}`}
                        span={['12/12', '5/12', '5/12', '5/12']}
                      >
                        <DataValue
                          label={formatMessage(
                            newPrimarySchoolMessages.differentNeeds
                              .languageSelectionTitle,
                            { index: `${index + 1}` },
                          )}
                          value={getLanguageByCode(code)?.name}
                        />
                      </GridColumn>
                    ),
                )}
              </GridRow>
              {preferredLanguage && (
                <GridRow>
                  <GridColumn span="12/12">
                    <DataValue
                      label={formatMessage(
                        newPrimarySchoolMessages.overview.preferredLanguage,
                      )}
                      value={getLanguageByCode(preferredLanguage)?.name}
                    />
                  </GridColumn>
                </GridRow>
              )}
            </>
          )}
          <GridRow rowGap={2}>
            <GridColumn span="12/12">
              <RadioValue
                label={formatMessage(
                  newPrimarySchoolMessages.differentNeeds.signLanguage,
                )}
                value={signLanguage}
              />
            </GridColumn>
          </GridRow>
        </Stack>
      )}
    </ReviewGroup>
  )
}
