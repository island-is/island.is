import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  APPLICATION_TYPES,
  ResturantTypes,
  HotelTypes,
  Operation,
  OPERATION_CATEGORY,
} from '../../lib/constants'

export const applicationInfo = buildMultiField({
  id: 'applicationInfo',
  title: m.operationTitle,
  description: m.operationSubtitle,
  children: [
    buildRadioField({
      id: 'applicationInfo.operation',
      title: m.operationSelectionTitle,
      options: [
        { value: APPLICATION_TYPES.HOTEL, label: m.operationHotel },
        {
          value: APPLICATION_TYPES.RESTURANT,
          label: m.operationResturant,
        },
      ],
      width: 'half',
      largeButtons: true,
    }),

    buildCheckboxField({
      id: 'applicationInfo.hotel.category',
      title: '',
      description: m.operationCategoryHotelTitle,
      doesNotRequireAnswer: true,
      large: true,
      options: [
        {
          value: OPERATION_CATEGORY.ONE,
          label: m.operationCategoryHotelOne,
        },
        {
          value: OPERATION_CATEGORY.TWO,
          label: m.operationCategoryHotelTwo,
        },
      ],
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    buildRadioField({
      id: 'applicationInfo.resturant.category',
      title: '',
      description: m.operationCategoryResturantTitle,
      options: [
        {
          value: OPERATION_CATEGORY.ONE,
          label: m.operationCategoryResturantOne,
        },
        {
          value: OPERATION_CATEGORY.TWO,
          label: m.operationCategoryResturantTwo,
        },
      ],
      width: 'half',
      largeButtons: true,
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.RESTURANT,
    }),
    buildSelectField({
      id: 'applicationInfo.hotel.type',
      title: m.operationTypeHotelTitle,
      description: m.operationTypeHotelDescription,
      options: HotelTypes,
      backgroundColor: 'blue',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    buildSelectField({
      id: 'applicationInfo.resturant.type',
      title: m.operationTypeResturantTitle,
      description: m.operationTypeResturantDescription,
      backgroundColor: 'blue',
      options: ResturantTypes,
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.RESTURANT,
    }),
  ],
})
