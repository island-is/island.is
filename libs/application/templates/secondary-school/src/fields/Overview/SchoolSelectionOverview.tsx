import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'

export const SchoolSelectionOverview: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <GridRow>
        <GridColumn span="1/2">
          <Text variant="h4">
            {formatMessage(overview.selection.firstSubtitle)}:
          </Text>
          <Text>{answers?.selection?.first?.school?.name}</Text>
          <Text>
            {formatMessage(overview.selection.firstProgramLabel)}:{' '}
            {answers?.selection?.first?.firstProgram?.name}
          </Text>
          <Text>
            {formatMessage(overview.selection.secondProgramLabel)}:{' '}
            {answers?.selection?.first?.secondProgram?.name}
          </Text>
          <Text>{answers?.selection?.first?.thirdLanguage?.name}</Text>
          {!!answers?.selection?.first?.nordicLanguage?.code && (
            <Text>{answers?.selection?.first?.nordicLanguage?.name}</Text>
          )}
        </GridColumn>
        <GridColumn span="1/2">
          <Text variant="h4">
            {formatMessage(overview.selection.secondSubtitle)}:
          </Text>
          <Text>{answers?.selection?.second?.school?.name}</Text>
          <Text>
            {formatMessage(overview.selection.firstProgramLabel)}:{' '}
            {answers?.selection?.second?.firstProgram?.name}
          </Text>
          <Text>
            {formatMessage(overview.selection.secondProgramLabel)}:{' '}
            {answers?.selection?.second?.secondProgram?.name}
          </Text>
          <Text>{answers?.selection?.second?.thirdLanguage?.name}</Text>
          {!!answers?.selection?.second?.nordicLanguage?.code && (
            <Text>{answers?.selection?.second?.nordicLanguage?.name}</Text>
          )}
        </GridColumn>
        {answers?.selection?.third?.include && (
          <Box marginTop={2}>
            <GridColumn span="1/2">
              <Text variant="h4">
                {formatMessage(overview.selection.thirdSubtitle)}:
              </Text>
              <Text>{answers?.selection?.third?.school?.name}</Text>
              <Text>
                {formatMessage(overview.selection.firstProgramLabel)}:{' '}
                {answers?.selection?.third?.firstProgram?.name}
              </Text>
              <Text>
                {formatMessage(overview.selection.secondProgramLabel)}:{' '}
                {answers?.selection?.third?.secondProgram?.name}
              </Text>
              <Text>{answers?.selection?.third?.thirdLanguage?.name}</Text>
              {!!answers?.selection?.third?.nordicLanguage?.code && (
                <Text>{answers?.selection?.third?.nordicLanguage?.name}</Text>
              )}
            </GridColumn>
            <GridColumn span="1/2"></GridColumn>
          </Box>
        )}
      </GridRow>
    </Box>
  )
}
