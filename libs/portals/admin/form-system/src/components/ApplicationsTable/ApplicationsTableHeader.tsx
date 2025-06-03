import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import * as styles from './ApplicationsTableRow.css'
import { useIntl } from 'react-intl'

export const ApplicationsTableHeader = () => {
  const { formatMessage } = useIntl()
  return (
    <Box className={styles.header}>
      <Row>
        <Column span="4/12">
          <Box paddingLeft={2}>
            <Text variant="medium">{formatMessage(m.submitted)}</Text>
          </Box>
        </Column>
        <Column span="4/12">
          <Text variant="medium">{formatMessage(m.nationalId)}</Text>
        </Column>
        <Column span="4/12">
          <Text variant="medium">{formatMessage(m.state)}</Text>
        </Column>
      </Row>
    </Box>
  )
}
