import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { SignatureCollectionPaths } from '../../lib/paths'
import Signees from '../../shared-components/signees'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { PaperSignees } from '../../shared-components/paperSignees'
import ActionDrawer from './ActionDrawer'

const List = () => {
  const { formatMessage } = useLocale()
  const { list } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

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
          <Box marginBottom={2} display="flex" justifyContent="spaceBetween">
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.municipalCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.MunicipalRoot}`,
                },
                {
                  title: 'Höfuðborgarsvæði',
                  href: `/stjornbord${SignatureCollectionPaths.LandAreaSingleMunicipality}`,
                },
                {
                  title: 'Sveitarfélag',
                },
                { title: 'Framboð A' }, //list?.candidate.name
              ]}
            />
          </Box>
          <IntroHeader
            title={'Reykjavík - Framboð A'}
            intro={formatMessage(m.singleListIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            buttonGroup={<ActionDrawer />}
          />
          <Signees numberOfSignatures={list?.numberOfSignatures ?? 0} />
          <PaperSignees listId={list?.id} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
