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
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../../lib/messages'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import { pageSize } from '../../../lib/utils'

const Signees = () => {
  const { formatMessage } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { signees } = useLoaderData() as { signees: Signature[] }

  return (
    <Box marginTop={5}>
      <Text variant="h3">
        {formatMessage(m.listSigneesHeader) + ` (${signees.length})`}
      </Text>

      <GridRow marginBottom={5} marginTop={3}>
        <GridColumn span={['12/12', '12/12', '7/12']}>
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
            placeholder={formatMessage(m.searchInListPlaceholder)}
            backgroundColor="white"
          />
        </GridColumn>
      </GridRow>
      {signees && signees.length > 0 && (
        <Box marginTop={5}>
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
                  const boxColor =
                    s.signatureType === 'Paper' ? 'purple100' : 'white'

                  return (
                    <T.Row key={s.id}>
                      <T.Data
                        box={{ background: boxColor }}
                        text={{ variant: 'medium' }}
                      >
                        {format(new Date(), 'dd.MM.yyyy')}
                      </T.Data>
                      <T.Data
                        box={{ background: boxColor }}
                        text={{ variant: 'medium' }}
                      >
                        {s.signee.name}
                      </T.Data>
                      <T.Data
                        box={{ background: boxColor }}
                        text={{ variant: 'medium' }}
                      >
                        {formatNationalId(s.signee.nationalId)}
                      </T.Data>
                      <T.Data
                        box={{ background: boxColor }}
                        text={{ variant: 'medium' }}
                      >
                        {formatMessage(m.tempMessage)}
                      </T.Data>
                      <T.Data box={{ background: boxColor }}>
                        {s.signatureType === 'Paper' && (
                          <Icon
                            icon="document"
                            type="outline"
                            color="blue400"
                          />
                        )}
                      </T.Data>
                    </T.Row>
                  )
                })}
            </T.Body>
          </T.Table>

          <Box marginTop={5}>
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
      )}
    </Box>
  )
}

export default Signees
