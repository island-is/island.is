import { Stack, Pagination, Text, Box, Inline } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
  LinkButton,
} from '@island.is/service-portal/core'
import { dummy } from './mocks/propsDummy'
import { vehicleMessage as messages, vehicleMessage } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect, useState } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { SubmissionState, VehicleType } from './types'
import { FormProvider, useForm } from 'react-hook-form'
import { MileageRecord } from '../../utils/parseCsvToMileage'
import { useVehiclesListQuery } from './VehicleBulkMileage.generated'
import { isDefined } from '@island.is/shared/utils'
import { AssetsPaths } from '../../lib/paths'

interface FormData {
  [key: string]: number
}

const VehicleBulkMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [vehicles, setVehicles] = useState<Array<VehicleType>>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const { data, loading, error, fetchMore } = useVehiclesListQuery({
    variables: {
      input: {
        page,
        pageSize,
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
            submissionStatus: 'idle' as const,
            lastRegistrationDate: new Date(),
          }
        })
        .filter(isDefined)
      setVehicles(vehicles)
    }
  }, [data?.vehiclesListV3])

  useEffect(() => {
    fetchMore({
      variables: {
        input: {
          pageSize,
          page,
        },
      },
    })
  }, [pageSize, page])

  const updateVehicleStatus = async (
    status: SubmissionState,
    vehicleId: string,
  ) => {
    const newVehicles = vehicles.map((v) => {
      if (v.vehicleId === vehicleId) {
        return {
          ...v,
          submissionStatus: status,
        }
      } else return v
    })
    setVehicles(newVehicles)
  }

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
              icon="arrowUp"
              variant="utility"
            />
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
              text={formatMessage(vehicleMessage.jobOverview)}
              icon="document"
              variant="utility"
            />
          </Inline>
          <VehicleBulkMileageTable
            updateVehicleStatus={updateVehicleStatus}
            vehicles={vehicles}
          />

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <button
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
