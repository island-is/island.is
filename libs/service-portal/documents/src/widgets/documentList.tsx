import React from 'react'
import { Text, Box, Stack, Button } from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { ActionCardLoader } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard/DocumentCard'
import { useLocale, useNamespaces } from '@island.is/localization'

const maxDocuments = 2

export const DocumentList: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useListDocuments(userInfo.profile.nationalId)

  return (
    <>
      <Stack space={2}>
        {loading && <ActionCardLoader repeat={3} />}
        {error && (
          <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
            <Text variant="h3" as="h3">
              {formatMessage({
                id: 'sp.documents:error',
                defaultMessage:
                  'Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis.',
              })}
            </Text>
          </Box>
        )}
        {!loading && !error && data?.documents.length === 0 && (
          <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
            <Text variant="h3" as="h3">
              {formatMessage({
                id: 'sp.documents:not-found',
                defaultMessage:
                  'Engin skjöl fundust fyrir gefin leitarskilyrði.',
              })}
            </Text>
          </Box>
        )}
        {data?.documents?.slice(0, maxDocuments).map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </Stack>
      <Box display="flex" justifyContent="flexEnd" marginTop={[4, 8]}>
        <Link to={ServicePortalPath.ElectronicDocumentsRoot}>
          <Button variant="primary">
            {formatMessage({
              id: 'sp.documents:goto-documents',
              defaultMessage: 'Fara í pósthólf',
            })}
          </Button>
        </Link>
      </Box>
    </>
  )
}

export default DocumentList
