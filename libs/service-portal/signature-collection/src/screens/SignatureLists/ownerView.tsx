import { ActionCard, Box, Button, GridColumn, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { SignatureCollectionPaths } from '../../lib/paths'
import { IntroHeader, LinkResolver } from '@island.is/service-portal/core'
import CancelCollection from './cancelCollection'
import { useGetOwnerLists } from '../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../Skeletons'
import { useNavigate } from 'react-router-dom'

const OwnerView = () => {
  useNamespaces('sp.signatureCollection')
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { ownerLists, loadingLists } = useGetOwnerLists()
  return (
    <div>
      {!loadingLists ? (
        <Box>
              <IntroHeader
            title={formatMessage(m.pageTitle)}
            intro={formatMessage(m.pageDescription)}
          >
            {ownerLists.length === 0 && (
              <GridColumn span={['8/8', '3/8']}>
                <Box
                  display={'flex'}
                  justifyContent={['flexStart', 'flexEnd']}
                  paddingTop={[2]}
                >
                  <Button
                    icon="open"
                    iconType="outline"
                    onClick={() =>
                      window.open(
                        `${document.location.origin}/umsoknir/medmaelalisti/`,
                      )
                    }
                    size="small"
                  >
                    {formatMessage(m.createListButton)}
                  </Button>
                </Box>
              </GridColumn>
            )}
          </IntroHeader>
          <Box marginTop={10}>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myListsHeader)}
            </Text>
            <Stack space={5}>
              {ownerLists.map((list) => {
                return (
                  <ActionCard
                    backgroundColor="white"
                    heading={list.owner.name + ' - ' + list.area.name}
                    eyebrow={format(new Date(list.endTime), 'dd.MM.yyyy')}
                    text={formatMessage(m.collectionTitle)}
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      icon: 'arrowForward',
                      onClick: () => {
                        navigate(
                          SignatureCollectionPaths.ViewList.replace(
                            ':id',
                            list.id,
                          ),
                        )
                      },
                    }}
                    progressMeter={{
                      currentProgress: Number(list.numberOfSignatures),
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
          {ownerLists.length > 0 && <CancelCollection />}
        </Box>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}

export default OwnerView
