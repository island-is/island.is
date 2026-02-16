import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
} from '@island.is/application/core'
import { RentalHousingCategoryClass, applicationAnswers } from '../../../shared'
import { Routes, RentalHousingCategoryTypes } from '../../../utils/enums'
import {
  getPropertyClassGroupOptions,
  getPropertyClassOptions,
  getPropertyTypeOptions,
} from '../../../utils/options'
import { shouldShowRoomTypeRoomCountError } from '../../../utils/conditions'
import * as m from '../../../lib/messages'

export const propertyInfoSubsection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: m.propertySearch.info.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYINFORMATION,
      title: m.propertySearch.category.pageTitle,
      children: [
        buildDescriptionField({
          id: 'propertyInfo.propertyInfoAddress',
          title: ({ answers }) => {
            const { searchResultLabel } = applicationAnswers(answers)
            return {
              ...m.propertySearch.info.propertyAddressAnswer,
              values: { propertyAddress: searchResultLabel },
            }
          },
          titleVariant: 'h3',
          condition: (answers) => Boolean(answers.propertySearch),
        }),
        buildStaticTableField({
          condition: (answers) => Boolean(answers.propertySearch),
          marginBottom: 5,
          header: [
            m.propertySearch.info.tableHeaderUsablity,
            m.propertySearch.info.tableHeaderUnitId,
            m.misc.size,
            m.misc.rooms,
          ],
          rows({ answers }) {
            const { units } = applicationAnswers(answers)
            return units?.map((unit) => [
              unit.propertyUsageDescription || '',
              unit.unitCode || '',
              unit.changedSize
                ? `${unit.changedSize} ${unit.sizeUnit}`
                : `${unit.size} ${unit.sizeUnit}`,
              unit.numOfRooms?.toString() || '',
            ])
          },
        }),

        buildDescriptionField({
          id: 'propertyInfo.categoryTitle',
          title: m.propertySearch.category.typeTitle,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'propertyInfo.categoryType',
          title: m.propertySearch.category.typeTitle,
          description: m.propertySearch.category.typeDescription,
          options: getPropertyTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
          marginBottom: 5,
        }),
        buildAlertMessageField({
          id: 'propertyInfo.roomTypeRoomCountError',
          title: '',
          alertType: 'error',
          message: m.propertySearch.search.numOfRoomsForRoomTypeError,
          condition: shouldShowRoomTypeRoomCountError,
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
        buildDescriptionField({
          id: 'propertyInfo.categoryClassTitle',
          title: m.propertySearch.category.classTitle,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'propertyInfo.categoryClass',
          description: m.propertySearch.category.classDescription,
          options: getPropertyClassOptions(),
          defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
          width: 'half',
          space: 0,
        }),
        buildSelectField({
          id: 'propertyInfo.categoryClassGroup',
          title: m.propertySearch.category.classGroupLabel,
          placeholder: m.propertySearch.category.classGroupPlaceholder,
          options: getPropertyClassGroupOptions(),
          condition: (answers) => {
            const { categoryClass } = applicationAnswers(answers)
            return categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
          },
        }),
      ],
    }),
  ],
})
