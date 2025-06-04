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

  const areaCounts: Record<string, number> = {}
  const municipalityMap = new Map<string, SignatureCollectionList>()

  // Group lists by municipality
  allLists.forEach((list) => {
    const key = list?.area?.name
    if (!key) return

    areaCounts[key] = (areaCounts[key] || 0) + 1

    if (!municipalityMap.has(key)) {
      municipalityMap.set(key, list)
    } else if (list.collectors?.length) {
      const existing = municipalityMap.get(key)
      if (existing) {
        existing.collectors = [
          ...(existing.collectors || []),
          ...list.collectors,
        ]
      }
    }
  })

  const municipalityLists = Array.from(municipalityMap.values())

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
              {formatMessage(m.totalListResults) + ': ' + municipalityLists.length}
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
