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
import AddManager from './AddManager'

const OwnerView = () => {
  const navigate = useNavigate()

  return (
    <Stack space={3}>
      <Box display={'flex'} justifyContent={'spaceBetween'} marginBottom={3}>
        <Button variant="ghost" icon="open" iconType="outline">
          Stofna meðmælasöfnun
        </Button>
        <AlertMessage type="info" message="Söfnun lýkur 16.10.2024" />
      </Box>
      {constituencies.map((c: string, index: number) => (
        <ActionCard
          key={index}
          backgroundColor="white"
          heading={'Flokkur 1 - ' + c}
          progressMeter={{
            currentProgress: 10,
            maxProgress: 350,
            withLabel: true,
          }}
          cta={{
            label: 'Sýsla með lista',
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
      <Box marginTop={5}>
        <Box
          display={'flex'}
          justifyContent={'spaceBetween'}
          alignItems="baseline"
          marginBottom={3}
        >
          <Text variant="h5">
            {'Ábyrgðaraðilar' + ' '}
            <Tooltip placement="right" text={'info'} color="blue400" />
          </Text>
          <AddManager collectionId={'1'} />
        </Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{'Nafn'}</T.HeadData>
              <T.HeadData>{'Kennitala'}</T.HeadData>
              <T.HeadData>{'Kjördæmi'}</T.HeadData>
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
                  icon="pencil"
                  iconType="outline"
                  size="small"
                >
                  Breyta
                </Button>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>{'Nafni Nafnason 2'}</T.Data>
              <T.Data>{'010130-3019'}</T.Data>
              <T.Data>{'Norðvestur'}</T.Data>
              <T.Data>
                <Button
                  variant="text"
                  icon="pencil"
                  iconType="outline"
                  size="small"
                >
                  Breyta
                </Button>
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </Stack>
  )
}

export default OwnerView
