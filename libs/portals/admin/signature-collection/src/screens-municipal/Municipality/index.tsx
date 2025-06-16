import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  Breadcrumbs,
  Divider,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { replaceParams } from '@island.is/react-spa/shared'
import { getTagConfig } from '../../lib/utils'
import CompareLists from '../../shared-components/compareLists'
import ActionDrawer from '../../shared-components/compareLists/ActionDrawer'
import { Actions } from '../../shared-components/compareLists/ActionDrawer/ListActions'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const collectionType = SignatureCollectionCollectionType.LocalGovernmental

export const Municipality = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const params = useParams()
  const municipality = params.municipality ?? ''
  const municipalityLists = allLists.filter(
    (list) => list.area.name === municipality,
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
          <Box marginBottom={2}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.municipalCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.MunicipalRoot}`,
                },
                {
                  title: municipality,
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
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.DownloadReports,
                  Actions.CreateCollection,
                ]}
              />
            }
            marginBottom={4}
          />
          <Divider />
          <Box marginTop={9} />
          <GridRow>
            <GridColumn span="12/12">
              <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) +
                    ': ' +
                    municipalityLists.length}
                </Text>
              </Box>
              <Stack space={3}>
                {municipalityLists.map((list) => (
                  <ActionCard
                    key={list.id}
                    eyebrow={municipality}
                    heading={list.candidate.name}
                    text={
                      formatMessage(m.totalListResults) +
                      ': ' +
                      list.numberOfSignatures
                    }
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      onClick: () => {
                        navigate(
                          replaceParams({
                            href: SignatureCollectionPaths.MunicipalList,
                            params: {
                              municipality: municipality,
                              listId: list.id,
                            },
                          }),
                        )
                      },
                    }}
                    tag={getTagConfig(list)}
                  />
                ))}
              </Stack>
            </GridColumn>
          </GridRow>
          <CompareLists
            collectionId={collection?.id}
            collectionType={collectionType}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Municipality
