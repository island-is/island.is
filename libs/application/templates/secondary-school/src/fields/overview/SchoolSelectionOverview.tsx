import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import { getTranslatedProgram, Routes, States } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'

export const SchoolSelectionOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, lang } = useLocale()

  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    application.answers,
    'selection',
  )

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.SCHOOL)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(overview.selection.subtitle)}
      isEditable={application.state === States.DRAFT}
    >
      <Box>
        <GridRow>
          {/* First selection */}
          <GridColumn span={selection?.second?.include ? '1/2' : '1/1'}>
            {selection?.second?.include && (
              <Text variant="h5">
                {formatMessage(overview.selection.firstSubtitle)}
              </Text>
            )}
            <Text>{selection?.first?.school?.name}</Text>
            <Text>
              {formatMessage(overview.selection.firstProgramLabel)}:{' '}
              {getTranslatedProgram(lang, selection?.first?.firstProgram)}
            </Text>
            {!!selection?.first?.secondProgram?.include &&
              !!selection?.first?.secondProgram?.id && (
                <Text>
                  {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                  {getTranslatedProgram(lang, selection?.first?.secondProgram)}
                </Text>
              )}
            {!!selection?.first?.thirdLanguage?.code && (
              <Text>
                {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                {selection?.first?.thirdLanguage?.name}
              </Text>
            )}
            {!!selection?.first?.nordicLanguage?.code && (
              <Text>
                {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                {selection?.first?.nordicLanguage?.name}
              </Text>
            )}
          </GridColumn>

          {/* Second selection */}
          {selection?.second?.include && (
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(overview.selection.secondSubtitle)}
              </Text>
              <Text>{selection?.second?.school?.name}</Text>
              <Text>
                {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                {getTranslatedProgram(lang, selection?.second?.firstProgram)}
              </Text>
              {!!selection?.second?.secondProgram?.include &&
                !!selection?.second?.secondProgram?.id && (
                  <Text>
                    {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                    {getTranslatedProgram(
                      lang,
                      selection?.second?.secondProgram,
                    )}
                  </Text>
                )}
              {!!selection?.second?.thirdLanguage?.code && (
                <Text>
                  {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                  {selection?.second?.thirdLanguage?.name}
                </Text>
              )}{' '}
              {!!selection?.second?.nordicLanguage?.code && (
                <Text>
                  {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                  {selection?.second?.nordicLanguage?.name}
                </Text>
              )}
            </GridColumn>
          )}

          {/* Third selection */}
          {selection?.third?.include && (
            <Box marginTop={2}>
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.selection.thirdSubtitle)}
                </Text>
                <Text>{selection?.third?.school?.name}</Text>
                <Text>
                  {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                  {getTranslatedProgram(lang, selection?.third?.firstProgram)}
                </Text>
                {!!selection?.third?.secondProgram?.include &&
                  !!selection?.third?.secondProgram?.id && (
                    <Text>
                      {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                      {getTranslatedProgram(
                        lang,
                        selection?.third?.secondProgram,
                      )}
                    </Text>
                  )}
                {!!selection?.third?.thirdLanguage?.code && (
                  <Text>
                    {formatMessage(overview.selection.thirdLanguageLabel)}:{' '}
                    {selection?.third?.thirdLanguage?.name}
                  </Text>
                )}
                {!!selection?.third?.nordicLanguage?.code && (
                  <Text>
                    {formatMessage(overview.selection.nordicLanguageLabel)}:{' '}
                    {selection?.third?.nordicLanguage?.name}
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
