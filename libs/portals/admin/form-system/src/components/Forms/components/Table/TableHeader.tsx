import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'
import { useIntl } from 'react-intl'

export const TableHeader = () => {
  const { formatMessage } = useIntl()
  return (
    <Box className={styles.header}>
      <Row>
        <Column span="7/12">
          <Box paddingLeft={2}>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.name)}
            </Text>
          </Box>
        </Column>
        <Column span="2/12">
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.lastModified)}
            </Text>
          </Box>
        </Column>

        <Column span="2/12">
          <Box display="flex" justifyContent="center">
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.state)}
            </Text>
          </Box>
        </Column>

        <Column span="1/12">
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage(m.actions)}
          </Text>
        </Column>
      </Row>
    </Box>
  )
}
