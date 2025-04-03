import { factory, faker } from '@island.is/shared/mocking'
import { DocumentV2 } from '../../types'

const categoryIds = ['1', '2', '3', '4', '5']

export const document = factory<DocumentV2>({
  id: faker.datatype.uuid(),
  bookmarked: faker.datatype.boolean(),
  categoryId: '1',
  documentDate: faker.date.past().toISOString(),
  isUrgent: faker.datatype.boolean(),
  opened: faker.datatype.boolean(),
  publicationDate: faker.date.past().toISOString(),
  subject: faker.lorem.sentence(),
  sender: {
    id: '',
  },

  //   mainInfo: {
  //     regno: singleVehicle().regno,
  //     model: singleVehicle().make,
  //     year: faker.date.past().getFullYear(),
  //     trailerWithBrakesWeight: faker.datatype.number(),
  //     trailerWithoutBrakesWeight: faker.datatype.number(),
  //     co2: faker.datatype.number(),
  //     requiresMileageRegistration: singleVehicle().requiresMileageRegistration,
  //   },
  //   basicInfo: {
  //     permno: singleVehicle().permno,
  //   },
  //   registrationInfo: {
  //     firstRegistrationDate: faker.date.past().toISOString(),
  //     color: singleVehicle().colorName,
  //   },
  //   inspectionInfo: {
  //     nextInspectionDate: singleVehicle().nextMainInspection,
  //     odometer: faker.datatype.number().toString(),
  //     carTax: faker.datatype.number(),
  //   },
  //   technicalInfo: {
  //     totalWeight: faker.datatype.number().toString(),
  //     capacityWeight: faker.datatype.number(),
  //     vehicleWeight: faker.datatype.number(),
  //   },
  //   lastMileage: {
  //     mileage: faker.datatype.number().toString(),
  //   },
})
