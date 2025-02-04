import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  Routes,
} from '../../lib/constants'
import {
  getApplicationAnswers,
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
} from '../../lib/utils'
import { registerProperty } from '../../lib/messages'

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
      id: 'registerProperty.summary',
      title: '',
      condition: (answers) => Boolean(answers.registerProperty),
      children: [
        buildStaticTableField({
          title: messagesSummary.pageTitle,
          description: messagesSummary.pageDescription,
          header: [
            messagesSummary.tableHeaderPropertyId,
            messagesSummary.tableHeaderAddress,
            messagesSummary.tableHeaderUnitId,
            messagesSummary.tableHeaderSize,
            messagesSummary.tableHeaderNumOfRooms,
          ],
          rows({ answers }) {
            const propertyId = getValueViaPath(
              answers,
              'registerProperty.searchresults.propertyId',
            )
            const address = getValueViaPath(
              answers,
              'registerProperty.searchresults.streetAddress',
            )
            const postalCode = getValueViaPath(
              answers,
              'registerProperty.searchresults.regionNumber',
            )
            const municipality = getValueViaPath(
              answers,
              'registerProperty.searchresults.cityName',
            )
            const unitId = getValueViaPath(
              answers,
              'registerProperty.searchresults.marking',
            )
            const size = getValueViaPath(
              answers,
              'registerProperty.searchresults.size',
            )
            const numOfRooms = getValueViaPath(
              answers,
              'registerProperty.searchresults.numberOfRooms',
            )
            return [
              [
                propertyId ? `F${propertyId}` : '--',
                address
                  ? `${address}, ${postalCode && postalCode} ${
                      municipality && municipality
                    }`
                  : '--',
                unitId ? unitId : '--',
                size ? `${size} m²` : '--',
                numOfRooms ? numOfRooms : '--',
              ],
            ]
          },
        }),
      ],
    }),
    buildMultiField({
      id: Routes.PROPERTYCATEGORY,
      title: messagesCategory.pageTitle,
      description: messagesCategory.pageDescription,
      children: [
        buildDescriptionField({
          id: 'registerProperty.categoryTitle',
          title: messagesCategory.typeTitle,
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'registerProperty.categoryType',
          title: messagesCategory.typeTitle,
          description: messagesCategory.typeDescription,
          options: getPropertyTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
        }),
        buildRadioField({
          id: 'registerProperty.categoryClass',
          title: messagesCategory.classTitle,
          description: messagesCategory.classDescription,
          options: getPropertyClassOptions(),
          defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
          required: true,
          width: 'half',
          space: 5,
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
