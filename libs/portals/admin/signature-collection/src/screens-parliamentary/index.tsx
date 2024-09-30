import {
  ActionCard,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Box,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../lib/navigation'
import { m, parliamentaryMessages } from '../lib/messages'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../lib/paths'
import CompareLists from '../shared-components/compareLists'
import { ListsLoaderReturn } from '../loaders/AllLists.loader'
import DownloadReports from './DownloadReports'
import electionsCommitteeLogo from '../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../assets/nationalRegistry.svg'

const ParliamentaryRoot = ({allowedToProcess}: {
  allowedToProcess: boolean
}) => {
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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(
                    parliamentaryMessages.signatureListsTitle,
                  ),
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(parliamentaryMessages.signatureListsTitle)}
            intro={formatMessage(parliamentaryMessages.signatureListsIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={
              allowedToProcess ? electionsCommitteeLogo : nationalRegistryLogo
            }
          />
          <Box
            width="full"
            marginBottom={8}
            display="flex"
            justifyContent="spaceBetween"
          >
            <Box width="half">
              <FilterInput
                name="searchSignee"
                value={''}
                onChange={() => console.log('search')}
                placeholder={formatMessage(m.searchNationalIdPlaceholder)}
                backgroundColor="blue"
              />
            </Box>
            <DownloadReports areas={collection.areas} />
          </Box>
          <Stack space={3}>
            {collection?.areas.map((area) => (
              <ActionCard
                key={area.id}
                eyebrow={
                  formatMessage(m.totalListsPerConstituency) +
                  allLists.filter((l) => l.area.name === area.name).length
                }
                heading={area.name}
                cta={{
                  label: formatMessage(m.viewConstituency),
                  variant: 'text',
                  onClick: () => {
                    navigate(
                      SignatureCollectionPaths.ParliamentaryConstituency.replace(
                        ':constituencyName',
                        area.name,
                      ),
                    )
                  },
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

export default ParliamentaryRoot
