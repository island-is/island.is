import {
  Box,
  Text,
  ProblemTemplate,
  ProblemTemplateProps,
  problemTemplateStyles as styles,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { ProblemSize } from './Problem'

type NoDataProps = {
  title?: string
  message?: string
  size?: ProblemSize
} & Pick<
  ProblemTemplateProps,
  'buttonLink' | 'noBorder' | 'tag' | 'imgAlt' | 'imgSrc'
>

export const NoData = ({
  title: titleStr,
  message,
  tag,
  size = 'large',
  noBorder,
  buttonLink,
  imgSrc,
  imgAlt,
  dataTestId,
}: NoDataProps & TestSupport) => {
  const { formatMessage } = useLocale()
  const title = titleStr ?? formatMessage(m.noDataTitle)

  const imgProps = {
    src: imgSrc ?? './assets/images/nodata.svg',
    alt: imgAlt ?? title,
  }

  // TODO fix UI when design is ready
  if (size === 'small') {
    return (
      <Box
        dataTestId={dataTestId}
        display="flex"
        alignItems="center"
        columnGap={[2, 4]}
        className={styles.container(
          noBorder
            ? {
                noBorder: true,
              }
            : {
                blue: true,
              },
        )}
        paddingY={[5, 10]}
        paddingX={3}
      >
        <Box marginTop={1}>
          <img {...imgProps} className={styles.img} />
        </Box>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Text variant="h2" as="h2" color="dark400">
            {title}
          </Text>
          <Text whiteSpace="preLine">{message}</Text>
        </Box>
      </Box>
    )
  }

  return (
    <ProblemTemplate
      variant="info"
      {...(tag ? { tag } : { icon: 'info' })}
      title={title}
      message={message ?? formatMessage(m.noDataMessage)}
      imgSrc={imgProps.src}
      imgAlt={imgProps.alt}
      buttonLink={buttonLink}
      noBorder={noBorder}
      dataTestId={dataTestId}
    />
  )
}
