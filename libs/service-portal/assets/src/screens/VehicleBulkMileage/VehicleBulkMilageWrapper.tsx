import VehicleBulkMileage from './VehicleBulkMileage'
import { VehicleBulkMileageProvider } from './VehicleBulkMileageContext'

const VehicleBulkMileageWrapper = () => {
  return (
    <VehicleBulkMileageProvider>
      <VehicleBulkMileage />
    </VehicleBulkMileageProvider>
  )
}

export default VehicleBulkMileageWrapper
