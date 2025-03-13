import {
  buildMultiField,
  buildRadioField,
  buildCheckboxField,
  buildDescriptionField,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { ResturantCategories } from '../../lib/constants'
import {
  APPLICATION_TYPES,
  ResturantTypes,
  HotelTypes,
  Operation,
  OPERATION_CATEGORY,
  HotelCategories,
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
    buildRadioField({
      id: 'applicationInfo.typeHotel',
      title: m.operationTypeHotelTitle,
      options: ({ answers }) => {
        return (answers.applicationInfo as Operation).category !==
          OPERATION_CATEGORY.TWO
          ? [
              {
                value: 'A Hótel',
                label: 'Hótel',
                subLabel:
                  'Gististaður þar sem gestamóttaka er aðgengileg allan sólarhringinn og veitingar að einhverju tagi framleiddar á staðnum. Fullbúin baðaðstaða skal vera með hverju herbergi.',
              },
              ...HotelTypes,
            ]
          : HotelTypes
      },
      backgroundColor: 'blue',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    //fake field to trigger rerender on category switch
    buildDescriptionField({
      id: 'fake_helper_field',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
          APPLICATION_TYPES.HOTEL &&
        (answers.applicationInfo as Operation)?.category ===
          OPERATION_CATEGORY.TWO,
    }),
    buildCheckboxField({
      id: 'applicationInfo.typeResturant',
      title: m.operationTypeResturantTitle,
      defaultValue: [],
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
      condition: (answers) => {
        const applicationInfo = answers.applicationInfo as Operation
        return (
          applicationInfo?.operation === APPLICATION_TYPES.RESTURANT ||
          applicationInfo?.category === OPERATION_CATEGORY.FOUR
        )
      },
    }),
  ],
})
