import { useLocation, useNavigate } from 'react-router-dom'

import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { Button, ProblemTemplate } from '@island.is/island-ui/core'

import { CommonProblemProps, Message } from './problem.types'
import { m } from '../../lib/messages'

type NotFoundProps = {
  title?: string
  message?: Message
} & CommonProblemProps

export const NotFound = ({
  title: titleStr,
  message,
  tag,
  imgSrc,
  imgAlt,
  noBorder,
  dataTestId,
  expand,
  titleSize,
}: NotFoundProps & TestSupport) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const title = titleStr ?? formatMessage(m.notFound)

  return (
    <ProblemTemplate
      variant="error"
      {...(tag ? { tag } : { showIcon: true })}
      title={title}
      message={
        message ??
        formatMessage(m.notFoundMessage, {
          link: (
            <Button variant="text" onClick={() => navigate('/')}>
              {formatMessage(m.notFoundMessageLink)}
            </Button>
          ),
        })
      }
      imgSrc={imgSrc ?? './assets/images/nodata.svg'}
      imgAlt={imgAlt ?? title}
      noBorder={noBorder}
      dataTestId={dataTestId}
      expand={expand}
      titleSize={titleSize}
    />
  )
}
