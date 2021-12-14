import {
  VehicleInformation,
  RecyclingPartner,
} from '@island.is/skilavottord-web/graphql/schema'

type CarStatus = 'inUse' | 'pendingRecycle' | 'deregistered'

export const filterCarsByStatus = (
  status: CarStatus,
  cars: VehicleInformation[],
) => {
  switch (status) {
    case 'pendingRecycle':
      return cars.filter(
        (car: VehicleInformation) => car?.status === 'pendingRecycle',
      )
    case 'deregistered':
      return cars.filter(
        (car: VehicleInformation) =>
          car.status === 'handOver' ||
          car.status === 'deregistered' ||
          car.status === 'paymentInitiated' ||
          car.status === 'paymentFailed',
      )
    case 'inUse':
    default:
      return cars.filter(
        (car: VehicleInformation) =>
          car.status === 'inUse' || car.status === 'cancelled',
      )
  }
}

export const filterInternalPartners = (partnerList: RecyclingPartner[]) => {
  return partnerList.filter(({ companyId }) => companyId !== '000')
}
