import React from 'react'

import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { FormCard } from '../../../shared/components/FormCard'

export const PermissionContent = () => {
  const { formatMessage } = useLocale()

  return (
    <FormCard title={formatMessage(m.content)}>Here comes content</FormCard>
  )
}
