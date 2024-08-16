import {
  ActionCard,
  AlertMessage,
  Box,
  Stack,
  Text,
  Table as T,
  Tooltip,
} from '@island.is/island-ui/core'
import { constituencies } from '../../../lib/constants'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../../lib/paths'
import LookupPerson from './modals/LookupPerson'
import { format } from 'path'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './modals/AddConstituency'
import DeletePerson from './modals/DeletePerson'
import EditPerson from './modals/EditPerson'

const OwnerView = () => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

  return (
    <Stack space={7}>
      <AlertMessage type="info" message="Söfnun lýkur 16.10.2024" />
      <Box>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h4">{formatMessage(m.myListsDescription)}</Text>
          <AddConstituency />
        </Box>
        {constituencies.map((c: string, index: number) => (
          <Box marginTop={3}>
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
          </Box>
        ))}
      </Box>
      {/* Ábyrgðaraðilar */}
      <Box>
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
          <LookupPerson
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
              <T.Data width={'40%'}>
                {formatMessage(m.allConstituencies)}
              </T.Data>
              <T.Data width={'12%'}>
                <Box display={'flex'} justifyContent={'flexEnd'}>
                  <DeletePerson />
                </Box>
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
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
          <LookupPerson
            collectionId={'1'}
            withConstituencies
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
              <T.Data width={'40%'}>
                {formatMessage(
                  'Suðvesturkjördæmi, Suðurkjördæmi, Norðausturkjördæmi, Suðvesturkjördæmi, Suðurkjördæmi, Norðausturkjördæmi',
                )}
              </T.Data>
              <T.Data width={'12%'}>
                <Box display="flex" justifyContent="spaceBetween">
                  <EditPerson />
                  <DeletePerson />
                </Box>
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </Stack>
  )
}

export default OwnerView
