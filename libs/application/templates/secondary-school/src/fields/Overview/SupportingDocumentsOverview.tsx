import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { overview } from '../../lib/messages'
import { SecondarySchoolAnswers } from '../..'
import { useLocale } from '@island.is/localization'

export const SupportingDocumentsOverview: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <GridRow>
        <GridColumn>
          <Text variant="h5">
            {formatMessage(overview.supportingDocuments.subtitle)}
          </Text>
          <Text>{formatMessage(overview.supportingDocuments.description)}</Text>

          {answers.supportingDocuments?.attachments?.map((attachment) => {
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
  )
}
