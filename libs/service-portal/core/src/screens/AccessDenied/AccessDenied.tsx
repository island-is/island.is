import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { m, ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { useLocation } from 'react-router-dom'
import { ErrorScreen } from '../ErrorScreen/ErrorScreen'
interface Props {
  title?: string | MessageDescriptor
}

export const AccessDenied: ServicePortalModuleComponent<Props> = ({
  title,
}) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  return (
    <ErrorScreen
      tag={formatMessage(m.accessDenied)}
      tagVariant={'purple'}
      title={formatMessage(title || m.accessDenied)}
      figure="/assets/images/hourglass.svg"
    >
      {formatMessage(m.accessDenied, {
        path: pathname,
      })}
    </ErrorScreen>
  )
}

export default AccessDenied
