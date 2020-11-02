import { Car } from '@island.is/skilavottord-web/types'

type CarStatus = 'inUse' | 'pendingRecycle' | 'deregistered'

export const filterCarsByStatus = (status: CarStatus, carList: Car[]) => {
  switch (status) {
    case 'pendingRecycle':
      return carList.filter((car: Car) => {
        return car?.status === 'pendingRecycle'
      })
    case 'deregistered':
      carList.filter(
        (car: Car) =>
          car.status === 'deregistered' ||
          car.status === 'paymentInitiated' ||
          car.status === 'paymentFailed',
      )
    case 'inUse':
    default:
      return carList.filter(
        (car: Car) => car.status === 'inUse' || car.status === undefined,
      )
  }
}
