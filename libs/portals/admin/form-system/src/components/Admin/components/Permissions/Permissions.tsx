import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Permission } from './Permission'
import * as styles from '../../../tableHeader.css'

export const Permissions = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box className={styles.header}>
        <GridRow>
          <GridColumn span="4/12">
            <Box marginLeft={1}>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.certifications)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.lists)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.inputFields)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      <GridColumn span="12/12">
        <GridRow>
          <GridColumn span="4/12">
            <Box>
              <Permission type="certificate" />
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Permission type="list" />
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Permission type="field" />
            </Box>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </>
  )
}
