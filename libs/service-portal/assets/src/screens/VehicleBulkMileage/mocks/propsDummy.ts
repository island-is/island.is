import { VehicleType } from '../types'

export const dummy: Array<VehicleType> = [
  {
    vehicleId: 'AA001',
    vehicleType: 'MAZDA 3',
    submissionStatus: 'idle',
    lastRegistrationDate: new Date('2021-06-11'),
    isCurrentlyEditing: false,
    registrationHistory: [
      {
        date: new Date('2021-06-11'),
        origin: 'ISLAND-IS',
        mileage: 2,
      },
    ],
  },
  {
    vehicleId: 'BCD89',
    vehicleType: 'SUBARU IMPREZA',
    submissionStatus: 'idle',
    lastRegistrationDate: new Date(),
    isCurrentlyEditing: false,
    registrationHistory: [
      {
        date: new Date(),
        origin: 'ISLAND-IS',
        mileage: 99,
      },
      {
        date: new Date('2021-06-11'),
        origin: 'ISLAND-IS',
        mileage: 3,
      },
    ],
  },
  {
    vehicleId: 'ZZZ99',
    vehicleType: 'HONDA COOL',
    submissionStatus: 'idle',
    lastRegistrationDate: new Date(),
    isCurrentlyEditing: false,
    registrationHistory: [
      {
        date: new Date(),
        origin: 'ISLAND-IS',
        mileage: 99,
      },
      {
        date: new Date('2021-06-11'),
        origin: 'ISLAND-IS',
        mileage: 3,
      },
    ],
  },
]
