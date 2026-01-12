import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Jobs from '../../assets/Jobs'
import kennitala from 'kennitala'
import { Student } from '../../types'
import { getValueViaPath } from '@island.is/application/core'

const SchoolConfirmed: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const nationalId = kennitala.format((answers.student as Student).nationalId)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

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
          <Text variant="default">{(answers.student as Student).name}</Text>
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
            {`${formatMessage(m.school)} ${getValueViaPath(
              answers,
              'confirmation.school',
            )}`}
          </Text>
        </GridColumn>
      </GridRow>
      <Box height="full" marginTop={6} marginBottom={6}>
        <Jobs />
      </Box>
      <Box marginBottom={10} display="flex" justifyContent="flexEnd">
        <Button
          onClick={() => navigate('/okuskoli')}
          icon="arrowForward"
          type="button"
        >
          {formatMessage(m.newConfirmSchoolButton)}
        </Button>
      </Box>
    </GridContainer>
  )
}

export default SchoolConfirmed
