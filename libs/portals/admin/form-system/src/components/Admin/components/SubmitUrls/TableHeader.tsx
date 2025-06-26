import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'

interface TableHeaderProps {
  text: string
}

export const TableHeader = ({ text }: TableHeaderProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box className={styles.header}>
        <GridRow>
          <GridColumn span="11/12">
            <Box marginLeft={1}>
              <Text variant="medium" fontWeight="semiBold">
                {text}
              </Text>
            </Box>
          </GridColumn>
          {/* <GridColumn span="3/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                Aðgerð
              </Text>
            </Box>
          </GridColumn> */}
        </GridRow>
      </Box>
    </>
  )
}
