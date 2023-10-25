import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Text, Box } from '@island.is/island-ui/core'
import { EmptyImageSmall } from './EmptyImage'
import { messages } from '../../utils/messages'
import { Problem } from '@island.is/react-spa/shared'

type DocumentRendererProps = {
  text?: string
  error?: boolean
}

export const NoPDF: FC<DocumentRendererProps> = ({ text, error }) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      paddingTop={[0, 10]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="full"
      width="full"
    >
      {error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          paddingTop={[3, 0]}
          style={{ maxWidth: 640 }}
        >
          <Problem
            type="not_found"
            message={text}
            title={formatMessage(m.errorFetch)}
          />
        </Box>
      ) : (
        <>
          <Box
            width="full"
            display="flex"
            justifyContent="center"
            marginBottom={3}
          >
            <EmptyImageSmall style={{ maxHeight: 140 }} />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            paddingTop={[3, 0]}
            style={{ maxWidth: 370 }}
          >
            <Text marginBottom={1} variant="h3" fontWeight="medium">
              {text ?? formatMessage(messages.pickDocument)}
            </Text>
          </Box>
        </>
      )}
    </Box>
  )
}

export default NoPDF
