import React from 'react'
import { m, ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { ErrorScreen } from '../ErrorScreen/ErrorScreen'
interface Props {
  title?: string | MessageDescriptor
}

export const AccessDenied: ServicePortalModuleComponent<Props> = ({
  title,
}) => {
  const { formatMessage } = useLocale()

  return (
    <ErrorScreen
      tag={formatMessage(m.accessDenied)}
      tagVariant={'red'}
      title={formatMessage(title || m.accessDenied)}
      figure="/assets/images/hourglass.svg"
    >
      {formatMessage(m.accessDeniedText)}
    </ErrorScreen>
  )
}

export default AccessDenied
