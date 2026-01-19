import {
  Box,
  Button,
  Icon,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FALLBACK_ORG_LOGO_URL,
  LinkResolver,
  m,
  ORG_LOGO_PARAMS,
} from '@island.is/portals/my-pages/core'
import {
  DocumentLine,
  DocumentsPaths,
  useDocumentList,
} from '@island.is/portals/my-pages/documents'
import cn from 'classnames'
import { FC } from 'react'
import * as styles from './DocumentsDisplay.css'

import DocumentsEmpty from '../DocumentsEmpty/DocumentsEmpty'
import { HealthPaths } from '../../../../lib/paths'
import { messages } from '../../../../lib/messages'

const DocumentsDisplay: FC = () => {
  const { formatMessage } = useLocale()

  const { filteredDocuments, loading } = useDocumentList()

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
            <Icon icon="mail" type="outline" color="blue400" />
          </Box>
          <Text as="h2" variant="h4" color="blue400" truncate>
            {formatMessage(m.documents)}
          </Text>

          <Box borderRadius="full" />
        </Box>
      </LinkResolver>
      {loading ? (
        <Box marginTop={4}>
          <SkeletonLoader
            space={2}
            repeat={6}
            display="block"
            width="full"
            height={65}
          />
        </Box>
      ) : filteredDocuments.length > 0 ? (
        filteredDocuments.slice(0, 4).map((doc, i) => (
          <Box key={doc.id}>
            <DocumentLine
              img={
                doc?.sender?.logoUrl
                  ? doc.sender.logoUrl.concat(ORG_LOGO_PARAMS)
                  : FALLBACK_ORG_LOGO_URL
              }
              documentLine={doc}
              active={false}
              asFrame
              includeTopBorder={i === 0}
            />
          </Box>
        ))
      ) : (
        <DocumentsEmpty hasDelegationAccess={false} /> // check delegation access if needed
      )}
      <Box textAlign="center" marginBottom={1} printHidden marginY={3}>
        <LinkResolver href={HealthPaths.HealthPregnancyCommunications}>
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
