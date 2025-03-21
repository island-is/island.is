import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import * as styles from './TableRow.css'
import { useIntl } from 'react-intl'

export const TableRowHeader = () => {
  const { formatMessage } = useIntl()
  return (
    <Box className={styles.header}>
      <Row>
        <Column span="5/12">
          <Box paddingLeft={2}>
            <Text variant="medium">{formatMessage(m.name)}</Text>
          </Box>
        </Column>
        <Column span="2/12">
          <Text variant="medium">{formatMessage(m.lastModified)}</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">{formatMessage(m.translations)}</Text>
        </Column>
        <Column span="2/12">
          <Text variant="medium">{formatMessage(m.organization)}</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">{formatMessage(m.state)}</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">{formatMessage(m.actions)}</Text>
        </Column>
      </Row>
    </Box>
  )
}
