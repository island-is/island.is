import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import {
  getTranslatedProgram,
  Routes,
  checkIsEditable,
  checkUseAnswersCopy,
} from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath, YES } from '@island.is/application/core'

export const SchoolSelectionOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, lang } = useLocale()

  const useAnswersCopy = checkUseAnswersCopy(application)
  const copyPrefix = useAnswersCopy ? 'copy.' : ''

  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    application.answers,
    copyPrefix + 'selection',
  )

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const isEditable = checkIsEditable(application.state)

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.SCHOOL)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(overview.selection.subtitle)}
      isEditable={isEditable}
    >
      <Box>
        <GridRow>
          {/* First selection */}
          <GridColumn span={selection?.[1]?.school?.id ? '1/2' : '1/1'}>
            {!!selection?.[1]?.school?.id && (
              <Text variant="h5">
                {formatMessage(overview.selection.firstSubtitle)}
              </Text>
            )}
            <Text>{selection?.[0]?.school?.name}</Text>
            <Text>
              {formatMessage(overview.selection.firstProgramLabel)}:{' '}
              {getTranslatedProgram(lang, selection?.[0]?.firstProgram)}
            </Text>
            {!!selection?.[0]?.secondProgram?.id && (
              <Text>
                {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                {getTranslatedProgram(lang, selection?.[0]?.secondProgram)}
              </Text>
            )}
            {!!selection?.[0]?.thirdLanguage?.code && (
              <Text>
                {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                {selection?.[0]?.thirdLanguage?.name}
              </Text>
            )}
            {!!selection?.[0]?.nordicLanguage?.code && (
              <Text>
                {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                {selection?.[0]?.nordicLanguage?.name}
              </Text>
            )}
            {!!selection?.[0]?.requestDormitory?.includes(YES) && (
              <Text>
                {formatMessage(overview.selection.requestDormitoryLabel)}:{' '}
                {formatMessage(overview.selection.yesValue)}
              </Text>
            )}
          </GridColumn>

          {/* Second selection */}
          {!!selection?.[1]?.school?.id && (
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(overview.selection.secondSubtitle)}
              </Text>
              <Text>{selection?.[1]?.school?.name}</Text>
              <Text>
                {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                {getTranslatedProgram(lang, selection?.[1]?.firstProgram)}
              </Text>
              {!!selection?.[1]?.secondProgram?.id && (
                <Text>
                  {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                  {getTranslatedProgram(lang, selection?.[1]?.secondProgram)}
                </Text>
              )}
              {!!selection?.[1]?.thirdLanguage?.code && (
                <Text>
                  {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                  {selection?.[1]?.thirdLanguage?.name}
                </Text>
              )}{' '}
              {!!selection?.[1]?.nordicLanguage?.code && (
                <Text>
                  {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                  {selection?.[1]?.nordicLanguage?.name}
                </Text>
              )}
              {!!selection?.[1]?.requestDormitory?.includes(YES) && (
                <Text>
                  {formatMessage(overview.selection.requestDormitoryLabel)}:{' '}
                  {formatMessage(overview.selection.yesValue)}
                </Text>
              )}
            </GridColumn>
          )}

          {/* Third selection */}
          {!!selection?.[2]?.school?.id && (
            <Box marginTop={2}>
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.selection.thirdSubtitle)}
                </Text>
                <Text>{selection?.[2]?.school?.name}</Text>
                <Text>
                  {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                  {getTranslatedProgram(lang, selection?.[2]?.firstProgram)}
                </Text>
                {!!selection?.[2]?.secondProgram?.id && (
                  <Text>
                    {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                    {getTranslatedProgram(lang, selection?.[2]?.secondProgram)}
                  </Text>
                )}
                {!!selection?.[2]?.thirdLanguage?.code && (
                  <Text>
                    {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                    {selection?.[2]?.thirdLanguage?.name}
                  </Text>
                )}
                {!!selection?.[2]?.nordicLanguage?.code && (
                  <Text>
                    {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                    {selection?.[2]?.nordicLanguage?.name}
                  </Text>
                )}
                {!!selection?.[2]?.requestDormitory?.includes(YES) && (
                  <Text>
                    {formatMessage(overview.selection.requestDormitoryLabel)}:{' '}
                    {formatMessage(overview.selection.yesValue)}
                  </Text>
                )}
              </GridColumn>
              <GridColumn span="1/2"></GridColumn>
            </Box>
          )}
        </GridRow>
      </Box>
    </ReviewGroup>
  )
}
