import { Stack, Pagination, Text, Inline } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
  LinkButton,
} from '@island.is/service-portal/core'
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
        <IntroHeader
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
        />
        <Stack space={4}>
          <Inline space={2}>
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageUpload}
              text={formatMessage(vehicleMessage.bulkPostMileage)}
              icon="upload"
              variant="utility"
            />
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
              text={formatMessage(vehicleMessage.jobOverview)}
              icon="receipt"
              variant="utility"
            />
          </Inline>
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
      </FormProvider>
    </Stack>
  )
}

export default VehicleBulkMileage
