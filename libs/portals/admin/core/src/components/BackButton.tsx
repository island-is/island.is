import React from 'react'

import { useLocale } from '@island.is/localization'
import { Button } from '@island.is/island-ui/core'

import { m } from '../lib/messages'

interface BackButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  const { formatMessage } = useLocale()

  return (
    <Button
      colorScheme="default"
      iconType="filled"
      onClick={onClick}
      preTextIcon="arrowBack"
      preTextIconType="filled"
      size="small"
      type="button"
      variant="text"
    >
      {formatMessage(m.back)}
    </Button>
  )
}
