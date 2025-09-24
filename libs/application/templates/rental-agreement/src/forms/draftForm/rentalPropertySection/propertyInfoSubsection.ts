import {
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
import * as m from '../../../lib/messages'

export const propertyInfoSubsection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: m.registerProperty.info.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYINFORMATION,
      title: m.registerProperty.category.pageTitle,
      children: [
        buildDescriptionField({
          id: 'propertyInfo.propertyInfoAddress',
          title: ({ answers }) => {
            const { searchResultLabel } = applicationAnswers(answers)
            return {
              ...m.registerProperty.info.propertyAddressAnswer,
              values: { propertyAddress: searchResultLabel },
            }
          },
          titleVariant: 'h3',
          condition: (answers) => Boolean(answers.registerProperty),
        }),
        buildStaticTableField({
          condition: (answers) => Boolean(answers.registerProperty),
          marginBottom: 5,
          header: [
            m.registerProperty.info.tableHeaderUsablity,
            m.registerProperty.info.tableHeaderUnitId,
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
          title: m.registerProperty.category.typeTitle,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'propertyInfo.categoryType',
          title: m.registerProperty.category.typeTitle,
          description: m.registerProperty.category.typeDescription,
          options: getPropertyTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
          marginBottom: 5,
        }),
        buildDescriptionField({
          id: 'propertyInfo.categoryClassTitle',
          title: m.registerProperty.category.classTitle,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'propertyInfo.categoryClass',
          description: m.registerProperty.category.classDescription,
          options: getPropertyClassOptions(),
          defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
          width: 'half',
          space: 0,
        }),
        buildSelectField({
          id: 'propertyInfo.categoryClassGroup',
          title: m.registerProperty.category.classGroupLabel,
          placeholder: m.registerProperty.category.classGroupPlaceholder,
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
