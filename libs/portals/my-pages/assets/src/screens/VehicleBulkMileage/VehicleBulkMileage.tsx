import {
  Stack,
  Box,
  Filter,
  FilterInput,
  Inline,
  Checkbox,
  Pagination,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  LinkButton,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { vehicleMessage as messages, vehicleMessage } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect, useState } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { VehicleType } from './types'
import { FormProvider, useForm } from 'react-hook-form'
import { useVehiclesListQuery } from './VehicleBulkMileage.generated'
import { isDefined } from '@island.is/shared/utils'
import { AssetsPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

interface FormData {
  [key: string]: number
}

const VehicleBulkMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [vehicles, setVehicles] = useState<Array<VehicleType>>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>()

  const { data, loading, error } = useVehiclesListQuery({
    variables: {
      input: {
        page,
        pageSize: 10,
      },
    },
  })

  const methods = useForm<FormData>()

  useEffect(() => {
    if (data?.vehiclesListV3?.data) {
      const vehicles: Array<VehicleType> = data.vehiclesListV3?.data
        .map((v) => {
          if (!v.type) {
            return null
          }
          return {
            vehicleId: v.vehicleId,
            vehicleType: v.type,
            lastMileageRegistration: undefined,
          }
        })
        .filter(isDefined)
      setVehicles(vehicles)
      setTotalPages(data?.vehiclesListV3?.totalPages || 1)
    }
  }, [data?.vehiclesListV3])

  return (
    <Stack space={2}>
      <FormProvider {...methods}>
        <IntroWrapper
          title={m.vehiclesBulkMileage}
          introComponent={
            <Text>
              {formatMessage(messages.vehicleMileageIntro, {
                href: (str: React.ReactNode) => (
                  <span>
                    <a
                      href={formatMessage(messages.mileageExtLink)}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.link}
                    >
                      {str}
                    </a>
                  </span>
                ),
              })}
            </Text>
          }
          serviceProviderSlug={SAMGONGUSTOFA_SLUG}
          serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
          buttonGroup={[
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageUpload}
              text={formatMessage(vehicleMessage.bulkPostMileage)}
              icon="upload"
              variant="utility"
            />,
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
              text={formatMessage(vehicleMessage.jobOverview)}
              icon="receipt"
              variant="utility"
            />,
          ]}
        >
          <Box marginBottom={2}>
            <Filter
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              variant="popover"
              onFilterClear={() => {
                console.log('clear')
              }}
              align="left"
              reverse
              filterInput={
                <FilterInput
                  backgroundColor="blue"
                  value={search ?? ''}
                  onChange={(search) => {
                    setSearch(search)
                  }}
                  name={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(vehicleMessage.searchForPlate)}
                />
              }
            >
              <Box padding={4}>
                <Text variant="eyebrow" as="p" paddingBottom={2}>
                  {formatMessage(m.filterBy)}
                </Text>
                <Checkbox
                  name="onlyMileageRequiredVehicles"
                  label={'beg'}
                  value="onlyMileageRequiredVehicles"
                  checked={true}
                  onChange={() => undefined}
                />
              </Box>
            </Filter>
          </Box>
          <Stack space={4}>
            {error && !loading && <Problem error={error} noBorder={false} />}
            {!error && (
              <VehicleBulkMileageTable loading={loading} vehicles={vehicles} />
            )}

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
      </FormProvider>
    </Stack>
  )
}

export default VehicleBulkMileage
