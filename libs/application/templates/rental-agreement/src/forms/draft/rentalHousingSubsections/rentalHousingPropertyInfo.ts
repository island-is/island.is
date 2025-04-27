import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { Unit } from '../../../utils/types'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  Routes,
} from '../../../utils/constants'
import {
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
  extractApplicationAnswers,
} from '../../../utils/utils'
import { registerProperty } from '../../../lib/messages'

const messagesInfo = registerProperty.info
const messagesCategory = registerProperty.category

export const RentalHousingPropertyInfo: SubSection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: messagesInfo.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYCATEGORY,
      title: messagesCategory.pageTitle,
      description: messagesCategory.pageDescription,
      children: [
        buildDescriptionField({
          id: 'registerProperty.propertyInfoAddress',
          title: ({ answers }) => {
            const value = getValueViaPath<string>(
              answers,
              'registerProperty.searchresults.label',
            )
            return {
              ...messagesInfo.propertyAddressAnswer,
              values: { propertyAddress: value },
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
            const selectedPropertyUnits =
              getValueViaPath<Unit[]>(
                answers,
                'registerProperty.searchresults.units',
              ) || []

            return selectedPropertyUnits?.map((unit) => [
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
          id: 'registerProperty.categoryTitle',
          title: messagesCategory.typeTitle,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'registerProperty.categoryType',
          title: messagesCategory.typeTitle,
          description: messagesCategory.typeDescription,
          options: getPropertyTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
          marginBottom: 5,
        }),
        buildDescriptionField({
          id: 'registerProperty.categoryClassTitle',
          title: messagesCategory.classTitle,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'registerProperty.categoryClass',
          description: messagesCategory.classDescription,
          options: getPropertyClassOptions(),
          clearOnChange: ['registerProperty.categoryClassGroup'],
          defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
          required: true,
          width: 'half',
          space: 0,
        }),
        buildSelectField({
          id: 'registerProperty.categoryClassGroup',
          title: messagesCategory.classGroupLabel,
          placeholder: messagesCategory.classGroupPlaceholder,
          condition: (answers) => {
            const { propertyClassOptions } = extractApplicationAnswers(answers)
            return (
              propertyClassOptions === RentalHousingCategoryClass.SPECIAL_GROUPS
            )
          },
          options: getPropertyClassGroupOptions(),
        }),
      ],
    }),
  ],
})
