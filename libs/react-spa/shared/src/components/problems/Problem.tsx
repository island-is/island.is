import { useEffect, useMemo } from 'react'

import { m, useOrganizationStore } from '@island.is/portals/core'
import {
  ProblemTemplate,
  ProblemTemplateProps,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { getOrganizationSlugFromError } from '../../utils/getOrganizationSlugFromError'
import { ThirdPartyServiceError } from './ThirdPartyServiceError'
import { NotFound } from './NotFound'
import { InternalServiceError } from './InternalServiceError'
import { NoData } from './NoData'

export type ProblemSize = 'small' | 'large'

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
  message?: string
  tag?: string
} & Pick<ProblemTemplateProps, 'noBorder' | 'buttonLink' | 'imgSrc' | 'imgAlt'>

interface InternalServiceErrorProps extends ProblemBaseProps {
  type?: 'internal_service_error'
  error: Error
  title?: string
  message?: string
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
  message?: string
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
  buttonLink,
}: ProblemProps) => {
  const { formatMessage } = useLocale()

  const defaultProps = {
    tag,
    title,
    message,
    imgSrc,
    imgAlt,
    noBorder,
    buttonLink,
  }

  const fallbackProps = {
    title: title ?? formatMessage(m.errorPageHeading),
    message: message ?? formatMessage(m.errorPageText),
    withIcon: true,
    variant: 'error',
  } as const

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [])

  switch (type) {
    case 'internal_service_error':
      if (error) {
        const organizations = useOrganizationStore.use.organizations()
        const organizationSlug = useMemo(
          () => getOrganizationSlugFromError(error),
          [error],
        )
        const organization = useMemo(
          () => organizations.find((org) => org.slug === organizationSlug),
          [organizationSlug],
        )

        if (organization?.title || organizationSlug) {
          return (
            <ThirdPartyServiceError
              {...(organization?.title
                ? { tag: organization.title }
                : {
                    icon: 'warning',
                  })}
              size={size}
            />
          )
        }

        return <InternalServiceError {...defaultProps} size={size} />
      }

      return <ProblemTemplate {...fallbackProps} />

    case 'not_found':
      return <NotFound {...defaultProps} />

    case 'no_data':
      return <NoData {...defaultProps} size={size} />

    default:
      return <ProblemTemplate {...fallbackProps} />
  }
}
