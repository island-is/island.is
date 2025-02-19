import { useParams } from 'react-router-dom'

import { coreMessages } from '@island.is/application/core'
import { ApplicationForm, ErrorShell } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id || !slug) {
    return <ErrorShell errorType="notFound" />
  }

  if (!nationalRegistryId) {
    return (
      <ErrorShell
        errorType="notFound"
        title={formatMessage(coreMessages.notLoggedIn)}
        subTitle={formatMessage(coreMessages.notLoggedInDescription)}
      />
    )
  }

  return (
    <ApplicationForm
      applicationId={id}
      nationalRegistryId={nationalRegistryId}
      slug={slug}
    />
  )
}
