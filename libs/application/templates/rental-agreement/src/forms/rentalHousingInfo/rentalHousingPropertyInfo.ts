import {
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
} from '../../lib/constants'
import {
  getApplicationAnswers,
  getPropertyCategoryClassGroupOptions,
  getPropertyCategoryClassOptions,
  getPropertyCategoryTypeOptions,
} from '../../lib/utils'
import * as m from '../../lib/messages'

const messagesInfo = m.registerProperty.info
const messagesSummary = m.registerProperty.infoSummary
const messagesCategory = m.registerProperty.category

export const RentalHousingPropertyInfo: SubSection = buildSubSection({
  id: 'registerProperty',
  title: m.registerProperty.subsection.name,
  children: [
    buildMultiField({
      id: 'registerProperty.info',
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
          maxLength: 6,
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
      id: 'registerProperty.summary',
      title: '',
      condition: (answers) => Boolean(answers.registerPropertyInfoAddress),
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
                propertyId ? `F${propertyId}` : '-',
                address
                  ? `${address}${municipality ? `, ${municipality}` : ''}`
                  : '-',
                unitId ? unitId : '-',
                size ? `${size} m²` : '-',
                numOfRooms ? numOfRooms : '-',
              ],
            ]
          },
        }),
      ],
    }),
    buildMultiField({
      id: 'registerProperty.category',
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
          options: getPropertyCategoryTypeOptions(),
          defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
        }),
        buildRadioField({
          id: 'registerProperty.categoryClass',
          title: messagesCategory.classTitle,
          description: messagesCategory.classDescription,
          options: getPropertyCategoryClassOptions(),
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
            const { propertyCategoryClassOptions } =
              getApplicationAnswers(answers)
            return (
              propertyCategoryClassOptions ===
              RentalHousingCategoryClass.SPECIAL_GROUPS
            )
          },
          options: getPropertyCategoryClassGroupOptions(),
        }),
      ],
    }),
  ],
})
