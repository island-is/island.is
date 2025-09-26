import { Box, Text, ProblemTemplate } from '@island.is/island-ui/core'
import {
  problemTemplateContainer as styleContainer,
  problemTemplateImg as styleImg,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { useLocale } from '@island.is/localization'
import { CommonProblemProps, Message, ProblemSize } from './problem.types'

import { m } from '../../lib/messages'

type NoDataProps = {
  title?: string
  message?: Message
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
  titleSize = 'h2',
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
        className={styleContainer(
          noBorder
            ? {
                noBorder: true,
              }
            : {
                blue: true,
              },
        )}
        paddingY={[5, 8]}
        paddingX={[3, 3, 5, 10]}
        rowGap={[7, 7, 0]}
      >
        <Box
          display="flex"
          flexDirection="column"
          rowGap={1}
          justifyContent={['center', 'center', 'flexStart']}
        >
          <Text variant={titleSize} as={titleSize} color="dark400">
            {title}
          </Text>
          <Text whiteSpace="preLine">{message}</Text>
        </Box>
        <img src={imgSrc} alt={imgAlt ?? title} className={styleImg} />
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
      titleSize={titleSize}
      {...rest}
    />
  )
}
