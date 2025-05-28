import { FC } from 'react'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

interface ReviewGroupProps {
  isFirst?: boolean
  isLast?: boolean
  editMessage?: string
  handleClick?: () => void
  title: string
}

export const ReviewGroup: FC<React.PropsWithChildren<ReviewGroupProps>> = ({
  children,
  isFirst,
  isLast,
  editMessage,
  handleClick,
  title,
}) => {
  return (
    <Box>
      {!isFirst && <Divider />}

      <Box paddingY={4}>
        <GridRow>
          <GridColumn span={['1/2', '1/2', '1/2', '4/7', '2/3']}>
            <Box
              display={'flex'}
              alignItems={'center'}
              width="full"
              height="full"
              paddingBottom={editMessage ? 0 : 3}
            >
              <Text variant="h4">{title}</Text>
            </Box>
          </GridColumn>
          {editMessage && (
            <GridColumn span={['1/2', '1/2', '1/2', '3/7', '1/3']}>
              <Box
                paddingBottom={2}
                paddingTop={2}
                display={'flex'}
                justifyContent={'flexEnd'}
              >
                <Button variant="utility" icon="pencil" onClick={handleClick}>
                  {editMessage}
                </Button>
              </Box>
            </GridColumn>
          )}
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12']}>{children}</GridColumn>
        </GridRow>
      </Box>

      {!isLast && <Divider />}
    </Box>
  )
}
