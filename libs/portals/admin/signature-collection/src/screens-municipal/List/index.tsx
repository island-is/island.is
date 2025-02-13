import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Drawer,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { PaperSignees } from './paperSignees'
import { SignatureCollectionPaths } from '../../lib/paths'
import ActionExtendDeadline from '../../shared-components/extendDeadline'
import Signees from '../../shared-components/signees'
import ActionReviewComplete from '../../shared-components/completeReview'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import ListInfo from '../../shared-components/listInfoAlert'

const List = () => {
  const { formatMessage } = useLocale()
  const { list, listStatus } = useLoaderData() as {
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
                  title: formatMessage(m.parliamentaryCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.MunicipalRoot}`,
                },
                {
                  title: list?.area.name,
                  href: `/stjornbord${SignatureCollectionPaths.LandAreaSingleMunicipality}`,
                },
                {
                  title: 'Höfuðborgarsvæði',
                },
                {
                  title: 'Lorem Framboð Fólksins Hello Dolor',
                },
                { title: list?.candidate.name },
              ]}
            />
          </Box>
          <IntroHeader
            title={'Reykjavík - Framboð A'}
            intro={formatMessage(m.singleListIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            marginBottom={3}
          />
          <Divider />
          <Box marginTop={8} />
          <Signees numberOfSignatures={list?.numberOfSignatures ?? 0} />
          <PaperSignees listId={list?.id} />

          <Box marginTop={8}>
            <Drawer
              ariaLabel={''}
              baseId={''}
              disclosure={
                <Button variant="utility" icon="settings">
                  Aðgerðir
                </Button>
              }
            >
              <Text variant="h2" marginBottom={2}>
                Aðgerðir
              </Text>
              <Text marginBottom={5}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                eu justo interdum, pharetra enim vel, ultrices augue. Vestibulum
                tincidunt cursus viverra.{' '}
              </Text>
              <ActionExtendDeadline listId={list?.id} endTime={list?.endTime} />

              <Text marginY={5}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                eu justo interdum, pharetra enim vel, ultrices augue. Vestibulum
                tincidunt cursus viverra.{' '}
              </Text>
              <ActionReviewComplete listId={list?.id} listStatus={listStatus} />
            </Drawer>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
