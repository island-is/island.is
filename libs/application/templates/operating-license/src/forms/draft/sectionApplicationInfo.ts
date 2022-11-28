import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildCheckboxField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { NO, ResturantCategories, YES } from '../../lib/constants'
import {
  APPLICATION_TYPES,
  ResturantTypes,
  HotelTypes,
  Operation,
  OPERATION_CATEGORY,
  HotelCategories,
} from '../../lib/constants'
import { Option } from '@island.is/application/types'

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
    buildRadioField({
      id: 'applicationInfo.category',
      title: m.operationCategoryHotelTitle,
      doesNotRequireAnswer: true,
      largeButtons: true,
      space: 'none',
      defaultValue: '',
      options: ({ answers }) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL
          ? HotelCategories
          : ResturantCategories,
      condition: (answers) =>
        !!(answers.applicationInfo as Operation)?.operation,
    }),
    ...[],
    buildRadioField({
      id: 'applicationInfo.typeHotel',
      title: m.operationTypeHotelTitle,
      options: ({ answers }) =>
        HotelTypes.map((option) => {
          return {
            ...(option as Option),
            disabled: !option.disabledFor
              ? false
              : option.disabledFor ===
                (answers.applicationInfo as Operation)?.category,
          }
        }),
      backgroundColor: 'blue',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
          APPLICATION_TYPES.HOTEL &&
        !!(answers.applicationInfo as Operation)?.category,
    }),
    buildCheckboxField({
      id: 'applicationInfo.typeResturant',
      title: m.operationTypeResturantTitle,
      options: ResturantTypes,
      backgroundColor: 'blue',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.RESTURANT,
    }),
    buildCheckboxField({
      id: 'applicationInfo.willServe',
      title: m.openingHoursOutside,
      options: [{ value: YES, label: m.openingHoursOutsideCheck }],
      defaultValue: [NO],
    }),
  ],
})
