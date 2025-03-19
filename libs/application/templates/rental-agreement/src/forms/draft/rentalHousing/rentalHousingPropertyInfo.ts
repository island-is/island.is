import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubmitField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  Routes,
} from '../../../lib/constants'
import {
  getApplicationAnswers,
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
} from '../../../lib/utils'
import { registerProperty } from '../../../lib/messages'
import { RentalAgreement } from '../../../lib/dataSchema'

const messagesInfo = registerProperty.info
const messagesSummary = registerProperty.infoSummary
const messagesCategory = registerProperty.category

export const RentalHousingPropertyInfo: SubSection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: registerProperty.subsection.name,
  children: [
    buildMultiField({
      id: Routes.PROPERTYINFORMATION_SEARCH,
      title: messagesInfo.pageTitle,
      description: messagesInfo.pageDescription,
      children: [
        buildCustomField({
          id: 'registerProperty.searchresults',
          title: '',
          component: 'PropertySearch',
        }),
      ],
    }),
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
              ...messagesSummary.propertyAddressAnswer,
              values: { propertyAddress: value },
            }
          },
          titleVariant: 'h3',
          condition: (answers) => Boolean(answers.registerProperty),
        }),
        buildStaticTableField({
          title: '',
          condition: (answers) => Boolean(answers.registerProperty),
          marginBottom: 5,
          header: [
            messagesSummary.tableHeaderUsablity,
            messagesSummary.tableHeaderUnitId,
            messagesSummary.tableHeaderSize,
            messagesSummary.tableHeaderNumOfRooms,
          ],
          rows({ answers }) {
            const selectedPropertyUnits =
              getValueViaPath<any[]>(
                answers,
                'registerProperty.searchresults.units',
              ) || []

            // Return an array of selectedPropertyUnits
            return selectedPropertyUnits?.map((unit) => [
              unit.propertyUsageDescription || '',
              unit.unitCode || '',
              `${unit.size} ${unit.sizeUnit}` || '',
              '', // TODO: Add number of rooms
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
          title: '',
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
            const { propertyClassOptions } = getApplicationAnswers(answers)
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
