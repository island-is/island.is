import { useEffect } from 'react'

import { ProblemTemplate } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'

import { getOrganizationSlugFromError } from '../../utils/getOrganizationSlugFromError'
import { ThirdPartyServiceError } from './ThirdPartyServiceError'
import { NotFound } from './NotFound'
import { InternalServiceError } from './InternalServiceError'
import { CommonProblemProps, Message, ProblemSize } from './problem.types'
import { NoData } from './NoData'
import { m } from '../../lib/messages'

type ProblemBaseProps = {
  /**
   * Type of problem
   * @default 'internal_service_error'
   * 'internal_service_error' is a generic error that is not caused by the user
   * 'not_found' is a 404 error, i.e. the page is not found
   * 'no_data' is a 200 response, i.e. no data
   */
  type?: 'internal_service_error' | 'not_found' | 'no_data'
  /**
   * Size of the error box
   * 'small' is a small error that can be used inline
   * 'large' is a large error that should be used on a page
   * @note this is not available for all types
   */
  error?: Error
  title?: string
  message?: Message
  tag?: string
  logError?: boolean
} & CommonProblemProps &
  TestSupport

interface InternalServiceErrorProps extends ProblemBaseProps {
  type?: 'internal_service_error'
  error?: Error
  title?: string
  message?: Message
  size?: ProblemSize
}

interface NotFoundProps extends ProblemBaseProps {
  type: 'not_found'
  error?: never
  size?: never
}

interface NoDataProps extends ProblemBaseProps {
  type: 'no_data'
  error?: never
  title?: string
  message?: Message
  size?: ProblemSize
}

type ProblemProps = InternalServiceErrorProps | NotFoundProps | NoDataProps

export const Problem = ({
  type = 'internal_service_error',
  size = 'large',
  error,
  title,
  message,
  tag,
  imgSrc,
  imgAlt,
  noBorder,
  dataTestId,
  logError = true,
  expand,
}: ProblemProps) => {
  const { formatMessage } = useLocale()

  const defaultProps = {
    title,
    message,
    imgSrc,
    imgAlt,
    noBorder,
    dataTestId,
    expand,
  }

  const fallbackProps = {
    title: title ?? formatMessage(m.internalServerErrorTitle),
    message: message ?? formatMessage(m.internalServerErrorMessage),
    withIcon: true,
    variant: 'error',
    dataTestId,
    expand,
  } as const

  useEffect(() => {
    if (error && logError) {
      console.error(error)
    }
  }, [])

  switch (type) {
    case 'internal_service_error':
      if (error) {
        const organizationSlug = getOrganizationSlugFromError(error)

        if (organizationSlug) {
          return (
            <ThirdPartyServiceError
              organizationSlug={organizationSlug}
              size={size}
              dataTestId={dataTestId}
              expand={expand}
            />
          )
        }
      }

      return (
        <InternalServiceError
          {...defaultProps}
          size={size}
          tag={tag ?? formatMessage(m.error)}
        />
      )

    case 'not_found':
      return <NotFound {...defaultProps} tag={tag ?? formatMessage(m.error)} />

    case 'no_data':
      return <NoData {...defaultProps} size={size} tag={tag} />

    default:
      return <ProblemTemplate {...fallbackProps} />
  }
}
