import { factory, faker } from '@island.is/shared/mocking'
import {
  VehicleListed,
  VehicleMileageOverview,
  VehiclesDetail,
} from '../../types'

export const singleVehicle = factory<VehicleListed>({
  permno: () => faker.vehicle.vin().slice(0, 5),
  regno: () => faker.vehicle.vin().slice(0, 5),
  make: () => faker.vehicle.model(),
  colorName: () => faker.commerce.color().toLocaleUpperCase(),
  requiresMileageRegistration: () => faker.datatype.boolean(),
  nextMainInspection: () => maybeExpired(),
})

export const maybeExpired = () =>
  faker.datatype.boolean()
    ? faker.date.past().toISOString()
    : faker.date.future().toISOString()

export const vehicleDetail = factory<VehiclesDetail>({
  mainInfo: {
    regno: singleVehicle().regno,
    model: singleVehicle().make,
    year: faker.date.past().getFullYear(),
    trailerWithBrakesWeight: faker.datatype.number(),
    trailerWithoutBrakesWeight: faker.datatype.number(),
    co2: faker.datatype.number(),
    requiresMileageRegistration: singleVehicle().requiresMileageRegistration,
  },
  basicInfo: {
    permno: singleVehicle().permno,
  },
  registrationInfo: {
    firstRegistrationDate: faker.date.past().toISOString(),
    color: singleVehicle().colorName,
  },
  inspectionInfo: {
    nextInspectionDate: singleVehicle().nextMainInspection,
    odometer: faker.datatype.number().toString(),
    carTax: faker.datatype.number(),
  },
  technicalInfo: {
    totalWeight: faker.datatype.number().toString(),
    capacityWeight: faker.datatype.number(),
    vehicleWeight: faker.datatype.number(),
  },
  lastMileage: {
    mileage: faker.datatype.number().toString(),
  },
  latestMileageRegistration: faker.datatype.number(),
})

export const vehicleMileageDetail = factory<VehicleMileageOverview>({
  data: [
    {
      permno: singleVehicle().permno,
      readDate: faker.date.past().toISOString(),
      mileage: faker.datatype.number().toString(),
      originCode: faker.random.arrayElement(['ISLAND.IS', 'SKODUN']),
      internalId: faker.datatype.uuid(),
    },
    {
      permno: singleVehicle().permno,
      readDate: faker.date.past().toISOString(),
      mileage: faker.datatype.number().toString(),
      originCode: faker.random.arrayElement(['ISLAND.IS', 'SKODUN']),
      internalId: faker.datatype.uuid(),
    },
    {
      permno: singleVehicle().permno,
      readDate: faker.date.past().toISOString(),
      mileage: faker.datatype.number().toString(),
      originCode: faker.random.arrayElement(['ISLAND.IS', 'SKODUN']),
      internalId: faker.datatype.uuid(),
    },
  ],
  permno: singleVehicle().permno,
  editing: faker.datatype.boolean(),
  canUserRegisterVehicleMileage: true,
  canRegisterMileage: true,
  requiresMileageRegistration: singleVehicle().requiresMileageRegistration,
})
