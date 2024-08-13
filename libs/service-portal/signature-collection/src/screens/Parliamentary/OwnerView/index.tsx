import {
  ActionCard,
  AlertMessage,
  Box,
  Stack,
  Button,
  Text,
  Table as T,
  Tooltip,
} from '@island.is/island-ui/core'
import { constituencies } from '../../../lib/constants'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import PersonLookupModal from './PersonLookupModal'
import { format } from 'path'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

const OwnerView = () => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

  return (
    <Stack space={3}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="baseline"
        marginTop={3}
      >
        <Text variant="h4">{formatMessage(m.myListsDescription)}</Text>
        <AlertMessage type="info" message="Söfnun lýkur 16.10.2024" />
      </Box>
      {constituencies.map((c: string, index: number) => (
        <ActionCard
          key={index}
          backgroundColor="white"
          heading={'Listi A - ' + c}
          progressMeter={{
            currentProgress: 10,
            maxProgress: 350,
            withLabel: true,
          }}
          cta={{
            label: formatMessage(m.viewList),
            variant: 'text',
            icon: 'arrowForward',
            onClick: () => {
              navigate(
                SignatureCollectionPaths.ViewParliamentaryList.replace(
                  ':id',
                  '1',
                ),
              )
            },
          }}
        />
      ))}
      <Box marginTop={7}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h4">
            {formatMessage(m.managers) + ' '}
            <Tooltip
              placement="right"
              text="info"
              color="blue400"
              iconSize="medium"
            />
          </Text>
          <PersonLookupModal
            collectionId={'1'}
            title={formatMessage(m.addManager)}
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
              <T.Data>{formatMessage(m.allConstituencies)}</T.Data>
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
    </Stack>
  )
}

export default OwnerView
