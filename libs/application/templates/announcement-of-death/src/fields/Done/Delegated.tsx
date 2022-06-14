import React from 'react'
import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { m } from '../../lib/messages'

export const Delegated = ({ application }: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Button
      icon="arrowForward"
      size="small"
      iconType="outline"
      onClick={() => {
        window.open(`${window.location.origin}/minarsidur`, '_blank')
      }}
    >
      {formatText(m.delegatedMyPagesLinkText, application, formatMessage)}
    </Button>
  )
}
