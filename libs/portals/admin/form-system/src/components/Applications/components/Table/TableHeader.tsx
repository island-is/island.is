import { GridRow, GridColumn, Text, Box } from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'
import { useIntl } from 'react-intl'

export const TableHeader = () => {
  const { formatMessage } = useIntl()
  return (
    <Box className={styles.header}>
      <GridRow>
        <GridColumn span="4/12">
          <Box paddingLeft={2}>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(m.submitted)}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span="4/12">
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage(m.nationalId)}
          </Text>
        </GridColumn>
        <GridColumn span="4/12">
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage(m.state)}
          </Text>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
