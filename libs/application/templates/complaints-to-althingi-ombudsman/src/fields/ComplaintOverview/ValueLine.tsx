import { MessageDescriptor } from 'react-intl'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Text } from '@island.is/island-ui/core'

export const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
    </>
  )
}
