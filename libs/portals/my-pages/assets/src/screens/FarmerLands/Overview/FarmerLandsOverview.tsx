import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  m,
  IntroWrapperV2,
  ATVINNUVEGARADUNEYTID_SLUG,
  m as cm,
} from '@island.is/portals/my-pages/core'
import { farmerLandsMessages as fm } from '../../../lib/messages'
import { useFarmerLandsOverviewQuery } from './FarmerLandsOverview.generated'
import {
  ActionCard,
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Problem } from '@island.is/react-spa/shared'
import { useNavigate } from 'react-router-dom'
import { AssetsPaths } from '../../../lib/paths'

export const FarmerLandsOverview = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>()

  const { data, loading, error } = useFarmerLandsOverviewQuery()

  const farmerLands = (data?.farmerLands?.data ?? []).filter((land) =>
    search ? land.name?.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return (
    <IntroWrapperV2
      title={fm.title}
      intro={fm.description}
      serviceProvider={{
        slug: ATVINNUVEGARADUNEYTID_SLUG,
        tooltip: formatMessage(cm.farmerLandTooltip),
      }}
    >
      <Box marginBottom={3}>
        <GridRow>
          <GridColumn span="4/12">
            <Input
              icon={{ name: 'search' }}
              backgroundColor="blue"
              size="xs"
              value={search ?? ''}
              onChange={(search) => {
                setSearch(search.target.value)
              }}
              name={formatMessage(m.searchLabel)}
              placeholder={formatMessage(m.inputSearchTerm)}
            />
          </GridColumn>
        </GridRow>
      </Box>

      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}
      {!loading && !error && farmerLands.length === 0 && (
        <Problem
          type="no_data"
          title={formatMessage(
            search ? cm.noSearchResults : fm.noFarmerLandsTitle,
          )}
          message={formatMessage(
            search ? cm.noSearchResultsText : cm.noDataFoundDetail,
            search ? { arg: search } : undefined,
          )}
          imgSrc="./assets/images/movingTruck.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}
      <Stack space={4}>
        {!error &&
          farmerLands.map((land) => {
            if (!land.id) return null
            return (
              <ActionCard
                key={land.id}
                heading={land.name ?? ''}
                headingVariant="h4"
                text={formatMessage(fm.farmNumber, {
                  arg: land.id,
                })}
                cta={{
                  label: formatMessage(m.viewDetail),
                  variant: 'text',
                  onClick: () =>
                    navigate(
                      AssetsPaths.AssetsFarmerLandDetail.replace(
                        ':id',
                        land.id ?? '',
                      ),
                    ),
                }}
              />
            )
          })}
      </Stack>
    </IntroWrapperV2>
  )
}

export default FarmerLandsOverview
