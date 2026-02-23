import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { ATVINNUVEGARADUNEYTID_SLUG } from '@island.is/portals/my-pages/core'
import { farmerLandsMessages as fm } from '../../../lib/messages'
import { useFarmerLandsOverviewQuery } from './FarmerLandsOverview.generated'
import {
  ActionCard,
  Box,
  GridColumn,
  GridRow,
  Input,
  Pagination,
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
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const { data, loading, error } = useFarmerLandsOverviewQuery()

  const farmerLands = data?.farmerLands?.data ?? []

  return (
    <IntroWrapper
      title={formatMessage(fm.title)}
      intro={formatMessage(fm.description)}
      serviceProviderSlug={ATVINNUVEGARADUNEYTID_SLUG}
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
                if (page !== 1) {
                  setPage(1)
                }
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
      <Stack space={4}>
        {!error &&
          farmerLands.map((land) => (
            <ActionCard
              heading={land.name}
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
          ))}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <button
                aria-label={formatMessage(m.goToPage)}
                onClick={() => {
                  setPage(page)
                }}
              >
                <span className={className}>{children}</span>
              </button>
            )}
          />
        )}
      </Stack>
    </IntroWrapper>
  )
}

export default FarmerLandsOverview
