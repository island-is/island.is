import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  Box,
  DialogPrompt,
  Icon,
  Tag,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import CreateCollection from '../../shared-components/createCollection'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { replaceParams } from '@island.is/react-spa/shared'
import { getTagConfig } from '../../lib/utils'

export const Municipality = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { collection, allLists } = useLoaderData() as ListsLoaderReturn

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
          <Box marginBottom={2}>
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
          />
          <GridRow>
            <GridColumn span="12/12">
              <Box
                marginBottom={3}
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexEnd"
              >
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) + ': ' + allLists.length}
                </Text>
                <CreateCollection collectionId={collection?.id} areaId={''} />
              </Box>
              <Stack space={3}>
                {allLists.map((list) => (
                  <ActionCard
                    key={list.id}
                    eyebrow="Höfuðborgarsvæði"
                    heading={list.candidate.name}
                    text={'Ábyrgðaraðili: ' + list.candidate.name}
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
                          replaceParams({
                            href: SignatureCollectionPaths.MunicipalList,
                            params: {
                              municipality: 'borgarbyggd',
                              listId: list.id,
                            },
                          }),
                        )
                      },
                    }}
                    tag={{
                      ...getTagConfig(list),
                      renderTag: (cld) => (
                        <Box display="flex" alignItems="center" columnGap={1}>
                          {cld}
                          <DialogPrompt
                            baseId="cancel_collection_dialog"
                            title={
                              formatMessage(m.cancelCollectionButton) +
                              ' - ' +
                              list.area?.name
                            }
                            description={formatMessage(
                              m.cancelCollectionModalMessage,
                            )}
                            ariaLabel="delete"
                            disclosureElement={
                              <Tag outlined variant="red">
                                <Box display="flex" alignItems="center">
                                  <Icon
                                    icon="trash"
                                    size="small"
                                    type="outline"
                                  />
                                </Box>
                              </Tag>
                            }
                            onConfirm={() => console.log('cancelled')}
                            buttonTextConfirm={'Já, eyða'}
                            buttonPropsConfirm={{
                              variant: 'primary',
                              colorScheme: 'destructive',
                            }}
                            buttonTextCancel={formatMessage(
                              m.cancelCollectionModalCancelButton,
                            )}
                          />
                        </Box>
                      ),
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

export default Municipality
