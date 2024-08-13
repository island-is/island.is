import {
  Box,
  Stack,
  Text,
  Table as T,
  Button,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useLocation } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from './Signees'
import CancelCollection from '../../../Presidential/OwnerView/CancelCollection'
import PersonLookupModal from '../PersonLookupModal'

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const listId = pathname.replace(
    '/min-gogn/listar/althingis-medmaelasofnun/',
    '',
  )
  const { listInfo, loadingList } = useGetSignatureList(listId)

  return (
    <>
      {/*!loadingList && !!listInfo && (*/}
      <Stack space={5}>
        <Box>
          <Text variant="h3">
            {listInfo?.candidate.name + ' - ' + listInfo?.area.name}
          </Text>
        </Box>
        <Box display={['block', 'flex']} justifyContent="spaceBetween">
          <Box>
            <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
            {/*<Text>
                {format(new Date(listInfo.startTime), "dd.MM.yyyy") +
                  " - " +
                  format(new Date(listInfo.endTime), "dd.MM.yyyy")}
              </Text>*/}
          </Box>
          <Box marginTop={[2, 0]}>
            <Text variant="h5">{formatMessage(m.numberOfSigns)}</Text>
            <Text>{listInfo?.numberOfSignatures}</Text>
          </Box>
          <Box marginTop={[2, 0]}>
            {!!listInfo?.collectors?.length && (
              <>
                <Text marginTop={[2, 0]} variant="h5">
                  {formatMessage(m.coOwners)}
                </Text>
                {listInfo?.collectors?.map((collector) => (
                  <Box
                    key={collector.name}
                    width="half"
                    display={['block', 'flex']}
                    justifyContent="spaceBetween"
                  >
                    <Text>{collector.name}</Text>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
        <Signees />

        {/* Umsjónaraðilar */}
        <Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="baseline"
            marginBottom={3}
          >
            <Text variant="h4">
              {formatMessage(m.supervisors) + ' '}
              <Tooltip placement="right" text="info" color="blue400" />
            </Text>
            <PersonLookupModal
              collectionId={'1'}
              title={formatMessage(m.addSupervisor)}
            />
          </Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.personName)}</T.HeadData>
                <T.HeadData>{formatMessage(m.personNationalId)}</T.HeadData>
                <T.HeadData>{formatMessage(m.constituency)}</T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              <T.Row>
                <T.Data>{'Nafni Nafnason'}</T.Data>
                <T.Data>{'010130-3019'}</T.Data>
                <T.Data>{'Reykjavíkurkjördæmi Suður'}</T.Data>
                <T.Data>
                  <Button
                    variant="text"
                    icon="trash"
                    iconType="outline"
                    size="small"
                  />
                </T.Data>
              </T.Row>
            </T.Body>
          </T.Table>
        </Box>
        <CancelCollection collectionId={'1'} />
      </Stack>
      {/*)}*/}
    </>
  )
}

export default ViewList
