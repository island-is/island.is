import {
  AlertMessage,
  ProblemTemplate,
  ProblemTemplateProps,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { ProblemSize } from './Problem'

type ServiceErrorProps = {
  title?: string
  message?: string
  size?: ProblemSize
} & Pick<
  ProblemTemplateProps,
  'buttonLink' | 'noBorder' | 'tag' | 'imgAlt' | 'imgSrc'
>

export const InternalServiceError = ({
  title,
  message,
  size,
  noBorder,
  buttonLink,
  imgSrc,
  imgAlt,
  tag = '500',
  dataTestId,
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
      buttonLink={buttonLink}
      noBorder={noBorder}
    />
  )
}
