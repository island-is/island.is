import { useEffect, useState } from 'react'
import {
  Box,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate, pageSize } from '../../lib/utils'
import { m } from '../../lib/messages'
import DropdownExport from './ExportPetition'
import { Endorsement, EndorsementList } from '@island.is/api/schema'
import { useGetPetitionEndorsementsPaginated } from '../hooks'

const PetitionsTable = (data: {
  canEdit: boolean
  listId: string
  petition?: EndorsementList
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [cursor, setCursor] = useState<string>('')
  const [pageDirection, setPageDirection] = useState<'before' | 'after' | ''>(
    '',
  )

  const { endorsements, loadingEndorsements, refetch } =
    useGetPetitionEndorsementsPaginated(data.listId, cursor, pageDirection)

  useEffect(() => {
    refetch()
  }, [cursor, pageDirection])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        <Box>
          {data.canEdit && (
            <DropdownExport petitionId={data.listId} />
          )}
        </Box>
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.date)}</T.HeadData>
              <T.HeadData>{formatMessage(m.name)}</T.HeadData>
              {data.canEdit && (
                <T.HeadData>{formatMessage(m.locality)}</T.HeadData>
              )}
            </T.Row>
          </T.Head>
          <T.Body>
            {!loadingEndorsements &&
              endorsements.data?.map((petition: Endorsement) => {
                return (
                  <T.Row key={petition.id}>
                    <T.Data text={{ variant: 'medium' }}>
                      {formatDate(petition.created)}
                    </T.Data>
                    <T.Data text={{ variant: 'medium' }}>
                      {petition.meta.fullName
                        ? petition.meta.fullName
                        : formatMessage(m.noName)}
                    </T.Data>
                    {data.canEdit && (
                      <T.Data text={{ variant: 'medium' }}>
                        {petition.meta.locality ? petition.meta.locality : ''}
                      </T.Data>
                    )}
                  </T.Row>
                )
              })}
          </T.Body>
        </T.Table>

        {endorsements && !!endorsements.data?.length ? (
          <Pagination
            page={page}
            totalItems={endorsements.totalCount}
            itemsPerPage={pageSize}
            renderLink={(p, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                component="button"
                onClick={() => {
                  setPage(p)
                  if (p > page && endorsements.pageInfo.hasNextPage) {
                    setPageDirection('after')
                    setCursor(endorsements.pageInfo.endCursor ?? '')
                  } else if (
                    p < page &&
                    endorsements.pageInfo.hasPreviousPage
                  ) {
                    setPageDirection('before')
                    setCursor(endorsements.pageInfo.startCursor ?? '')
                  }
                }}
              >
                {children}
              </Box>
            )}
          />
        ) : (
          <Text>{formatMessage(m.noSignatures)}</Text>
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable
