import { AlertMessage, ProblemTemplate } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { CommonProblemProps } from './problem.types'

import { m } from '../../lib/messages'
import { ProblemSize } from './Problem'

type ServiceErrorProps = {
  title?: string
  message?: string
  size?: ProblemSize
} & CommonProblemProps

export const InternalServiceError = ({
  title,
  message,
  size,
  imgSrc,
  imgAlt,
  tag = '500',
  dataTestId,
  ...rest
}: ServiceErrorProps & TestSupport) => {
  const { formatMessage } = useLocale()

  const commonProps = {
    title: title ?? formatMessage(m.errorPageHeading),
    message: message ?? formatMessage(m.errorPageText),
    dataTestId,
  }

  const imgProps = {
    src: imgSrc ?? './assets/images/hourglass.svg',
    alt: imgAlt ?? commonProps.title,
  }

  if (size === 'small') {
    return <AlertMessage type="error" {...commonProps} />
  }

  return (
    <ProblemTemplate
      variant="error"
      {...(tag ? { tag } : { icon: 'error' })}
      {...commonProps}
      imgSrc={imgProps.src}
      imgAlt={imgProps.alt ?? commonProps.title}
      {...rest}
    />
  )
}
