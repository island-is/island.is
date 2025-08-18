import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { RentalHousingCategoryClass, applicationAnswers } from '../../../shared'
import {
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
} from '../../../utils/utils'
import { Routes, RentalHousingCategoryTypes } from '../../../utils/enums'
import { registerProperty } from '../../../lib/messages'

const messagesInfo = registerProperty.info
const messagesCategory = registerProperty.category

export const RentalHousingPropertyInfo: SubSection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: messagesInfo.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYINFORMATION,
      title: messagesCategory.pageTitle,
      description: messagesCategory.pageDescription,
      children: [
        buildDescriptionField({
          id: 'propertyInfo.propertyInfoAddress',
          title: ({ answers }) => {
            const { searchResultLabel } = applicationAnswers(answers)
            return {
              ...messagesInfo.propertyAddressAnswer,
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
            messagesInfo.tableHeaderUsablity,
            messagesInfo.tableHeaderUnitId,
            messagesInfo.tableHeaderSize,
            messagesInfo.tableHeaderNumberOfRooms,
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
          title: messagesCategory.typeTitle,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'propertyInfo.categoryType',
          title: messagesCategory.typeTitle,
          description: messagesCategory.typeDescription,
          options: getPropertyTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
          marginBottom: 5,
        }),
        buildDescriptionField({
          id: 'propertyInfo.categoryClassTitle',
          title: messagesCategory.classTitle,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'propertyInfo.categoryClass',
          description: messagesCategory.classDescription,
          options: getPropertyClassOptions(),
          defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
          width: 'half',
          space: 0,
        }),
        buildSelectField({
          id: 'propertyInfo.categoryClassGroup',
          title: messagesCategory.classGroupLabel,
          placeholder: messagesCategory.classGroupPlaceholder,
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
