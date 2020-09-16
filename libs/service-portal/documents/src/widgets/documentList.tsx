import React from 'react'
import {
  Typography,
  Box,
  Stack,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { ActionCardLoader } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard/DocumentCard'
import { useLocale, useNamespaces } from '@island.is/localization'

const pageSize = 2
const dateFrom = new Date('2000-01-01T00:00:00.000')
const dateTo = new Date()

export const DocumentList: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useListDocuments(
    userInfo.profile.natreg,
    dateFrom,
    dateTo,
    1,
    pageSize,
  )

  return (
    <>
      <Stack space={2}>
        {loading && <ActionCardLoader repeat={3} />}
        {error && (
          <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
            <Typography variant="h3">
              {formatMessage({
                id: 'sp.documents:error',
                defaultMessage:
                  'Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis',
              })}
            </Typography>
          </Box>
        )}
        {!loading && !error && data?.length === 0 && (
          <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
            <Typography variant="h3">
              {formatMessage({
                id: 'sp.documents:not-found',
                defaultMessage:
                  'Engin skjöl fundust fyrir gefin leitarskilyrði',
              })}
            </Typography>
          </Box>
        )}
        {data?.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </Stack>
      <Box display="flex" justifyContent="flexEnd" marginTop={3}>
        <Link to={ServicePortalPath.RafraenSkjolRoot}>
          <Button variant="text" icon="arrowRight">
            {formatMessage({
              id: 'sp.documents:goto-documents',
              defaultMessage: 'Fara í rafræn skjöl',
            })}
          </Button>
        </Link>
      </Box>
    </>
  )
}

export default DocumentList
