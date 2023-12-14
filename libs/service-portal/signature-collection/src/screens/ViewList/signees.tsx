import {
  Box,
  Text,
  Table as T,
  Pagination,
  Input,
  Button,
  FilterInput,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import * as styles from '../styles.css'
import { useGetListSignees } from '../hooks'
import { useLocation } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import { SkeletonTable } from '../Skeletons'

const Signees = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const listId = pathname.replace('/min-gogn/medmaelalistar/', '')

  const [searchTerm, setSearchTerm] = useState('')
  const { listSignees, loadingSignees } = useGetListSignees(listId)
  const [signees, setSignees] = useState(listSignees)

  const [page, setPage] = useState(1)
  const page_size = 10

  // list search
  useEffect(() => {
    if (searchTerm.length > 0) {
      let filteredSignees = []

      filteredSignees = signees.filter((s) => {
        return (
          s.signee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.signee.nationalId.includes(searchTerm)
        )
      })

      setPage(1)
      setSignees(filteredSignees)
    } else {
      setSignees(listSignees)
    }
  }, [searchTerm])

  useEffect(() => {
    if (listSignees) {
      setSignees(listSignees)
    }
  }, [listSignees])

  return (
    <Box marginTop={[0, 5]}>
      <Text variant="h5">{formatMessage(m.signeesHeader)}</Text>
      <Box
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        marginTop={3}
      >
        <Box className={styles.searchWidth} marginBottom={[2, 0]}>
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
            placeholder={formatMessage(m.searchInListPlaceholder)}
            backgroundColor="white"
          />
        </Box>
        <Button variant="utility" icon="download">
          {formatMessage(m.downloadList)}
        </Button>
      </Box>
      {!loadingSignees ? (
        signees.length > 0 ? (
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
                {signees.map((s) => {
                  const boxColor = /*person.paper ? 'purple100' : */ 'white'
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
                      <T.Data></T.Data>
                      {/*<T.Data box={{ background: boxColor }}>
                        {person.paper && (
                          <Icon icon="document" type="outline" color="blue400" />
                        )}
                        </T.Data>*/}
                    </T.Row>
                  )
                })}
              </T.Body>
            </T.Table>

            <Box marginTop={5}>
              <Pagination
                totalItems={signees.length}
                itemsPerPage={page_size}
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
          <Text>{formatMessage(m.noSignees)}</Text>
        )
      ) : (
        <SkeletonTable />
      )}
    </Box>
  )
}

export default Signees
