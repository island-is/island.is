import React from 'react'
import { Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ApplicationCardFields, DefaultCardData } from '../types'

interface Props {
  actionCard: ApplicationCardFields['actionCard']
  defaultData: DefaultCardData
}

export const ApplicationCardTag = ({ actionCard, defaultData }: Props) => {
  const { formatMessage } = useLocale()
  const label = actionCard?.tag?.label
    ? formatMessage(actionCard.tag.label)
    : formatMessage(defaultData.tag.label)
  const variant = actionCard?.tag?.variant || defaultData.tag.variant

  return (
    <Tag outlined={false} variant={variant} disabled>
      {label}
    </Tag>
  )
}
