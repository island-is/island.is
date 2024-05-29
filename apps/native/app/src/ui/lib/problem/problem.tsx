import { useEffect } from 'react'
import { useTranslate } from '../../../hooks/use-translate'
import { useOfflineStore } from '../../../stores/offline-store'
import { ProblemTemplate, ProblemTemplateBaseProps } from './problem-template'

enum ProblemTypes {
  error = 'error',
  noData = 'no_data',
}

type ProblemBaseProps = {
  /**
   * Type of problem
   * @default 'error'
   * 'error' is a generic error that is not caused by the user
   * 'no_data' is a 200 response, i.e. no data
   */
  type?: `${ProblemTypes}`
  error?: Error
  title?: string
  message?: string
  logError?: boolean
} & Pick<ProblemTemplateBaseProps, 'withContainer'>

interface ErrorProps extends ProblemBaseProps {
  type?: 'error'
  showIcon?: never
  error?: Error
  title?: string
  message?: string
  tag?: string
}

interface NoDataBaseProps extends ProblemBaseProps {
  type: 'no_data'
  error?: never
  title?: string
  message?: string
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

type ProblemProps = ErrorProps | NoDataProps

export const Problem = ({
  type = ProblemTypes.error,
  error,
  title,
  message,
  tag,
  logError = false,
  withContainer,
  showIcon,
}: ProblemProps) => {
  const t = useTranslate()
  const { isConnected } = useOfflineStore()

  const defaultProps = { withContainer }

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

  const noDataProps =
    showIcon || !tag ? { showIcon: !tag ? true : showIcon } : { tag }

  switch (type) {
    case ProblemTypes.error:
      return <ProblemTemplate {...fallbackProps} />

    case ProblemTypes.noData:
      return (
        <ProblemTemplate
          {...defaultProps}
          {...noDataProps}
          variant="info"
          title={title ?? t('problem.noData.title')}
          message={message ?? t('problem.noData.message')}
        />
      )

    default:
      return <ProblemTemplate {...fallbackProps} />
  }
}
