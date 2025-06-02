import {
  Text,
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import { SignatureCollectionPaths } from '../../lib/paths'
import StartAreaCollection from './StartAreaCollection'

const AllMunicipalities = () => {
  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  console.log(collection)

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
          <Box marginBottom={3} display="flex" justifyContent="flexEnd">
            <Text variant="eyebrow">
              {formatMessage(m.totalListResults) + ': ' + allLists.length}
            </Text>
          </Box>
          <Stack space={3}>
            {collection?.areas.map((area) => {
              const areaLists = allLists.filter(
                (l) => l.area.name === area.name,
              )
              return (
                <ActionCard
                  key={area.id}
                  eyebrow={
                    formatMessage(m.totalListsPerConstituency) +
                    areaLists.length
                  }
                  heading={area.name}
                  cta={{
                    label: formatMessage(m.viewMunicipality),
                    variant: 'text',
                    onClick: () => {
                      navigate(
                        SignatureCollectionPaths.SingleMunicipality.replace(
                          ':municipality',
                          area.name,
                        ),
                      )
                    },
                  }}
                  tag={{
                    label: 'Tag',
                    variant: 'blue',
                    renderTag: () => <StartAreaCollection />,
                  }}
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
