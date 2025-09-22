import {
  Box,
  Text,
  Table as T,
  Pagination,
  FilterInput,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import sortBy from 'lodash/sortBy'
import EditPage from './EditPage'
import { SkeletonTable } from '../../../lib/skeletons'
import { useGetListSignees } from '../../../hooks'
import { m } from '../../../lib/messages'
import { PaperSignees } from './PaperSignees'
import { formatNationalId } from '@island.is/portals/core'

const Signees = ({
  collectionType,
  totalSignees,
}: {
  collectionType: SignatureCollectionCollectionType
  totalSignees: number
}) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()

  const [searchTerm, setSearchTerm] = useState('')
  const { listSignees, loadingSignees, refetchListSignees } = useGetListSignees(
    id ?? '',
    collectionType,
  )
  const [signees, setSignees] = useState(listSignees)

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    if (!loadingSignees && listSignees.length) {
      setSignees(
        sortBy(listSignees, (item) => {
          return item.created
        }).reverse(),
      )
    }
  }, [listSignees, loadingSignees])

  // list search
  useEffect(() => {
    const filtered = listSignees.filter((s) => {
      return (
        s.signee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatNationalId(s.signee.nationalId).includes(searchTerm) ||
        s.signee.nationalId.includes(searchTerm)
      )
    })

    setPage(1)
    setSignees(filtered)

    // eslint-disable-next-line
  }, [searchTerm])

  return (
    <Box>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(m.signeesHeader)}
      </Text>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
            <FilterInput
              name="searchSignee"
              value={searchTerm}
              onChange={(v) => setSearchTerm(v)}
              placeholder={formatMessage(m.searchInListPlaceholder)}
              backgroundColor="blue"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>

      {!loadingSignees ? (
        signees.length > 0 ? (
          <Box marginTop={3}>
            <Box display="flex" justifyContent="flexEnd">
              <Text variant="eyebrow" marginBottom={2}>
                {`${formatMessage(m.numberOfValidSigns)} ${totalSignees}`}
              </Text>
            </Box>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{formatMessage(m.signeeDate)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.signeeNationalId)}</T.HeadData>
                  <T.HeadData></T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {signees
                  .slice(pageSize * (page - 1), pageSize * page)
                  .map((s) => {
                    const textVariant = 'medium'
                    const bgColor = s.isDigital ? 'white' : 'blueberry100'
                    return (
                      <T.Row key={s.id}>
                        <T.Data
                          text={{ variant: textVariant }}
                          box={{ background: bgColor }}
                          width="20%"
                        >
                          {format(new Date(s.created), 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {s.signee.name}
                        </T.Data>
                        <T.Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {formatNationalId(s.signee.nationalId)}
                        </T.Data>
                        <T.Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {!s.isDigital && (
                            <Box display="flex">
                              <Text>{s.pageNumber}</Text>
                              <EditPage
                                page={s.pageNumber ?? 0}
                                name={s.signee.name}
                                nationalId={formatNationalId(
                                  s.signee.nationalId,
                                )}
                                signatureId={s.id}
                                refetchSignees={refetchListSignees}
                                collectionType={collectionType}
                              />
                            </Box>
                          )}
                        </T.Data>
                      </T.Row>
                    )
                  })}
              </T.Body>
            </T.Table>
            <Box marginTop={3}>
              <Pagination
                totalItems={signees.length}
                itemsPerPage={pageSize}
                page={page}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => setPage(page)}
                    component="button"
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          </Box>
        ) : searchTerm.length > 0 ? (
          <Box display="flex" marginTop={3}>
            <Text>{formatMessage(m.noSigneesFoundBySearch)}</Text>
            <Box marginLeft={1}>
              <Text variant="h5">{searchTerm}</Text>
            </Box>
          </Box>
        ) : (
          <Text marginTop={3}>{formatMessage(m.noSignees)}</Text>
        )
      ) : (
        <SkeletonTable />
      )}
      <PaperSignees
        listId={id ?? ''}
        refetchSignees={refetchListSignees}
        collectionType={collectionType}
      />
    </Box>
  )
}

export default Signees
