import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Jobs from '../../assets/Jobs'
import kennitala from 'kennitala'

const SchoolConfirmed: FC<FieldBaseProps> = ({ application }) => {
  const { answers } = application
  const nationalId = kennitala.format(answers.nationalId as string)
  const { formatMessage } = useLocale()

  return (
    <GridContainer>
      <GridRow marginBottom={3}>
        <GridColumn span={'12/12'}>
          <AlertMessage
            title={formatMessage(m.confirmationComplete)}
            type="success"
          ></AlertMessage>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">{formatMessage(m.confirmationSectionName)}</Text>
          <Text variant="default">{answers.studentName}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">
            {formatMessage(m.confirmationSectionNationalId)}
          </Text>
          <Text variant="default">{nationalId}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">{formatMessage(m.confirmation)}</Text>
          <Text variant="default">
            {formatMessage(m.school) + (answers.confirmation as any)?.school}
          </Text>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn>
          <Box height="full" marginTop={6} marginBottom={10}>
            <Jobs />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SchoolConfirmed
