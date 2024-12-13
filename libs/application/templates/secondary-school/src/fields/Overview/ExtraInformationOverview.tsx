import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes } from '../../lib/constants'

export const ExtraInformationOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const showNativeLanguage = !!answers?.extraInformation?.nativeLanguage
  const showOtherDescription = !!answers?.extraInformation?.otherDescription
  const showSupportingDocuments =
    !!answers?.extraInformation?.supportingDocuments?.length

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    (showNativeLanguage || showOtherDescription || showSupportingDocuments) && (
      <>
        <Divider />
        <ReviewGroup
          handleClick={() => onClick(Routes.EXTRA_INFORMATION)}
          editMessage={formatMessage(overview.general.editMessage)}
          title={formatMessage(overview.extraInformation.subtitle)}
          isLast
        >
          <Box>
            <GridRow>
              <GridColumn>
                {/* Native language */}
                {showNativeLanguage && (
                  <Text>
                    {formatMessage(
                      overview.extraInformation.nativeLanguageLabel,
                    )}
                    : {answers?.extraInformation?.nativeLanguage}
                  </Text>
                )}

                {/* Other description */}
                {showOtherDescription && (
                  <Text>
                    {formatMessage(overview.extraInformation.otherLabel)}:{' '}
                    {answers?.extraInformation?.otherDescription}
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
                {answers?.extraInformation?.supportingDocuments?.map(
                  (attachment) => {
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
                  },
                )}
              </GridColumn>
            </GridRow>
          </Box>
        </ReviewGroup>
      </>
    )
  )
}
