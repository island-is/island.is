import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { info } from '../../lib/messages'

export const CommissionDocument: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={2}>
      <Text>
        {formatMessage(
          info.general.commissionsPageDescriptionOfDocumentTextOne,
        )}
      </Text>
      <Inline alignY="center" space={3}>
        <Text>
          {formatMessage(
            info.general.commissionsPageDescriptionOfDocumentTextTwo,
          )}
        </Text>
        <a
          href={
            'https://assets.ctfassets.net/8k0h54kbe6bj/MB2Kv7jA0vGPpsB9EUM8H/3ce4660155c428ca6ff6d34819731ce0/umbod-utfyllanleg.pdf'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" icon="open" iconType="outline">
            {formatMessage(info.general.comissionPageButtonName)}
          </Button>
        </a>
      </Inline>
    </Box>
  )
}
