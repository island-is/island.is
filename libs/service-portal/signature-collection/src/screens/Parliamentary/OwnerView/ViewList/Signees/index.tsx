import {
  Box,
  Text,
  Table as T,
  Pagination,
  FilterInput,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../../lib/messages'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useGetListSignees } from '../../../../../hooks'
import { useParams } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import { SkeletonTable } from '../../../../../skeletons'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import { PaperSignees } from './PaperSignees'
import sortBy from 'lodash/sortBy'

const Signees = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }

  const [searchTerm, setSearchTerm] = useState('')
  const { listSignees, loadingSignees, refetchListSignees } =
    useGetListSignees(id)
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
  }, [listSignees])

  // list search
  useEffect(() => {
    let filteredSignees: Signature[] = listSignees

    filteredSignees = filteredSignees.filter((s) => {
      return (
        s.signee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatNationalId(s.signee.nationalId).includes(searchTerm) ||
        s.signee.nationalId.includes(searchTerm)
      )
    })

    setPage(1)
    setSignees(filteredSignees)
  }, [searchTerm])

  return (
    <Box>
      <Text variant="h4">{formatMessage(m.signeesHeader)}</Text>
      <Box marginTop={1} width="half">
        <FilterInput
          name="searchSignee"
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          placeholder={formatMessage(m.searchInListPlaceholder)}
          backgroundColor="white"
        />
      </Box>
      {!loadingSignees ? (
        signees.length > 0 ? (
          <Box marginTop={3}>
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
                  .map((s: Signature) => {
                    return (
                      <T.Row key={s.id}>
                        <T.Data text={{ variant: 'medium' }} width={'20%'}>
                          {format(new Date(), 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data text={{ variant: 'medium' }}>
                          {s.signee.name}
                        </T.Data>
                        <T.Data text={{ variant: 'medium' }}>
                          {formatNationalId(s.signee.nationalId)}
                        </T.Data>
                        <T.Data text={{ variant: 'medium' }}>
                          {!s.isDigital && (
                            <Box display={'flex'}>
                              <Icon
                                icon="document"
                                type="outline"
                                color="blue400"
                              />
                              <Text>{s.pageNumber}</Text>
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
      <PaperSignees listId={id} refetchSignees={refetchListSignees} />
    </Box>
  )
}

export default Signees