import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Breadcrumbs,
  Divider,
  toast,
  Tag,
  Icon,
  DialogPrompt,
  Text,
} from '@island.is/island-ui/core'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import { SignatureCollectionPaths } from '../../lib/paths'
import EmptyState from '../../shared-components/emptyState'
import StartAreaCollection from './startCollection'
import { useStartCollectionMutation } from './startCollection/startCollection.generated'
import sortBy from 'lodash/sortBy'
import { CollectionStatus } from '@island.is/api/schema'

const AllMunicipalities = ({ isMunicipality }: { isMunicipality: boolean }) => {
  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()
  const [startCollectionMutation] = useStartCollectionMutation()

  const onStartCollection = (areaId: string) => {
    startCollectionMutation({
      variables: {
        input: {
          areaId: areaId,
        },
      },
      onCompleted: (response) => {
        const { success, reasons } =
          response.signatureCollectionAdminStartMunicipalityCollection

        if (success) {
          toast.success(formatMessage(m.openMunicipalCollectionSuccess))
          revalidate()
        } else {
          toast.error(
            reasons?.[0] ?? formatMessage(m.openMunicipalCollectionError),
          )
        }
      },
    })
  }

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
            marginBottom={3}
          />
          <Divider />
          <Box marginTop={9} />
          {collection.areas.length > 0 ? (
            collection.areas.length > 1 && (
              <Box display="flex" justifyContent="flexEnd">
                <Text marginBottom={2} variant="eyebrow">
                  {`${formatMessage(m.totalMunicipalities)}: ${
                    collection.areas.length
                  }`}
                </Text>
              </Box>
            )
          ) : (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          )}
          {/* For municipalities to start their collection if its not already active.
              Note: municipalities only see their own area. */}
          {isMunicipality &&
            collection.areas?.length > 0 &&
            !collection.areas[0]?.isActive && (
              <StartAreaCollection areaId={collection.areas[0]?.id} />
            )}
          <Stack space={3}>
            {sortBy(collection.areas, [
              (area) => !area.isActive, // active first
              'name', // then alphabetically
            ]).map((area) => (
              <ActionCard
                key={area.id}
                heading={area.name}
                eyebrow={`${formatMessage(m.totalListsPerMunicipality)}: ${
                  allLists.filter((list) => list.area.id === area.id).length
                }`}
                cta={{
                  label: formatMessage(m.viewMunicipality),
                  variant: 'text',
                  disabled: !area.isActive,
                  onClick: () => {
                    navigate(
                      SignatureCollectionPaths.SingleMunicipality.replace(
                        ':municipality',
                        area.name,
                      ),
                    )
                  },
                }}
                tag={
                  // This action is only available for the Admins (LKS and ÞÍ)
                  !isMunicipality && !area.isActive
                    ? {
                        label: 'Open collection',
                        renderTag: () => (
                          <DialogPrompt
                            baseId="open_collection_dialog"
                            title={
                              formatMessage(m.openMunicipalCollection) +
                              ' - ' +
                              area.name
                            }
                            description={formatMessage(
                              m.openMunicipalCollectionDescription,
                            )}
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
                              onStartCollection(area.id)
                            }}
                            buttonTextConfirm={formatMessage(
                              m.confirmOpenMunicipalCollectionButton,
                            )}
                          />
                        ),
                      }
                    : area.collectionStatus === CollectionStatus.InReview
                    ? {
                        label: formatMessage(m.confirmListReviewed),
                        variant: 'mint',
                        outlined: true,
                      }
                    : area.isActive
                    ? {
                        label: formatMessage(m.municipalityCollectionOpen),
                        variant: 'mint',
                        outlined: false,
                      }
                    : undefined
                }
              />
            ))}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AllMunicipalities
