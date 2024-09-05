import { Stack, Pagination, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import { dummy } from './mocks/propsDummy'
import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect, useState } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { SubmissionState, VehicleType } from './types'
import { VehicleBulkMileageOptionsBar } from './VehicleBulkMileageOptionsBar'
import { FormProvider, useForm } from 'react-hook-form'
import { useVehicleBulkMileagePostMutation } from './VehicleBulkMileage.generated'
import { MileageRecord } from './VehicleBulkMileageFileUploader'

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

  const methods = useForm<FormData>()

  const [vehicleBulkMileagePostMutation, { data, loading, error }] =
    useVehicleBulkMileagePostMutation()

  useEffect(() => {
    const newVehicles = dummy.filter(
      (du) => !vehicles.find((v) => v.vehicleId === du.vehicleId),
    )
    if (newVehicles.length) {
      setVehicles([...vehicles, ...newVehicles])
    }
  }, [pageSize, page])

  console.log(loading)
  console.log(data)
  console.log(error)

  const onFileUploadComplete = (records: Array<MileageRecord>) => {
    vehicleBulkMileagePostMutation({
      variables: {
        input: {
          originCode: 'ISLAND.IS',
          mileageData: records.map((r) => ({
            mileageNumber: r.mileage,
            vehicleId: r.vehicleId,
          })),
        },
      },
    })
  }

  const postMileage = async (
    mileages: Array<{
      vehicleId: string
      mileage: number
    }>,
  ) => {
    vehicleBulkMileagePostMutation({
      variables: {
        input: {
          mileageData: mileages.map((m) => ({
            mileageNumber: m.mileage,
            vehicleId: m.vehicleId,
          })),
          originCode: 'ISLAND.IS',
        },
      },
    })
  }

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
          <VehicleBulkMileageOptionsBar
            onPageSizeClick={(size) => setPageSize(size)}
            currentPageSize={pageSize}
            onFileUploadComplete={onFileUploadComplete}
          />
          <VehicleBulkMileageTable
            updateVehicleStatus={updateVehicleStatus}
            updateVehicles={setVehicles}
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
