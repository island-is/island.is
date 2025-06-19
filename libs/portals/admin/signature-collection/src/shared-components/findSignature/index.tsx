import { Box, FilterInput, Text, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useState } from 'react'
import { useSignatureCollectionSignatureLookupQuery } from './findSignature.generated'
import { SkeletonSingleRow } from '../compareLists/skeleton'

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
      <Box
        width="full"
        marginBottom={6}
        display="flex"
        justifyContent="spaceBetween"
      >
        <Box width="half">
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v)
            }}
            placeholder={formatMessage(m.searchNationalIdPlaceholder)}
            backgroundColor="blue"
          />
        </Box>
      </Box>
      {loading && (
        <Box marginBottom={6}>
          <SkeletonSingleRow />
        </Box>
      )}
      {data?.signatureCollectionSignatureLookup &&
        (data?.signatureCollectionSignatureLookup.length > 0 ? (
          <Box marginBottom={6}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.signeeListSigned)}</T.HeadData>
                  <T.HeadData>
                    {formatMessage(m.signeeListSignedType)}
                  </T.HeadData>
                  <T.HeadData>
                    {formatMessage(m.signeeListSignedStatus)}
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {data?.signatureCollectionSignatureLookup?.map((s) => {
                  const bg = s.valid ? 'white' : 'red100'
                  return (
                    <T.Row key={s.id}>
                      <T.Data
                        span={3}
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {s.signee.name}
                      </T.Data>
                      <T.Data
                        span={3}
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {s.listTitle}
                      </T.Data>
                      <T.Data
                        span={3}
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {formatMessage(
                          s.isDigital
                            ? m.signeeListSignedDigital
                            : m.signeeListSignedPaper,
                        )}
                      </T.Data>
                      <T.Data
                        span={3}
                        text={{ variant: 'medium' }}
                        box={{ background: bg }}
                      >
                        {formatMessage(
                          s.valid
                            ? m.signeeSignatureValid
                            : m.signeeSignatureInvalid,
                        )}
                      </T.Data>
                    </T.Row>
                  )
                })}
              </T.Body>
            </T.Table>
          </Box>
        ) : (
          <Box marginBottom={6}>
            <Text>{formatMessage(m.noSigneeFoundOverviewText)}</Text>
          </Box>
        ))}
    </Box>
  )
}

export default FindSignature
