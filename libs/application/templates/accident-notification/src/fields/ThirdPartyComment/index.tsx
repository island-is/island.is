import { FieldBaseProps } from '@island.is/application/core'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import React, { FC } from 'react'
import { AccidentNotification } from '../../lib/dataSchema'
import { accidentDetails, thirdPartyComment } from '../../lib/messages'
import { ValueLine } from '../FormOverview/ValueLine'

export const ThirdPartyComment: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as AccidentNotification
  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  return (
    <Box component="section">
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <ValueLine label={accidentDetails.labels.date} value={date} />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <ValueLine label={accidentDetails.labels.time} value={time} />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12']}>
          <ValueLine
            label={accidentDetails.labels.description}
            value={answers.accidentDetails.descriptionOfAccident}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12']}>
          <Text variant="h5" marginTop={3} marginBottom={2}>
            {formatMessage(thirdPartyComment.labels.comment)}
          </Text>
          <InputController
            id="comment.description"
            label={formatMessage(thirdPartyComment.labels.descriptionInput)}
            name="comment.description"
            placeholder={formatMessage(
              thirdPartyComment.labels.descriptionInputPlaceholder,
            )}
            rows={10}
            backgroundColor="blue"
            textarea
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
