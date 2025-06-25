import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'

export const ValidationUrls = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box className={styles.header}>
        <GridRow>
          <GridColumn span="9/12">
            <Box marginLeft={1}>
              <Text variant="medium" fontWeight="semiBold">
                Raunslóð
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span="3/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                Aðgerð
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}
