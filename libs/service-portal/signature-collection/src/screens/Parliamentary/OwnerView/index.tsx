import {
  ActionCard,
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
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import AddConstituency from './modals/AddConstituency'
import DeletePerson from './modals/DeletePerson'
import {
  useGetListsForOwner,
  useGetListsForUser,
  useIsOwner,
} from '../../../hooks'
import { useAuth } from '@island.is/auth/react'
import { SignatureCollection } from '@island.is/api/schema'

const OwnerView = ({
  currentCollection,
}: {
  currentCollection: SignatureCollection
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { userInfo: user } = useAuth()
  const { listsForOwner, loadingOwnerLists } = useGetListsForOwner(
    currentCollection?.id || '',
  )

  console.log(listsForOwner)

  return (
    <Stack space={8}>
      <Box marginTop={5}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h4">
            {formatMessage(m.myListsDescription) + ' '}
            <Tooltip
              placement="right"
              text={formatMessage(m.myListsInfo)}
              color="blue400"
            />
          </Text>
          <AddConstituency />
        </Box>
        {constituencies.map((c: string, index: number) => (
          <Box key={index} marginTop={3}>
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
            title={formatMessage(m.addSupervisor)}
          />
        </Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.personName)}</T.HeadData>
              <T.HeadData>{formatMessage(m.personNationalId)}</T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            <T.Row>
              <T.Data width={'30%'}>{'Nafni Nafnason'}</T.Data>
              <T.Data>{'010130-3019'}</T.Data>
              <T.Data>
                <Box display="flex" justifyContent="flexEnd">
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
