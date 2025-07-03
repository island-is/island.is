import {
  Stack,
  Box,
  Pagination,
  Text,
  Input,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import debounce from 'lodash/debounce'
import { debounceTime } from '@island.is/shared/constants'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  LinkButton,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { vehicleMessage as messages, vehicleMessage } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect, useState, useMemo } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { VehicleType } from './types'
import { FormProvider, useForm } from 'react-hook-form'
import { useVehiclesListLazyQuery } from './VehicleBulkMileage.generated'
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
  const [displayFilters, setDisplayFilters] = useState<boolean>(false)

  const [vehicleListQuery, { data, loading, error }] =
    useVehiclesListLazyQuery()

  useEffect(() => {
    vehicleListQuery({
      variables: {
        input: {
          page,
          pageSize: 10,
          query: undefined,
          filterOnlyVehiclesUserCanRegisterMileage: true,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const debouncedQuery = useMemo(() => {
    return debounce(() => {
      vehicleListQuery({
        variables: {
          input: {
            page,
            pageSize: 10,
            query: search ?? undefined,
            filterOnlyVehiclesUserCanRegisterMileage: true,
          },
        },
      }).then((res) => {
        const vehicles: Array<VehicleType> =
          res.data?.vehiclesListV3?.data
            ?.map((v) => {
              if (!v.make) {
                return null
              }

              const lastMileageRegistration =
                v.mileageDetails?.lastMileageRegistration &&
                v.mileageDetails.lastMileageRegistration.date &&
                v.mileageDetails.lastMileageRegistration.mileage &&
                v.mileageDetails.lastMileageRegistration.originCode
                  ? {
                      date: new Date(
                        v.mileageDetails.lastMileageRegistration.date,
                      ),
                      mileage: v.mileageDetails.lastMileageRegistration.mileage,
                      origin:
                        v.mileageDetails.lastMileageRegistration.originCode,
                      internalId:
                        v.mileageDetails.lastMileageRegistration.internalId ??
                        undefined,
                    }
                  : undefined

              return {
                vehicleId: v.vehicleId,
                vehicleType: v.make,
                lastMileageRegistration,
                co2: v.co2 ?? undefined,
              }
            })
            .filter(isDefined) ?? []
        setVehicles(vehicles)
        setTotalPages(res?.data?.vehiclesListV3?.totalPages || 1)
      })
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  useEffect(() => {
    debouncedQuery()
    return () => {
      debouncedQuery.cancel()
    }
  }, [debouncedQuery])

  const methods = useForm<FormData>()

  useEffect(() => {
    if (!displayFilters) {
      setDisplayFilters((data?.vehiclesListV3?.totalRecords ?? 0) > 10)
    }
  }, [data, displayFilters])

  const buttons = [
    <LinkButton
      key="finance"
      to={AssetsPaths.LinkFinanceTransactionVehicleMileage}
      text={formatMessage(vehicleMessage.financeMileageLink)}
      icon="arrowForward"
      variant="utility"
      colorScheme="white"
    />,
  ]

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
          buttonGroup={
            displayFilters
              ? [
                  ...buttons,
                  <LinkButton
                    key="upload"
                    to={AssetsPaths.AssetsVehiclesBulkMileageUpload}
                    text={formatMessage(vehicleMessage.bulkPostMileage)}
                    icon="upload"
                    variant="utility"
                  />,
                  <LinkButton
                    key="overview"
                    to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
                    text={formatMessage(vehicleMessage.jobOverview)}
                    icon="receipt"
                    variant="utility"
                  />,
                ]
              : buttons
          }
        >
          {displayFilters && (
            <Box marginBottom={2}>
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
                    label={formatMessage(m.searchLabel)}
                    name={formatMessage(m.searchLabel)}
                    placeholder={formatMessage(vehicleMessage.searchForPlate)}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          )}
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
