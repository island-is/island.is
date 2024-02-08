import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Text, Box } from '@island.is/island-ui/core'
import { EmptyImageSmall } from './EmptyImage'
import { messages } from '../../utils/messages'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from '../OverviewDisplay/OverviewDisplay.css'

type DocumentRendererProps = {
  text?: string
  error?: boolean
}

export const NoPDF: FC<DocumentRendererProps> = ({ text, error }) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      marginLeft={8}
      marginTop={3}
      padding={5}
      borderRadius="large"
      border={error ? undefined : 'standard'}
      {...(!error && {
        display: 'flex',
        alignItems: 'center',
      })}
      className={styles.docWrap}
    >
      {error ? (
        <Problem
          type="internal_service_error"
          message={text}
          title={formatMessage(m.errorFetch)}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          width="full"
        >
          <EmptyImageSmall style={{ maxHeight: 140, marginBottom: '24px' }} />
          <Text variant="h4">{formatMessage(messages.pickDocument)}</Text>
        </Box>
      )}
    </Box>
  )
}

export default NoPDF
