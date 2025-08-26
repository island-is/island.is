import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import * as styles from '../../../tableHeader.css'

interface TableHeaderProps {
  text: string
}

export const TableHeader = ({ text }: TableHeaderProps) => {
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
        </GridRow>
      </Box>
    </>
  )
}
