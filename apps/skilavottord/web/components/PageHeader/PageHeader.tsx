import { FC } from 'react'

import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'

export const PageHeader: FC<{ title: string; info: string }> = ({
  title,
  info,
}) => {
  return (
    <Box display="flex" alignItems="flexStart" justifyContent="spaceBetween">
      <GridRow>
        <GridColumn order={[2, 1]}>
          <Text variant="h1" as="h1" marginBottom={4}>
            {title}
          </Text>
        </GridColumn>
        <GridColumn order={[1, 2]}>
          <Tooltip text={info} />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
export default PageHeader
