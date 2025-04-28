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
import { replaceParams } from '@island.is/react-spa/shared'
import DownloadReports from '../../shared-components/downloadReports'
import CompareLists from '../../shared-components/compareLists'
import StartAreaCollection from './StartAreaCollection'

const LandAreas = () => {
  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

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
          <Box
            marginBottom={3}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
          >
            <Text variant="eyebrow">Samtals fjöldi: {allLists.length}</Text>
            <DownloadReports areas={[]} collectionId={''} />
          </Box>
          <Stack space={3}>
            {allLists.map((list) => (
              <ActionCard
                key={list.id}
                eyebrow={'Höfuðborgarsvæði (3000)'}
                heading={'Reykjavík'}
                text={'Fjöldi framboða: 12'}
                cta={{
                  label: 'Skoða sveitarfélag',
                  variant: 'text',
                  onClick: () => {
                    navigate(
                      replaceParams({
                        href: SignatureCollectionPaths.LandAreaSingleMunicipality,
                        params: {
                          municipality: 'borgarbyggd',
                        },
                      }),
                    )
                  },
                }}
                tag={{
                  label: 'Tag',
                  variant: 'blue',
                  renderTag: () => <StartAreaCollection />,
                }}
              />
            ))}
          </Stack>
          <CompareLists collectionId={collection?.id} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default LandAreas
