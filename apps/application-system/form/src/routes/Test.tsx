import React, { FC } from 'react'
import { Typography } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

export const Test: FC<{}> = () => {
  const { loadingMessages } = useNamespaces(['applications', 'global'])
  const { formatMessage } = useLocale()
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
