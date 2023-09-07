import React, { ReactNode, useMemo } from 'react'

import { m, useServiceErrorStore } from '@island.is/portals/core'
import {
  AlertMessage,
  AlertMessageType,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

import { getOrganizationSlugFromError } from '../../utils/getOrganizationSlugFromError'

type ErrorBoxBaseProps = {
  children?: ReactNode
  moduleName?: string | MessageDescriptor
  variant?: AlertMessageType
  noMarginTop?: boolean
  error?: Error
  title?: string
  message?: string
}

interface WithErrorProps extends ErrorBoxBaseProps {
  error: Error
  title?: never
}

interface OtherErrorProps extends ErrorBoxBaseProps {
  error?: never
  title: string
}

interface WithBothProps extends ErrorBoxBaseProps {
  error: Error
  title: string
}

type ErrorBoxProps = WithErrorProps | OtherErrorProps | WithBothProps

export const ErrorBox = ({
  moduleName,
  error,
  children,
  title,
  message,
  variant = 'error',
}: ErrorBoxProps) => {
  const { formatMessage } = useLocale()
  const organizations = useServiceErrorStore.use.organizations()
  const organizationSlug = useMemo(
    () => getOrganizationSlugFromError(error),
    [error],
  )
  const organization = useMemo(
    () => organizations.find((org) => org.slug === organizationSlug),
    [organizationSlug],
  )

  if (error) {
    return (
      <Box display="flex" flexDirection="column" rowGap={4}>
        {organization?.title ? (
          <AlertMessage
            type={variant}
            title={formatMessage(
              formatMessage(m.organizationServiceError, {
                service: organization?.title,
              }),
            )}
            message={message}
          />
        ) : (
          <AlertMessage
            type={variant}
            title={title ?? formatMessage(m.somethingWrong)}
            message={message}
          />
        )}
        {children}
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={4}>
      <Text variant="h2" as="h2">
        {title}
      </Text>
      {message && (
        <Text>
          {message}
          {moduleName && <i>{formatMessage(moduleName)}</i>}
        </Text>
      )}
      {children}
    </Box>
  )
}
