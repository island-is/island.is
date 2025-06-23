import {
  Box,
  Text,
  Table as T,
  Pagination,
  FilterInput,
  GridRow,
  GridColumn,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useEffect, useMemo, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import {
  SignatureCollectionSignature as Signature,
  SignatureCollectionList,
} from '@island.is/api/schema'
import SortSignees from './sortSignees'
import { FiltersSigneeType, getTagConfig, pageSize } from '../../lib/utils'
import { m } from '../../lib/messages'
import EditPage from './editPage'
import FilterSignees from './filterSignees'

const { Table, Head, Row, HeadData, Body, Data } = T

const Signees = ({ list }: { list: SignatureCollectionList }) => {
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
    return allSignees?.filter((s) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase()
      return (
        (filters.signeeType?.length === 0 ||
          (filters.signeeType.includes('digital') && s.isDigital) ||
          (filters.signeeType.includes('paper') && !s.isDigital)) &&
        (filters.pageNumber?.length === 0 ||
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
    <Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h4">{formatMessage(m.listSigneesHeader)}</Text>
        <Tag
          variant={getTagConfig(list).variant}
          outlined={getTagConfig(list).outlined}
        >
          {getTagConfig(list).label}
        </Tag>
      </Box>

      <GridRow marginTop={2} marginBottom={2}>
        <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
            placeholder={formatMessage(m.searchInListPlaceholder)}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <Box display="flex" justifyContent="flexEnd" marginTop={[2, 2, 2, 0]}>
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
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="flexEnd"
            height="full"
            marginTop={[1, 1, 1]}
            flexDirection={['rowReverse', 'rowReverse', 'rowReverse', 'row']}
          >
            {searchTerm?.length > 0 && signees.length > 0
              ? signees.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {formatMessage(m.uploadResultsHeader)}: {signees.length}
                  </Text>
                )
              : signees?.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {formatMessage(m.totalListResults)}:{' '}
                    {list.numberOfSignatures}
                  </Text>
                )}
          </Box>
        </GridColumn>
      </GridRow>

      {signees && signees.length > 0 ? (
        <Box marginTop={3}>
          <Table>
            <Head>
              <Row>
                <HeadData>{formatMessage(m.signeeDate)}</HeadData>
                <HeadData>{formatMessage(m.signeeName)}</HeadData>
                <HeadData>{formatMessage(m.signeeNationalId)}</HeadData>
                <HeadData>{formatMessage(m.signeeAddress)}</HeadData>
                <HeadData>{formatMessage(m.signeePage)}</HeadData>
              </Row>
            </Head>
            <Body>
              {signees.length > 0 &&
                signees
                  .slice(pageSize * (page - 1), pageSize * page)
                  .map((s) => {
                    const textVariant = 'medium'
                    const bgColor = s.isDigital ? 'white' : 'blueberry100'
                    return (
                      <Row key={s.id}>
                        <Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                          style={{ width: '22%' }}
                        >
                          {format(new Date(s.created), 'dd.MM.yyyy HH:mm')}
                        </Data>
                        <Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {s.signee.name}
                        </Data>
                        <Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {formatNationalId(s.signee.nationalId)}
                        </Data>
                        <Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                          }}
                        >
                          {s.signee.address}
                        </Data>
                        <Data
                          text={{ variant: textVariant }}
                          box={{
                            background: bgColor,
                            alignItems: 'center',
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
                                collectionType={list.collectionType}
                              />
                            </Box>
                          )}
                        </Data>
                      </Row>
                    )
                  })}
            </Body>
          </Table>
          <Box marginTop={3}>
            <Pagination
              totalItems={signees?.length}
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
      ) : searchTerm?.length > 0 ? (
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
