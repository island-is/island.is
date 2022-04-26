import React, { FC } from 'react'
import { m } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { useLocation } from 'react-router-dom'
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
