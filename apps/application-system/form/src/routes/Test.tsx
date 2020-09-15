import React, { FC } from 'react'
import { Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const Test: FC<{}> = () => {
  const { formatMessage, loadingMessages } = useLocale([
    'applications',
    'global',
  ])
  if (loadingMessages) {
    return <p>Loading</p>
  }
  return (
    <Typography>
      {formatMessage({
        id: 'applications:title',
        defaultMessage: 'default',
        description: 'description',
      })}
      {formatMessage({
        id: 'global:title',
        defaultMessage: 'default',
        description: 'description',
      })}
    </Typography>
  )
}
