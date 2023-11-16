import {
  Box,
  Text,
  Table as T,
  Pagination,
  Input,
  Button,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { mockSingleList } from '../../lib/utils'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { useState } from 'react'
import * as styles from '../styles.css'

const Signees = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={5}>
      <Text variant="h5">{formatMessage(m.signeesHeader)}</Text>
      <Box
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        marginTop={3}
      >
        <Box className={styles.searchWidth} marginBottom={[2, 0]}>
          <Input
            name="searchSignee"
            placeholder={formatMessage(m.searchInListPlaceholder)}
            icon={{ name: 'search' }}
            backgroundColor="blue"
            size="sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Button variant="utility" icon="download">
          {formatMessage(m.downloadList)}
        </Button>
      </Box>
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
            {mockSingleList.people.map((person) => {
              const boxColor = person.paper ? 'purple100' : 'white'
              return (
                <T.Row key={person.name}>
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
                    {person.name}
                  </T.Data>
                  <T.Data
                    box={{ background: boxColor }}
                    text={{ variant: 'medium' }}
                  >
                    {formatMessage(m.tempMessage)}
                  </T.Data>
                  <T.Data
                    box={{ background: boxColor }}
                    text={{ variant: 'medium' }}
                  >
                    {formatMessage(m.tempMessage)}
                  </T.Data>
                  <T.Data box={{ background: boxColor }}>
                    {person.paper && (
                      <Icon icon="document" type="outline" color="blue400" />
                    )}
                  </T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>

        <Box marginTop={5}>
          <Pagination
            page={1}
            totalPages={5}
            renderLink={(page, className, children) => (
              <Box cursor="pointer" className={className}>
                {children}
              </Box>
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Signees
