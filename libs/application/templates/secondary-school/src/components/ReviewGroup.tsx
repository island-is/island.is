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
  hideTopDivider?: boolean
  editMessage?: string
  handleClick?: () => void
  isEditable?: boolean
  title: string
}

export const ReviewGroup: FC<React.PropsWithChildren<ReviewGroupProps>> = ({
  children,
  hideTopDivider,
  editMessage,
  handleClick,
  isEditable = true,
  title,
}) => {
  return (
    <Box>
      {!hideTopDivider && <Divider />}

      <Box paddingY={4}>
        <GridRow>
          <GridColumn span={['1/2', '1/2', '1/2', '4/7', '2/3']}>
            <Box
              display={'flex'}
              alignItems={'center'}
              width="full"
              height="full"
            >
              <Text variant="h4">{title}</Text>
            </Box>
          </GridColumn>
          {isEditable && editMessage && (
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
          <GridColumn>{children}</GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}
