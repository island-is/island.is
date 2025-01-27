import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { postalCodes } from '@island.is/shared/utils'
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
      id: Routes.PROPERTYINFORMATION,
      title: messagesInfo.pageTitle,
      description: messagesInfo.pageDescription,
      children: [
        buildTextField({
          id: 'registerProperty.address',
          title: messagesInfo.addressLabel,
          placeholder: messagesInfo.addressPlaceholder,
          required: true,
          maxLength: 50,
        }),
        buildTextField({
          id: 'registerProperty.propertyId',
          title: messagesInfo.propertyIdLabel,
          placeholder: messagesInfo.propertyIdPlaceholder,
          width: 'half',
          maxLength: 10,
          required: true,
        }),
        buildTextField({
          id: 'registerProperty.unitId',
          title: messagesInfo.propertyUnitIdLabel,
          placeholder: messagesInfo.propertyUnitIdPlaceholder,
          width: 'half',
          format: '## ####',
          required: true,
        }),
        buildSelectField({
          id: 'registerProperty.postalCode',
          title: messagesInfo.postalCodeLabel,
          placeholder: messagesInfo.postalCodePlaceholder,
          width: 'half',
          required: true,
          options: () => {
            return postalCodes.map((code) => {
              return { value: `${code}`, label: `${code}` }
            })
          },
        }),
        buildTextField({
          id: 'registerProperty.municipality',
          title: messagesInfo.municipalityLabel,
          placeholder: messagesInfo.municipalityPlaceholder,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'registerProperty.size',
          title: messagesInfo.sizeLabel,
          placeholder: '',
          width: 'half',
          variant: 'number',
          required: true,
        }),
        buildTextField({
          id: 'registerProperty.numOfRooms',
          title: messagesInfo.numOfRoomsLabel,
          placeholder: '',
          variant: 'number',
          width: 'half',
          required: true,
        }),
      ],
    }),

    buildMultiField({
      id: Routes.PROPERTYINFORMATION_SERCH,
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
              'registerProperty.propertyId',
            )
            const address = getValueViaPath(answers, 'registerProperty.address')
            const municipality = getValueViaPath(
              answers,
              'registerProperty.municipality',
            )
            const unitId = getValueViaPath(answers, 'registerProperty.unitId')
            const size = getValueViaPath(answers, 'registerProperty.size')
            const numOfRooms = getValueViaPath(
              answers,
              'registerProperty.numOfRooms',
            )
            return [
              [
                propertyId ? `F${propertyId}` : '--',
                address
                  ? `${address}${municipality ? `, ${municipality}` : ''}`
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
