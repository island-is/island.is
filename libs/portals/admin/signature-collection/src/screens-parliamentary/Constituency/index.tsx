import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  Divider,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import format from 'date-fns/format'
import { getTagConfig } from '../../lib/utils'
import ActionDrawer from '../../shared-components/actionDrawer'
import { Actions } from '../../shared-components/actionDrawer/ListActions'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import EmptyState from '../../shared-components/emptyState'

export const Constituency = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { allLists } = useLoaderData() as ListsLoaderReturn
  const { constituencyName = '' } = useParams<{ constituencyName: string }>()
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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.parliamentaryCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryRoot}`,
                },
                {
                  title: constituencyName,
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={constituencyName}
            intro={
              formatMessage(m.parliamentaryConstituencyIntro) +
              ' ' +
              constituencyName
            }
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.DownloadReports,
                  Actions.CreateCollection,
                ]}
              />
            }
            marginBottom={3}
          />
          <Divider />
          <Box marginTop={9} />
          {constituencyLists.length === 0 ? (
            <EmptyState
              title={formatMessage(m.noLists) + ' í ' + constituencyName}
              description={formatMessage(m.noListsDescription)}
            />
          ) : (
            <GridRow>
              <GridColumn span="12/12">
                <Box display="flex" justifyContent="flexEnd">
                  <Text variant="eyebrow" marginBottom={3}>
                    {`${formatMessage(m.totalListsPerConstituency)}: ${
                      constituencyLists.length
                    }`}
                  </Text>
                </Box>
                <Stack space={3}>
                  {constituencyLists.map((list) => (
                    <ActionCard
                      key={list.id}
                      eyebrow={`${formatMessage(m.listEndTime)}: ${format(
                        new Date(list.endTime),
                        'dd.MM.yyyy',
                      )}`}
                      heading={list.candidate.name}
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
                      tag={getTagConfig(list)}
                    />
                  ))}
                </Stack>
              </GridColumn>
            </GridRow>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Constituency
