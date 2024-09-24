import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m, parliamentaryMessages } from '../../lib/messages'
import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import CreateCollection from '../../shared-components/createCollection'

export const Constituency = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { constituencyName } = useParams() as { constituencyName: string }

  const constituencyLists = allLists.filter(
    (list) => list.area.name === constituencyName,
  )

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={constituencyName}
            intro={
              formatMessage(parliamentaryMessages.singleConstituencyIntro) +
              ' ' +
              constituencyName
            }
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <GridRow>
            <GridColumn span={'12/12'}>
              <Box
                marginBottom={3}
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
              >
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) +
                    ': ' +
                    constituencyLists.length}
                </Text>
                {constituencyLists?.length > 0 && (
                  <CreateCollection collectionId={collection?.id} />
                )}
              </Box>
              <Stack space={3}>
                {constituencyLists.map((list) => (
                  <ActionCard
                    key={list.id}
                    eyebrow={constituencyName}
                    heading={list.title.split(' - ')[0]}
                    progressMeter={{
                      currentProgress: list.numberOfSignatures ?? 0,
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      onClick: () => {
                        navigate(
                          SignatureCollectionPaths.ParliamentaryConstituencyList.replace(
                            ':constituencyName',
                            constituencyName,
                          ).replace(':listId', list.id),
                        )
                      },
                    }}
                  />
                ))}
              </Stack>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Constituency
