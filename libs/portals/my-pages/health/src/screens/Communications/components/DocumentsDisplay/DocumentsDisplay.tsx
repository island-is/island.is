import { Box, Button, Icon, IconProps, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import cn from 'classnames'
import { FC } from 'react'
import * as styles from './DocumentsDisplay.css'

import { DocumentV2 } from '@island.is/api/schema'
import { messages } from '../../../../lib/messages'
import { DocumentsList } from '../DocumentsList/DocumentsList'

const DocumentsDisplay: FC<{
  title?: string
  icon?: IconProps['icon']
  link?: string
  documents?: DocumentV2[]
  loading?: boolean
}> = ({ title, icon, link, documents, loading }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderRadius="large"
      paddingY={3}
      paddingX={4}
      borderWidth="standard"
      borderColor="blue200"
      marginBottom={3}
    >
      <LinkResolver
        className={styles.mailLink}
        href={DocumentsPaths.ElectronicDocumentsRoot}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingBottom={1}
        >
          <Box
            paddingRight={1}
            display="flex"
            alignItems="center"
            className={cn([styles.mailIcon, styles.svgOutline])}
          >
            <Icon icon={icon ?? 'mail'} type="outline" color="blue400" />
          </Box>
          <Text as="h2" variant="h4" color="blue400" truncate>
            {title ?? formatMessage(m.documents)}
          </Text>

          <Box borderRadius="full" />
        </Box>
      </LinkResolver>
      <DocumentsList documents={documents} loading={loading} />

      <Box textAlign="center" marginBottom={1} printHidden marginY={3}>
        <LinkResolver href={link ?? DocumentsPaths.ElectronicDocumentsRoot}>
          <Button
            icon="arrowForward"
            iconType="filled"
            size="small"
            type="button"
            variant="text"
          >
            {formatMessage(messages.seeAllMessages)}
          </Button>
        </LinkResolver>
      </Box>
    </Box>
  )
}

export default DocumentsDisplay
