import {
  Box,
  Text,
  Table as T,
  Pagination,
  Icon,
  FilterInput,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useEffect, useMemo, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import SortSignees from './sortSignees'
import { FiltersSigneeType, pageSize } from '../../lib/utils'
import { m } from '../../lib/messages'
import EditPage from './editPage'
import FilterSignees from './filterSignees'

const Signees = ({ numberOfSignatures }: { numberOfSignatures: number }) => {
  const { formatMessage } = useLocale()

  const { allSignees } = useLoaderData() as { allSignees: Signature[] }
  const [signees, setSignees] = useState(allSignees)

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState<FiltersSigneeType>({
    signeeType: [],
    pageNumber: [],
  })

  const filteredSignees = useMemo(() => {
    return allSignees.filter((s) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase()
      return (
        (filters.signeeType.length === 0 ||
          (filters.signeeType.includes('digital') && s.isDigital) ||
          (filters.signeeType.includes('paper') && !s.isDigital)) &&
        (filters.pageNumber.length === 0 ||
          filters.pageNumber.includes(String(s.pageNumber))) &&
        (s.signee.name.toLowerCase().includes(lowercaseSearchTerm) ||
          formatNationalId(s.signee.nationalId).includes(searchTerm) ||
          s.signee.nationalId.includes(searchTerm))
      )
    })
  }, [allSignees, searchTerm, filters])

  useEffect(() => {
    setPage(1)
    setSignees(filteredSignees)
  }, [filteredSignees])

  return (
    <Box marginTop={8}>
      <Text variant="h4">{formatMessage(m.listSigneesHeader)}</Text>

      <GridRow marginTop={2} marginBottom={4}>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
            placeholder={formatMessage(m.searchInListPlaceholder)}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            height="full"
            marginTop={[1, 1, 0]}
            flexDirection={['rowReverse', 'rowReverse', 'rowReverse', 'row']}
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              marginTop={[2, 2, 2, 0]}
            >
              <SortSignees
                signees={signees}
                setSignees={setSignees}
                setPage={setPage}
              />
              <Box marginLeft={1}>
                <FilterSignees
                  signees={signees}
                  filters={filters}
                  onSetFilters={setFilters}
                />
              </Box>
            </Box>
            {searchTerm.length > 0 && signees.length > 0
              ? signees.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {formatMessage(m.uploadResultsHeader)}: {signees.length}
                  </Text>
                )
              : signees.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {/* using numberOfSignatures coming from list info for true total number of signees */}
                    {formatMessage(m.totalListResults)}: {numberOfSignatures}
                  </Text>
                )}
          </Box>
        </GridColumn>
      </GridRow>

      {signees && signees.length > 0 ? (
        <Box marginTop={3}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.signeeDate)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeNationalId)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeAddress)}</T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {signees
                .slice(pageSize * (page - 1), pageSize * page)
                .map((s) => {
                  return (
                    <T.Row key={s.id}>
                      <T.Data
                        text={{ variant: 'medium' }}
                        box={{
                          background: s.isDigital ? 'white' : 'blueberry100',
                        }}
                        style={{ width: '22%' }}
                      >
                        {format(new Date(s.created), 'dd.MM.yyyy HH:mm')}
                      </T.Data>
                      <T.Data
                        text={{ variant: 'medium' }}
                        box={{
                          background: s.isDigital ? 'white' : 'blueberry100',
                        }}
                      >
                        {s.signee.name}
                      </T.Data>
                      <T.Data
                        text={{ variant: 'medium' }}
                        box={{
                          background: s.isDigital ? 'white' : 'blueberry100',
                        }}
                      >
                        {formatNationalId(s.signee.nationalId)}
                      </T.Data>
                      <T.Data
                        text={{ variant: 'medium' }}
                        box={{
                          background: s.isDigital ? 'white' : 'blueberry100',
                        }}
                      >
                        {s.signee.address}
                      </T.Data>
                      <T.Data
                        box={{
                          background: s.isDigital ? 'white' : 'blueberry100',
                        }}
                      >
                        {!s.isDigital && (
                          <Box display="flex">
                            <Box marginRight={1}>
                              <Text>{s.pageNumber}</Text>
                            </Box>
                            <Icon
                              icon="document"
                              type="outline"
                              color="blue400"
                            />
                            <EditPage
                              page={s.pageNumber ?? 0}
                              name={s.signee.name}
                              nationalId={formatNationalId(s.signee.nationalId)}
                              signatureId={s.id}
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
        <Box display="flex">
          <Text>{formatMessage(m.noSigneesFoundBySearch)}</Text>
          <Box marginLeft={1}>
            <Text variant="h5">{searchTerm}</Text>
          </Box>
        </Box>
      ) : (
        <Text>{formatMessage(m.noSignees)}</Text>
      )}
    </Box>
  )
}

export default Signees
