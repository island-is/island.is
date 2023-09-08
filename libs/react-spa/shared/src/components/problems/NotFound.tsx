import { useLocation } from 'react-router-dom'

import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { ProblemTemplate } from '@island.is/island-ui/core'

import { CommonProblemProps } from './problem.types'
import { m } from '../../lib/messages'

type NotFoundProps = {
  title?: string
  message?: string
} & CommonProblemProps

export const NotFound = ({
  title: titleStr,
  message,
  tag,
  imgSrc,
  imgAlt,
  buttonLink,
  noBorder,
  dataTestId,
  expand,
}: NotFoundProps & TestSupport) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const title = titleStr ?? formatMessage(m.notFound)

  const imgProps = {
    src: imgSrc ?? './assets/images/nodata.svg',
    alt: imgAlt ?? title,
  }

  return (
    <ProblemTemplate
      variant="error"
      {...(tag ? { tag } : { icon: 'error' })}
      title={title}
      message={
        message ??
        formatMessage(m.notFoundMessage, {
          path: pathname,
        })
      }
      imgSrc={imgProps.src}
      imgAlt={imgProps.alt}
      buttonLink={buttonLink}
      noBorder={noBorder}
      dataTestId={dataTestId}
      expand={expand}
    />
  )
}
