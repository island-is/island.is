import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  ProblemTemplate,
  ProblemTemplateProps,
} from '@island.is/island-ui/core'

import { ProblemSize } from './problem.types'
import { m } from '../../lib/messages'

type ThirdPartyServiceErrorProps = {
  tag?: string
  size?: ProblemSize
} & Pick<ProblemTemplateProps, 'expand'>

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
      {...(tag ? { tag } : { showIcon: true })}
      {...errorTemplateProps}
      {...rest}
      titleSize="h2"
    />
  )
}
