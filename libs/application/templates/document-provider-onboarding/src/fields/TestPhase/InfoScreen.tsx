import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Link, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

const TestPhaseInfoScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={[2, 3]}>
      <Box>
        <Text>
          {formatText(m.testPhaseInfoMessage, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={formatText(m.testPhaseInfoLinkUrl1, application, formatMessage)}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {formatText(m.testPhaseInfoLinkText1, application, formatMessage)}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={formatText(m.testPhaseInfoLinkUrl2, application, formatMessage)}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {formatText(m.testPhaseInfoLinkText2, application, formatMessage)}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={formatText(m.testPhaseInfoLinkUrl3, application, formatMessage)}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {formatText(m.testPhaseInfoLinkText3, application, formatMessage)}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Text>
          {formatText(m.testPhaseInfoFooterMessage, application, formatMessage)}
        </Text>
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
