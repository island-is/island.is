import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { AlertMessage, ProblemTemplate } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { ProblemSize } from './Problem'

type ThirdPartyServiceErrorProps = {
  tag?: string
  size?: ProblemSize
}

export const ThirdPartyServiceError = ({
  tag,
  size = 'large',
  ...rest
}: ThirdPartyServiceErrorProps & TestSupport) => {
  const { formatMessage } = useLocale()

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
      {...(tag ? { tag } : { icon: 'warning' })}
      {...errorTemplateProps}
      {...rest}
    />
  )
}
