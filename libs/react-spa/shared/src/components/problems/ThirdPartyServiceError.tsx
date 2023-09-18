import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  ProblemTemplate,
  ProblemTemplateProps,
} from '@island.is/island-ui/core'
import { useMemo } from 'react'

import { ProblemSize } from './problem.types'
import { m } from '../../lib/messages'
import { useGetOrganizationsQuery } from './GetOrganization.generated'

type ThirdPartyServiceErrorProps = {
  organizationSlug: string
  size?: ProblemSize
} & Pick<ProblemTemplateProps, 'expand'>

export const ThirdPartyServiceError = ({
  organizationSlug,
  size = 'large',
  ...rest
}: ThirdPartyServiceErrorProps & TestSupport) => {
  const { formatMessage } = useLocale()
  const { data, error, loading } = useGetOrganizationsQuery()

  const organization = useMemo(
    () =>
      data?.getOrganizations.items.find((org) => org.slug === organizationSlug),
    [data, organizationSlug],
  )

  if (loading) {
    // We are deliberately not showing loading state here, as it would be confusing to the user
    return null
  }

  const errorTemplateProps = {
    title: formatMessage(m.thirdPartyServiceErrorTitle),
    message: formatMessage(m.thirdPartyServiceErrorMessage),
  }

  if (size === 'small') {
    return <AlertMessage type="warning" {...errorTemplateProps} />
  }

  return (
    <ProblemTemplate
      variant="warning"
      {...(organization ? { tag: organization.title } : { showIcon: true })}
      {...errorTemplateProps}
      {...rest}
      titleSize="h2"
    />
  )
}
