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
  DialogPrompt,
  Tag,
  Icon,
  toast,
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
import { useStartCollectionMutation } from './startCollection/startCollection.generated'

const AllMunicipalities = ({ isAdmin }: { isAdmin: boolean }) => {
  const { allLists, collection } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [startCollectionMutation] = useStartCollectionMutation()

  const onStartCollection = (areaId: string) => {
    startCollectionMutation({
      variables: {
        input: {
          areaId: areaId,
        },
      },
      onCompleted: (response) => {
        if (
          response.signatureCollectionAdminStartMunicipalityCollection.success
        )
          toast.success(formatMessage(m.openMunicipalCollectionSuccess))
        else {
          toast.error(
            response.signatureCollectionAdminStartMunicipalityCollection
              .reasons?.[0] ?? formatMessage(m.openMunicipalCollectionError),
          )
        }
      },
    })
  }

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

  const municipalities = Array.from(municipalityMap.values()).sort((a, b) =>
    a.area.name.localeCompare(b.area.name),
  )

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
          {municipalities.length > 0 ? (
            <Box>
              <FindSignature collectionId={collection.id} />
              <Box marginBottom={3} display="flex" justifyContent="flexEnd">
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) +
                    ': ' +
                    municipalities.length}
                </Text>
              </Box>
            </Box>
          ) : (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          )}
          {/* For municipalities to start their collection if its not already active */}
          {!isAdmin &&
            municipalities.length > 0 &&
            !municipalities[0]?.area?.isActive && (
              <StartAreaCollection areaId={municipalities[0]?.area.id} />
            )}
          <Stack space={3}>
            {municipalities.map((municipality) => {
              return (
                <ActionCard
                  key={municipality.area.id}
                  heading={municipality.area.name}
                  eyebrow={formatMessage(m.municipality)}
                  text={
                    formatMessage(m.totalListsPerMunicipality) +
                    (areaCounts[municipality.area.name]
                      ? areaCounts[municipality.area.name].toString()
                      : '0')
                  }
                  cta={{
                    label: formatMessage(m.viewMunicipality),
                    variant: 'text',
                    onClick: () => {
                      navigate(
                        SignatureCollectionPaths.SingleMunicipality.replace(
                          ':municipality',
                          municipality.area.name,
                        ),
                      )
                    },
                  }}
                  tag={
                    isAdmin && !municipality.area.isActive
                      ? {
                          label: 'Open collection',
                          renderTag: () => (
                            <DialogPrompt
                              baseId="open_collection_dialog"
                              title={
                                formatMessage(m.openMunicipalCollection) +
                                ' - ' +
                                municipality.area.name
                              }
                              description=""
                              ariaLabel="open_collection"
                              disclosureElement={
                                <Tag outlined variant="blue">
                                  <Box display="flex" alignItems="center">
                                    <Icon
                                      icon="lockOpened"
                                      size="small"
                                      type="outline"
                                    />
                                  </Box>
                                </Tag>
                              }
                              onConfirm={() => {
                                onStartCollection(municipality.area.id)
                              }}
                              buttonTextConfirm={formatMessage(
                                m.confirmOpenMunicipalCollectionButton,
                              )}
                            />
                          ),
                        }
                      : undefined
                  }
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
