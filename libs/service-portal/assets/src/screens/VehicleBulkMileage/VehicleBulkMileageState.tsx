import { FormProvider, useForm } from 'react-hook-form'
import VehicleBulkMileageTable from '../../components/VehicleBulkMileageTable/VehicleBulkMileageTable'
import { usePostVehicleBulkMileageMutation } from './VehicleBulkMileage.generated'
import { useState } from 'react'

interface VehicleStat
interface Props {
  vehicles: Array<{
    permNo: string
    title: string
    lastRegistrationDate?: Date
    registrationHistory?: Array<{
      date: string
      origin: string
      mileage: string
    }>
  }>
}

const VehicleBulkMileageState = ({ vehicles }: Props) => {
  const {vehicles } = useVehicleBulkMileageContext

  const methods = useForm()

  const [postMileage, { loading: mileageLoading, error: mileageError }] =
    usePostVehicleBulkMileageMutation()

  const updateSingleVehicle = (data: Partial<VehicleStatus>) => {
    if (!data.permNo || (!data.mileageReading && !data.submissionStatus)) {
      return
    }

    const updatedState = [...mileageState]
    const vehicleReadingIndex = updatedState.findIndex(
      (m) => m.permNo === data.permNo,
    )
    updatedState[vehicleReadingIndex] = {
      ...updatedState[vehicleReadingIndex],
      ...data,
    }

    console.log('mileage state updated')
    setMileageState(updatedState)
  }

  const submitSingleVehicle = async (permNo: string) => {
    const vehicleReading = mileageState.find((m) => m.permNo === permNo)
    console.log('submitting single vehicle mileage reading')

    if (!vehicleReading) {
      console.log('vehicle not found in state')
      return
    }

    console.log(
      `vehicle no: ${vehicleReading.permNo} drove ${vehicleReading.mileageReading}`,
    )
    await postMileage({
      variables: {
        input: {
          mileage: vehicleReading.mileageReading,
          permNo: vehicleReading.permNo,
        },
      },
    }).catch(() => {
      updateSingleVehicle({
        permNo: vehicleReading.permNo,
        submissionStatus: 'failure',
      })
      return false
    })
    console.log('Post successful')
    updateSingleVehicle({
      permNo: vehicleReading.permNo,
      submissionStatus: 'success',
    })
    return true
  }

  return <FormProvider {...methods}></FormProvider>

  /*
  return <VehicleBulkMileageTable
    onRowSubmit={(data) =>
      onSubmitMileageForVehicle(data.permNo, data.odometerStatus)
    }
    vehicles={data.vehicleMileageBulkCollection.vehicles.map(
      (vehicle) => ({
        permNo: vehicle.permNo,
        title: vehicle.title,
        lastRegistrationDate: vehicle.latestRegistration?.date
          ? new Date(vehicle.latestRegistration.date)
          : undefined,
        registrationHistory:
          vehicle?.mileageRegistrationHistory?.map((m) => ({
            date: m.date,
            origin: m.origin,
            mileage: m.mileage.toString(),
          })) ?? [],
      }),
    )}
  /> */
}

export default VehicleBulkMileageState
