import React, { FC, ReactNode } from 'react'
import { Text, Divider, Box, SkeletonLoader } from '@island.is/island-ui/core'

interface Props {
  title: string
  text: string | ReactNode
  children?: ReactNode
  loading?: boolean
  divider?: boolean
}

export const InputSection: FC<React.PropsWithChildren<Props>> = ({
  title,
  text,
  children,
  loading,
  divider = true,
}) => {
  return (
    <Box paddingTop={4}>
      <Text variant="h5" as="h2" marginBottom={1}>
        {title}
      </Text>
      <Text variant="medium" marginBottom={4}>
        {text}
      </Text>
      {!loading && <Box marginBottom={4}>{children}</Box>}
      {loading && (
        <Box paddingBottom={3}>
          <SkeletonLoader />
        </Box>
      )}
      {divider && <Divider />}
    </Box>
  )
}
