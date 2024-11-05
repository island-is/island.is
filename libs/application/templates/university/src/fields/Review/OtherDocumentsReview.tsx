import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { UniversityApplication } from '../../lib/dataSchema'
import {
  OtherDocumentsDetailsItem,
  ProgramExtraApplicationField,
} from '../../shared/types'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
  extraApplicationFields: Array<ProgramExtraApplicationField>
}

export const OtherDocumentsReview: FC<Props> = ({
  application,
  goToScreen,
  route,
  extraApplicationFields,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as UniversityApplication
  const otherDocuments =
    answers.otherDocuments as Array<OtherDocumentsDetailsItem>
  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <GridRow>
          <GridColumn span="1/2">
            <Text variant="h5">
              {formatMessage(review.labels.otherDocuments)}
            </Text>

            {extraApplicationFields.map((field, index) => {
              const item = otherDocuments[index]
              if (item.attachments && item.attachments.length > 0) {
                return (
                  <Box key={field.externalKey}>
                    <Text>{field.externalKey}:</Text>
                    {item.attachments.map((file) => {
                      return (
                        <Box
                          display="flex"
                          alignItems="center"
                          marginBottom="smallGutter"
                        >
                          <Box
                            marginRight={1}
                            display="flex"
                            alignItems="center"
                          >
                            <Icon
                              color="blue400"
                              icon="document"
                              size="small"
                              type="outline"
                            />
                          </Box>
                          <Text>{file.name}</Text>
                        </Box>
                      )
                    })}
                  </Box>
                )
              }
            })}
          </GridColumn>
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
