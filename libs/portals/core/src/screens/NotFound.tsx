import React from 'react'
import { useLocation } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { ErrorScreen } from './ErrorScreen/ErrorScreen'

interface NotFoundProps {
  title?: string | MessageDescriptor
}

export const NotFound = ({ title }: NotFoundProps) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  return (
    <ErrorScreen
      tag="404"
      tagVariant="red"
      title={formatMessage(title || m.notFound)}
      figure="./assets/images/404.svg"
    >
      {formatMessage(m.notFoundMessage, {
        path: pathname,
      })}
    </ErrorScreen>
  )
}
