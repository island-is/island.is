import React, { FC } from 'react'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

import { ErrorScreen } from '../ErrorScreen/ErrorScreen'
interface Props {
  title?: string | MessageDescriptor
}

export const NotFound: FC<Props> = ({ title }) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  return (
    <ErrorScreen
      tag="404"
      tagVariant="purple"
      title={formatMessage(title || m.notFound)}
      figure="./assets/images/hourglass.svg"
    >
      {formatMessage(m.notFoundMessage, {
        path: pathname,
      })}
    </ErrorScreen>
  )
}
