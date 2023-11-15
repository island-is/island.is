import {
  Box,
  Text,
  Table as T,
  Pagination,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { mockList } from '../../lib/utils'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { useState } from 'react'

const Signees = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={10}>
      <Text variant="h3">{formatMessage(m.signeesHeader)}</Text>
      <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
        <Box width="half">
          <Input
            name="searchSignee"
            placeholder={formatMessage(m.searchInListPlaceholder)}
            icon={{ name: 'search' }}
            backgroundColor="blue"
            size="sm"
            value={''}
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
            </T.Row>
          </T.Head>
          <T.Body>
            {mockList.people.map((person) => {
              return (
                <T.Row key={person}>
                  <T.Data text={{ variant: 'medium' }}>
                    {format(new Date(), 'dd.MM.yyyy')}
                  </T.Data>
                  <T.Data text={{ variant: 'medium' }}>{person}</T.Data>
                  <T.Data text={{ variant: 'medium' }}>{'temp'}</T.Data>
                  <T.Data text={{ variant: 'medium' }}>{'temp'}</T.Data>
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
