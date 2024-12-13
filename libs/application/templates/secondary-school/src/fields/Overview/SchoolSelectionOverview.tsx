import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import { getTranslatedProgram } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes } from '../../shared'

export const SchoolSelectionOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, lang } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <>
      <Divider />
      <ReviewGroup
        handleClick={() => onClick(Routes.SCHOOL)}
        editMessage={formatMessage(overview.general.editMessage)}
        title={formatMessage(overview.selection.subtitle)}
      >
        <Box>
          <GridRow>
            {/* First selection */}
            <GridColumn span="1/2">
              <Text variant="h5">
                {formatMessage(overview.selection.firstSubtitle)}
              </Text>
              <Text>{answers?.selection?.first?.school?.name}</Text>
              <Text>
                {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                {getTranslatedProgram(
                  lang,
                  answers?.selection?.first?.firstProgram,
                )}
              </Text>
              {!!answers?.selection?.first?.secondProgram?.id && (
                <Text>
                  {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                  {getTranslatedProgram(
                    lang,
                    answers?.selection?.first?.secondProgram,
                  )}
                </Text>
              )}
              {!!answers?.selection?.first?.thirdLanguage?.code && (
                <Text>{answers?.selection?.first?.thirdLanguage?.name}</Text>
              )}
              {!!answers?.selection?.first?.nordicLanguage?.code && (
                <Text>{answers?.selection?.first?.nordicLanguage?.name}</Text>
              )}
            </GridColumn>

            {/* Second selection */}
            {answers?.selection?.second?.include && (
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.selection.secondSubtitle)}
                </Text>
                <Text>{answers?.selection?.second?.school?.name}</Text>
                <Text>
                  {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                  {getTranslatedProgram(
                    lang,
                    answers?.selection?.second?.firstProgram,
                  )}
                </Text>
                {!!answers?.selection?.second?.secondProgram?.id && (
                  <Text>
                    {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                    {getTranslatedProgram(
                      lang,
                      answers?.selection?.second?.secondProgram,
                    )}
                  </Text>
                )}
                {!!answers?.selection?.second?.thirdLanguage?.code && (
                  <Text>{answers?.selection?.second?.thirdLanguage?.name}</Text>
                )}{' '}
                {!!answers?.selection?.second?.nordicLanguage?.code && (
                  <Text>
                    {answers?.selection?.second?.nordicLanguage?.name}
                  </Text>
                )}
              </GridColumn>
            )}

            {/* Third selection */}
            {answers?.selection?.third?.include && (
              <Box marginTop={2}>
                <GridColumn span="1/2">
                  <Text variant="h5">
                    {formatMessage(overview.selection.thirdSubtitle)}
                  </Text>
                  <Text>{answers?.selection?.third?.school?.name}</Text>
                  <Text>
                    {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                    {getTranslatedProgram(
                      lang,
                      answers?.selection?.third?.firstProgram,
                    )}
                  </Text>
                  {!!answers?.selection?.third?.secondProgram?.id && (
                    <Text>
                      {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                      {getTranslatedProgram(
                        lang,
                        answers?.selection?.third?.secondProgram,
                      )}
                    </Text>
                  )}
                  {!!answers?.selection?.third?.thirdLanguage?.code && (
                    <Text>
                      {answers?.selection?.third?.thirdLanguage?.name}
                    </Text>
                  )}
                  {!!answers?.selection?.third?.nordicLanguage?.code && (
                    <Text>
                      {answers?.selection?.third?.nordicLanguage?.name}
                    </Text>
                  )}
                </GridColumn>
                <GridColumn span="1/2"></GridColumn>
              </Box>
            )}
          </GridRow>
        </Box>
      </ReviewGroup>
    </>
  )
}
