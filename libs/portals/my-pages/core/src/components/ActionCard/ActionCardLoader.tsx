import React, { FC } from 'react'
import {
  Box,
  Stack,
  Columns,
  Column,
  SkeletonLoader,
} from '@island.is/island-ui/core'

interface Props {
  repeat?: number
}

export const ActionCardLoader: FC<React.PropsWithChildren<Props>> = ({
  repeat,
}) => (
  <Stack space={2}>
    {[...Array(repeat || 1)].map((_key, index) => (
      <Box
        paddingY={3}
        paddingX={4}
        border="standard"
        borderRadius="large"
        key={index}
      >
        <Stack space={1}>
          <Columns alignY="center" space={3}>
            <Column width="10/12">
              <SkeletonLoader height={15} width="15%" />
            </Column>
            <Column width="2/12">
              <SkeletonLoader height={15} />
            </Column>
          </Columns>
          <SkeletonLoader height={42} width="70%" />
          <Columns alignY="center" collapseBelow="sm" space={3}>
            <Column>
              <SkeletonLoader height={27} width="50%" />
            </Column>
          </Columns>
        </Stack>
      </Box>
    ))}
  </Stack>
)

export default ActionCardLoader
