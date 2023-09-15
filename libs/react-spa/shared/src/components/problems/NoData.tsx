import {
  Box,
  Text,
  ProblemTemplate,
  problemTemplateStyles as styles,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { CommonProblemProps, ProblemSize } from './problem.types'

import { m } from '../../lib/messages'

type NoDataProps = {
  title?: string
  message?: string
  size?: ProblemSize
} & CommonProblemProps

export const NoData = ({
  title: titleStr,
  message,
  tag,
  size = 'large',
  imgSrc,
  imgAlt,
  noBorder,
  dataTestId,
  ...rest
}: NoDataProps & TestSupport) => {
  const { formatMessage } = useLocale()
  const title = titleStr ?? formatMessage(m.noDataTitle)

  // Custom empty state if imgSrc, titleStr and message are provided
  if (imgSrc && titleStr && message) {
    return (
      <Box
        dataTestId={dataTestId}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={['columnReverse', 'columnReverse', 'row']}
        columnGap={[2, 4, 8, 8, 20]}
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
        paddingX={[3, 3, 5]}
        rowGap={[7, 7, 0]}
      >
        <Box display="flex" flexDirection="column" rowGap={1}>
          <Text variant="h2" as="h2" color="dark400">
            {title}
          </Text>
          <Text whiteSpace="preLine">{message}</Text>
        </Box>
        <img src={imgSrc} alt={imgAlt ?? title} className={styles.img} />
      </Box>
    )
  }

  return (
    <ProblemTemplate
      variant="info"
      {...(tag ? { tag } : { showIcon: true })}
      title={title}
      message={message ?? formatMessage(m.noDataMessage)}
      dataTestId={dataTestId}
      noBorder={noBorder}
      titleSize="h2"
      {...rest}
    />
  )
}
