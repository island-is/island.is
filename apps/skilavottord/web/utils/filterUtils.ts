import { Car, RecyclingPartner } from '@island.is/skilavottord-web/types'

type CarStatus = 'inUse' | 'pendingRecycle' | 'deregistered'

export const filterCarsByStatus = (status: CarStatus, cars: Car[]) => {
  switch (status) {
    case 'pendingRecycle':
      return cars.filter((car: Car) => car?.status === 'pendingRecycle')
    case 'deregistered':
      return cars.filter(
        (car: Car) =>
          car.status === 'handOver' ||
          car.status === 'deregistered' ||
          car.status === 'paymentInitiated' ||
          car.status === 'paymentFailed',
      )
    case 'inUse':
    default:
      return cars.filter(
        (car: Car) => car.status === 'inUse' || car.status === 'cancelled',
      )
  }
}

export const filterInternalPartners = (partnerList: RecyclingPartner[]) => {
  return partnerList.filter(({ companyId }) => companyId !== '000')
}
