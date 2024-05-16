import { useEffect } from 'react'
import { useTranslate } from '../../../hooks/use-translate'
import { useOfflineStore } from '../../../stores/offline-store'
import { ProblemTemplate, ProblemTemplateBaseProps } from './problem-template'

enum ProblemTypes {
  internalServiceError = 'internal_service_error',
  noData = 'no_data',
}

type ProblemBaseProps = {
  /**
   * Type of problem
   * @default 'internal_service_error'
   * 'internal_service_error' is a generic error that is not caused by the user
   * 'not_found' is a 404 error, i.e. the page is not found
   * 'no_data' is a 200 response, i.e. no data
   */
  type?: `${ProblemTypes}`
  error?: Error
  title?: string
  message?: string
  tag?: string
  logError?: boolean
} & Pick<ProblemTemplateBaseProps, 'noContainer'>

interface InternalServiceErrorProps extends ProblemBaseProps {
  type?: 'internal_service_error'
  error?: Error
  title?: string
  message?: string
}

interface NoDataProps extends ProblemBaseProps {
  type: 'no_data'
  error?: never
  title?: string
  message?: string
}

type ProblemProps = InternalServiceErrorProps | NoDataProps

export const Problem = ({
  type = ProblemTypes.internalServiceError,
  error,
  title,
  message,
  tag,
  logError = false,
  noContainer,
}: ProblemProps) => {
  const t = useTranslate()
  const { isConnected } = useOfflineStore()

  const defaultProps = { noContainer }

  const fallbackProps = {
    ...defaultProps,
    title: title ?? t('problem.error.title'),
    message: message ?? t('problem.error.message'),
    tag: tag ?? t('problem.error.tag'),
    variant: 'error',
  } as const

  useEffect(() => {
    if (logError && error) {
      console.error(error)
    }
  }, [logError, error])

  // When offline prioritize showing offline template
  if (!isConnected) {
    return (
      <ProblemTemplate
        {...defaultProps}
        showIcon
        variant="warning"
        title={title ?? t('problem.offline.title')}
        message={message ?? t('problem.offline.message')}
      />
    )
  }

  switch (type) {
    case ProblemTypes.internalServiceError:
      return <ProblemTemplate {...fallbackProps} />

    case ProblemTypes.noData:
      return (
        <ProblemTemplate
          {...defaultProps}
          tag={tag}
          variant="info"
          title={title ?? t('problem.noData.title')}
          message={message ?? t('problem.noData.message')}
        />
      )

    default:
      return <ProblemTemplate {...fallbackProps} />
  }
}
