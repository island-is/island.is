import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes, checkIsEditable, checkUseAnswersCopy } from '../../utils'
import { getLanguageByCode } from '@island.is/shared/utils'
import { getValueViaPath } from '@island.is/application/core'

export const ExtraInformationOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const useAnswersCopy = checkUseAnswersCopy(application)
  const copyPrefix = useAnswersCopy ? 'copy.' : ''

  const extraInformation = getValueViaPath<
    SecondarySchoolAnswers['extraInformation']
  >(application.answers, copyPrefix + 'extraInformation')

  const showNativeLanguage = !!extraInformation?.nativeLanguageCode
  const showOtherDescription = !!extraInformation?.otherDescription
  const showSupportingDocuments =
    !!extraInformation?.supportingDocuments?.length

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const getLanguageName = (code: string | undefined | null): string => {
    if (!code) return ''
    const language = getLanguageByCode(code)
    return language?.name || ''
  }

  const isEditable = checkIsEditable(application.state)

  return (
    (showNativeLanguage || showOtherDescription || showSupportingDocuments) && (
      <ReviewGroup
        handleClick={() => onClick(Routes.EXTRA_INFORMATION)}
        editMessage={formatMessage(overview.general.editMessage)}
        title={formatMessage(overview.extraInformation.subtitle)}
        isEditable={isEditable}
      >
        <Box>
          <GridRow>
            <GridColumn>
              {/* Native language */}
              {showNativeLanguage && (
                <Text>
                  {formatMessage(overview.extraInformation.nativeLanguageLabel)}
                  : {getLanguageName(extraInformation?.nativeLanguageCode)}
                </Text>
              )}

              {/* Other description */}
              {showOtherDescription && (
                <Text>
                  {formatMessage(overview.extraInformation.otherLabel)}:{' '}
                  {extraInformation?.otherDescription}
                </Text>
              )}

              {/* Supporting documents */}
              {showSupportingDocuments && (
                <Text>
                  {formatMessage(
                    overview.extraInformation.supportingDocumentsLabel,
                  )}
                  :
                </Text>
              )}
              {extraInformation?.supportingDocuments?.map((attachment) => {
                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    marginBottom="smallGutter"
                  >
                    <Box marginRight={1} display="flex" alignItems="center">
                      <Icon
                        color="blue400"
                        icon="document"
                        size="small"
                        type="outline"
                      />
                    </Box>
                    <Text>{attachment.name}</Text>
                  </Box>
                )
              })}
            </GridColumn>
          </GridRow>
        </Box>
      </ReviewGroup>
    )
  )
}
