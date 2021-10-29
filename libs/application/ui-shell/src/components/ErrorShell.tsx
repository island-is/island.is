import React, { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { StaticText, coreMessages } from '@island.is/application/core'

import * as styles from '../lib/FormShell.css'

interface Props {
  status?: number
  title?: StaticText
  subTitle?: StaticText
}

export const ErrorShell: FC<Props> = ({ status, title, subTitle }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="full"
      paddingBottom={20}
      className={styles.root}
    >
      <Text
        variant="eyebrow"
        as="div"
        marginBottom={2}
        color="purple400"
        fontWeight="semiBold"
      >
        {status ?? 404}
      </Text>

      <Text variant="h1" as="h1" marginBottom={3}>
        {formatMessage(title ?? coreMessages.notFoundTitle)}
      </Text>

      <Text variant="intro" as="p">
        {formatMessage(subTitle ?? coreMessages.notFoundSubTitle)}
      </Text>
    </Box>
  )
}
