import {
  Text,
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Breadcrumbs,
  Divider,
} from '@island.is/island-ui/core'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import { SignatureCollectionPaths } from '../../lib/paths'
import { SignatureCollectionList } from '@island.is/api/schema'
import FindSignature from '../../shared-components/findSignature'
import EmptyState from '../../shared-components/emptyState'
import StartAreaCollection from './startCollection'

const AllMunicipalities = () => {
  const { allLists, collection } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const areaCounts: Record<string, number> = {}
  const municipalityMap = new Map<string, SignatureCollectionList>()

  // Group lists by municipality
  allLists.forEach((list) => {
    const key = list?.area?.name
    if (!key) return

    areaCounts[key] = (areaCounts[key] || 0) + 1

    if (!municipalityMap.has(key)) {
      municipalityMap.set(key, list)
    }
  })

  const municipalityLists = Array.from(municipalityMap.values())

  return (
    <GridContainer>
      <GridRow>
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
                  title: formatMessage(m.municipalCollectionTitle),
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(m.municipalCollectionTitle)}
            intro={formatMessage(m.municipalCollectionIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            marginBottom={4}
          />
          <Divider />
          <Box marginTop={9} />
          {municipalityLists.length > 0 ? (
            <Box>
              <FindSignature collectionId={collection.id} />
              <Box marginBottom={3} display="flex" justifyContent="flexEnd">
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) +
                    ': ' +
                    municipalityLists.length}
                </Text>
              </Box>
            </Box>
          ) : (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          )}
          {/* Todo: for municipalities, not admin */}
          <StartAreaCollection />
          <Stack space={3}>
            {municipalityLists.map((list) => {
              return (
                <ActionCard
                  key={list.area.id}
                  heading={list.area.name}
                  eyebrow={formatMessage(m.municipality)}
                  text={
                    formatMessage(m.totalListsPerMunicipality) +
                    (areaCounts[list.area.name]
                      ? areaCounts[list.area.name].toString()
                      : '0')
                  }
                  cta={{
                    label: formatMessage(m.viewMunicipality),
                    variant: 'text',
                    onClick: () => {
                      navigate(
                        SignatureCollectionPaths.SingleMunicipality.replace(
                          ':municipality',
                          list.area.name,
                        ),
                      )
                    },
                  }}
                  /* Todo: add for admin users
                  tag={{
                    label: 'Tag',
                    variant: 'blue',
                    renderTag: () => <StartAreaCollection />,
                  }}*/
                />
              )
            })}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AllMunicipalities
