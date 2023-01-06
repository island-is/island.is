import { RepeaterProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  Box,
  Button,
  Inline,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

interface EmployeeRow {
  name: {
    label: string
    nationalId: string
  }
  email: string
  phoneNumber: string
  ratio: string
}

const EmployersOverview: FC<RepeaterProps> = ({
  application,
  expandRepeater,
}) => {
  const employers: EmployeeRow[] | undefined = getValueViaPath(
    application.answers,
    'employment.employers',
  )
  console.log(employers)
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="default">
        {parentalLeaveFormMessages.employer.description.defaultMessage}
      </Text>
      <Box paddingTop={5} paddingBottom={5}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>Kennitala</T.HeadData>
              <T.HeadData>Nafn</T.HeadData>
              <T.HeadData>Netfang</T.HeadData>
              <T.HeadData>Símanúmer</T.HeadData>
              <T.HeadData>Hlutfall</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {employers?.map((e) => (
              <T.Row key={e.email}>
                <T.Data>{e.name?.nationalId}</T.Data>
                <T.Data>{e.name?.label}</T.Data>
                <T.Data>{e.email}</T.Data>
                <T.Data>{e.phoneNumber}</T.Data>
                <T.Data>{e.ratio}%</T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </Box>
      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(parentalLeaveFormMessages.employer.addEmployer)}
          </Button>
        </Inline>
      </Box>
    </Box>
  )
}

export default EmployersOverview
