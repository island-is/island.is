import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'
import * as styles from './FormerCountryErrorMessage.treat'
import { m } from '../../forms/messages'

const FormerCountryErrorMessage: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2}>
      <Box
        padding={2}
        borderRadius="large"
        background="red100"
        borderColor="red200"
        borderWidth="standard"
      >
        <Stack space={1}>
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              marginRight={2}
              flexShrink={0}
            >
              <Icon type="filled" color="red400" icon="warning" />
            </Box>
            <Text as="h5" variant="h5">
              {formatText(m.waitingPeriodTitle, application, formatMessage)}
            </Text>
          </Box>
          <Box className={styles.messageWrap}>
            <Text variant="small">
              <Markdown>
                {formatText(
                  m.waitingPeriodDescription,
                  application,
                  formatMessage,
                )}
              </Markdown>
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default FormerCountryErrorMessage
