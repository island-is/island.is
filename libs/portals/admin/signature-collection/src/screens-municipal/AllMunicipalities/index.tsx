import {
  Text,
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Breadcrumbs,
  FilterInput,
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
import { SignatureCollectionList } from '@island.is/api/schema'
import { useState } from 'react'

const AllMunicipalities = () => {
  const { allLists } = useLoaderData() as ListsLoaderReturn
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const municipalityBuckets: Record<string, SignatureCollectionList> = {}
  const areaCounts: Record<string, number> = {}
  for (const list of allLists) {
    const key = list?.area?.name
    if (!key) {
      continue
    }

    if (areaCounts[key]) {
      areaCounts[key] += 1
    } else {
      areaCounts[key] = 1
    }

    // TODO: Map what needs to be mapped here for each collection.
    // example of if collectors matter
    if (!municipalityBuckets[key]) {
      municipalityBuckets[key] = list
    } else {
      if (
        municipalityBuckets[key].collectors?.length &&
        list?.collectors?.length
      ) {
        municipalityBuckets[key]?.collectors?.push(...list.collectors)
      } else if (list?.collectors?.length) {
        municipalityBuckets[key].collectors = list.collectors
      }
    }
  }
  const municipalityLists = Object.keys(municipalityBuckets).map(
    (municipalityBucketKey) => municipalityBuckets[municipalityBucketKey],
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
            width="full"
            marginBottom={6}
            display="flex"
            justifyContent="spaceBetween"
          >
            <Box width="half">
              {/* Todo: display search results */}
              <FilterInput
                name="searchSignee"
                value={searchTerm}
                onChange={(v) => {
                  setSearchTerm(v)
                }}
                placeholder={formatMessage(m.searchNationalIdPlaceholder)}
                backgroundColor="blue"
              />
            </Box>
          </Box>
          <Box marginBottom={3} display="flex" justifyContent="flexEnd">
            <Text variant="eyebrow">
              {formatMessage(m.totalListResults) + ': ' + allLists.length}
            </Text>
          </Box>
          <Stack space={3}>
            {municipalityLists.map((list) => {
              return (
                <ActionCard
                  key={list.area.id}
                  eyebrow={
                    formatMessage(m.totalListsPerConstituency) +
                    (areaCounts[list.area.name]
                      ? areaCounts[list.area.name].toString()
                      : '0')
                  }
                  heading={list.area.name}
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
