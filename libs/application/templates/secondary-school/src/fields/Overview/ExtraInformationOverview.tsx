import { FieldBaseProps, YES } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'

export const ExtraInformationOverview: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const showNativeLanguage = !!answers?.extraInformation?.nativeLanguage
  const showHasDisability =
    !!answers?.extraInformation?.hasDisability?.includes(YES)
  const showDisabilityDescription =
    !!answers?.extraInformation?.disabilityDescription
  const showOtherDescription = !!answers?.extraInformation?.otherDescription

  return (
    (showNativeLanguage ||
      showHasDisability ||
      showDisabilityDescription ||
      showOtherDescription) && (
      <Box paddingBottom={4} paddingTop={4}>
        <GridRow>
          <GridColumn span="1/2">
            <Text variant="h4">
              {formatMessage(overview.extraInformation.subtitle)}:
            </Text>
            {showNativeLanguage && (
              <Text>
                {formatMessage(overview.extraInformation.nativeLanguageLabel)}:{' '}
                {answers?.extraInformation?.nativeLanguage}
              </Text>
            )}
            {showHasDisability && (
              <Text>
                {formatMessage(overview.extraInformation.hasDisabilityLabel)}:{' '}
                {formatMessage(overview.extraInformation.hasDisabilityYesValue)}
              </Text>
            )}
            {showDisabilityDescription && (
              <Text>
                {formatMessage(
                  overview.extraInformation.disabilityDescriptionLabel,
                )}
                : {answers?.extraInformation?.disabilityDescription}
              </Text>
            )}
            {showOtherDescription && (
              <Text>
                {formatMessage(overview.extraInformation.otherLabel)}:{' '}
                {answers?.extraInformation?.otherDescription}
              </Text>
            )}
          </GridColumn>
          <GridColumn span="1/2"></GridColumn>
        </GridRow>
      </Box>
    )
  )
}
