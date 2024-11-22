import { SkeletonLoader, Stack } from '@island.is/island-ui/core'
import React from 'react'

export function SettingsFormsLoader({
  numberOfLoaders,
}: {
  numberOfLoaders: number
}) {
  return (
    <Stack space={2}>
      {[...Array(numberOfLoaders)].map((_, i) => (
        <SkeletonLoader borderRadius="default" height={62} key={'' + i} />
      ))}
    </Stack>
  )
}
