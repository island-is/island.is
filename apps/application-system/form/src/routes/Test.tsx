import React from 'react'
import { useParams } from 'react-router-dom'

import { ApplicationForm, ErrorShell } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'

export const Test = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  console.log('testo')

  if (!nationalRegistryId) {
    return <div>Testo ekki auðkenndur</div>
  }

  return <div>Testo auðkenndur</div>
}
