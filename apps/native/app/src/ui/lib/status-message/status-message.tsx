import { useEffect } from 'react'

import { useTranslate } from '../../../hooks/use-translate'
import { useOfflineStore } from '../../../stores/offline-store'
import {
  StatusMessageTemplate,
  StatusMessageTemplateBaseProps,
  DetailLink,
} from './status-message-template'
import { getOrganizationSlugFromError } from '../../../utils/get-organization-slug-from-error'
import { ThirdPartyServiceError } from './third-party-service-error'

enum StatusMessageTypes {
  error = 'error',
  noData = 'no_data',
}

type StatusMessageBaseProps = {
  /**
   * Type of status message
   * @default 'error'
   * 'error' is a generic error that is not caused by the user
   * 'no_data' is a 200 response, i.e. no data
   */
  type?: `${StatusMessageTypes}`
  error?: Error
  title?: string
  message?: string
  detailLink?: DetailLink
  logError?: boolean
} & Pick<StatusMessageTemplateBaseProps, 'withContainer' | 'size'>

interface ErrorProps extends StatusMessageBaseProps {
  type?: 'error'
  showIcon?: never
  error?: Error
  title?: string
  message?: string
  tag?: string
}

interface NoDataBaseProps extends StatusMessageBaseProps {
  type: 'no_data'
  error?: never
  title?: string
  message?: string
  detailLink?: DetailLink
}

interface NoDataWithIconProps extends NoDataBaseProps {
  showIcon?: boolean
  tag?: never
}

interface NoDataWithTagProps extends NoDataBaseProps {
  showIcon?: never
  tag?: string
}

type NoDataProps = NoDataWithIconProps | NoDataWithTagProps

type StatusMessageProps = ErrorProps | NoDataProps

export const StatusMessage = ({
  type = StatusMessageTypes.error,
  error,
  title,
  message,
  tag,
  logError = false,
  withContainer,
  showIcon,
  size = 'large',
  detailLink,
}: StatusMessageProps) => {
  const t = useTranslate()
  const { isConnected } = useOfflineStore()

  const defaultProps = { withContainer }

  const fallbackProps = {
    ...defaultProps,
    title: title ?? t('problem.error.title'),
    message: message ?? t('problem.error.message'),
    tag: tag ?? t('problem.error.tag'),
    variant: 'error',
    size: size ?? 'large',
  } as const

  useEffect(() => {
    if (logError && error) {
      console.error(error)
    }
  }, [logError, error])

  // When offline prioritize showing offline template
  if (!isConnected) {
    return (
      <StatusMessageTemplate
        {...defaultProps}
        showIcon
        variant="warning"
        title={title ?? t('problem.offline.title')}
        message={message ?? t('problem.offline.message')}
        size={size}
      />
    )
  }

  const noDataProps =
    showIcon || !tag ? { showIcon: !tag ? true : showIcon } : { tag }

  switch (type) {
    case StatusMessageTypes.error:
      if (error) {
        const organizationSlug = getOrganizationSlugFromError(error)

        if (organizationSlug) {
          return (
            <ThirdPartyServiceError
              organizationSlug={organizationSlug}
              size={size}
            />
          )
        }
      }
      return <StatusMessageTemplate {...fallbackProps} />

    case StatusMessageTypes.noData:
      return (
        <StatusMessageTemplate
          {...defaultProps}
          {...noDataProps}
          variant="info"
          title={title ?? t('problem.noData.title')}
          message={message ?? t('problem.noData.message')}
          size={size}
          detailLink={detailLink}
        />
      )

    default:
      return <StatusMessageTemplate {...fallbackProps} />
  }
}

/** @deprecated Use `StatusMessage`. */
export const Problem = StatusMessage
