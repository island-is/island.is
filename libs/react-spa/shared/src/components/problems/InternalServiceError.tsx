import { AlertMessage, ProblemTemplate } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'

import { CommonProblemProps, Message, ProblemSize } from './problem.types'
import { m } from '../../lib/messages'

type ServiceErrorProps = {
  title?: string
  message?: Message
  size?: ProblemSize
} & CommonProblemProps

export const InternalServiceError = ({
  title,
  message,
  size,
  imgSrc,
  imgAlt,
  tag,
  dataTestId,
  ...rest
}: ServiceErrorProps & TestSupport) => {
  const { formatMessage } = useLocale()

  const commonProps = {
    title: title ?? formatMessage(m.internalServerErrorTitle),
    message: message ?? formatMessage(m.internalServerErrorMessage),
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
      {...(tag ? { tag } : { showIcon: true })}
      {...commonProps}
      imgSrc={imgProps.src}
      imgAlt={imgProps.alt ?? commonProps.title}
      {...rest}
    />
  )
}
