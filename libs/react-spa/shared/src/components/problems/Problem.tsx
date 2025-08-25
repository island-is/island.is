import { ProblemTemplate } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { useEffect } from 'react'
import { m } from '../../lib/messages'

import { getOrganizationSlugFromError } from '../../utils/getOrganizationSlugFromError'
import { InternalServiceError } from './InternalServiceError'
import { NoData } from './NoData'
import { NotFound } from './NotFound'
import {
  CommonProblemProps,
  Message,
  ProblemSize,
  ProblemTypes,
} from './problem.types'
import { ThirdPartyServiceError } from './ThirdPartyServiceError'

type ProblemBaseProps = {
  /**
   * Type of problem
   * @default 'internal_service_error'
   * 'internal_service_error' is a generic error that is not caused by the user
   * 'not_found' is a 404 error, i.e. the page is not found
   * 'no_data' is a 200 response, i.e. no data
   */
  type?: `${ProblemTypes}`
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
  type = ProblemTypes.internalServiceError,
  size,
  error,
  title,
  titleSize,
  message,
  tag,
  imgSrc,
  imgAlt,
  noBorder = true,
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
    case ProblemTypes.internalServiceError:
      if (error) {
        const organizationSlug = getOrganizationSlugFromError(error)

        if (organizationSlug) {
          return (
            <ThirdPartyServiceError
              organizationSlug={organizationSlug}
              size={size ?? 'large'}
              dataTestId={dataTestId}
              expand={expand}
            />
          )
        }
      }

      return (
        <InternalServiceError
          {...defaultProps}
          size={size ?? 'large'}
          tag={tag ?? formatMessage(m.error)}
        />
      )

    case ProblemTypes.notFound:
      return <NotFound {...defaultProps} tag={tag ?? formatMessage(m.error)} />

    case ProblemTypes.noData:
      return (
        <NoData
          {...defaultProps}
          size={size ?? 'large'}
          tag={tag}
          titleSize={titleSize}
        />
      )

    default:
      return <ProblemTemplate {...fallbackProps} />
  }
}
