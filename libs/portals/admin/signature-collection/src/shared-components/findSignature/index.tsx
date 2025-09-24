import {
  Box,
  FilterInput,
  Text,
  Table as T,
  GridColumn,
  GridRow,
  GridContainer,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useState } from 'react'
import { useSignatureCollectionSignatureLookupQuery } from './findSignature.generated'
import { SkeletonSingleRow } from '../compareLists/skeleton'

const { Table, Row, Head, HeadData, Body, Data } = T

const FindSignature = ({ collectionId }: { collectionId: string }) => {
  const { formatMessage } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')

  const { data, loading } = useSignatureCollectionSignatureLookupQuery({
    variables: {
      input: {
        collectionId: collectionId,
        nationalId: searchTerm.replace(/[^0-9]/g, ''),
      },
    },
    skip: searchTerm.replace(/[^0-9]/g, '').length !== 10,
  })

  return (
    <Box>
      <GridContainer>
        <GridRow marginBottom={5}>
          <GridColumn span={['12/12', '12/12', '7/12', '7/12']}>
            <FilterInput
              name="searchSignee"
              value={searchTerm}
              onChange={(v) => {
                setSearchTerm(v)
              }}
              placeholder={formatMessage(m.searchNationalIdPlaceholder)}
              backgroundColor="blue"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {loading && (
        <Box marginBottom={5}>
          <SkeletonSingleRow />
        </Box>
      )}
      {data?.signatureCollectionSignatureLookup &&
        (data?.signatureCollectionSignatureLookup.length > 0 ? (
          <Box marginBottom={5}>
            <Table>
              <Head>
                <Row>
                  <HeadData>{formatMessage(m.signeeName)}</HeadData>
                  <HeadData>{formatMessage(m.signeeListSigned)}</HeadData>
                  <HeadData>{formatMessage(m.signeeListSignedType)}</HeadData>
                  <HeadData>{formatMessage(m.signeePage)}</HeadData>
                  <HeadData>{formatMessage(m.signeeListSignedStatus)}</HeadData>
                </Row>
              </Head>
              <Body>
                {data?.signatureCollectionSignatureLookup?.map((s) => {
                  const bg = s.valid ? 'white' : 'red100'
                  const fontWeight = s.valid ? 'regular' : 'semiBold'
                  return (
                    <Row key={s.id}>
                      <Data
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {s.signee.name}
                      </Data>
                      <Data
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {s.listTitle}
                      </Data>
                      <Data
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {formatMessage(
                          s.isDigital
                            ? m.signeeListSignedDigital
                            : m.signeeListSignedPaper,
                        )}
                      </Data>
                      <Data
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {s.pageNumber ?? '-'}
                      </Data>
                      <Data
                        text={{
                          variant: 'medium',
                          fontWeight: fontWeight,
                        }}
                        box={{ background: bg }}
                      >
                        {formatMessage(
                          s.valid
                            ? m.signeeSignatureValid
                            : m.signeeSignatureInvalid,
                        )}
                      </Data>
                    </Row>
                  )
                })}
              </Body>
            </Table>
          </Box>
        ) : (
          <Box marginBottom={5}>
            <Text>{formatMessage(m.noSigneeFoundOverviewText)}</Text>
          </Box>
        ))}
    </Box>
  )
}

export default FindSignature
