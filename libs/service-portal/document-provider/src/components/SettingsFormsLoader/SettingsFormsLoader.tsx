import React from 'react'

import { SkeletonLoader, Stack } from '@island.is/island-ui/core'

export function SettingsFormsLoader({
  numberOfLoaders,
}: {
  numberOfLoaders: number
}) {
  return (
    <Stack space={2}>
      {[...Array(numberOfLoaders)].map((_, i) => (
        <SkeletonLoader borderRadius="large" height={62} key={'' + i} />
      ))}
    </Stack>
  )
}
