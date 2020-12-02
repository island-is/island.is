import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Link, Text } from '@island.is/island-ui/core'
import { m } from '../../forms/messages'

const TestPhaseInfoScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return (
    <Box marginTop={[2, 3]}>
      <Box>
        <Text>{m.testPhaseInfoMessage.defaultMessage}</Text>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={m.testPhaseInfoLinkUrl1.defaultMessage}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {m.testPhaseInfoLinkText1.defaultMessage}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={m.testPhaseInfoLinkUrl2.defaultMessage}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {m.testPhaseInfoLinkText2.defaultMessage}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href={m.testPhaseInfoLinkUrl3.defaultMessage}
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          {m.testPhaseInfoLinkText3.defaultMessage}
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Text>{m.testPhaseInfoFooterMessage.defaultMessage}</Text>
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
