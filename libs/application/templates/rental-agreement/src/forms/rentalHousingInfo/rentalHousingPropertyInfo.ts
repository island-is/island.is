import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { postalCodes } from '@island.is/shared/utils'
import {
  rentalHousingCategoryClass,
  rentalHousingCategoryTypes,
} from '../../lib/constants'
import {
  getApplicationAnswers,
  getPropertyCategoryClassGroupOptions,
  getPropertyCategoryClassOptions,
  getPropertyCategoryTypeOptions,
} from '../../lib/utils'
import * as m from '../../lib/messages'

const messagesInfo = m.registerProperty.info
const messagesInfoSummary = m.registerProperty.infoSummary
const messagesCategory = m.registerProperty.category

export const RentalHousingPropertyInfo: SubSection = buildSubSection({
  id: 'registerProperty',
  title: m.registerProperty.subsection.name,
  children: [
    buildMultiField({
      id: 'registerPropertyInfo',
      title: messagesInfo.pageTitle,
      description: messagesInfo.pageDescription,
      children: [
        buildTextField({
          id: 'registerPropertyInfoAddress',
          title: messagesInfo.addressLabel,
          placeholder: messagesInfo.addressPlaceholder,
          required: true,
          maxLength: 50,
        }),
        buildTextField({
          id: 'registerPropertyInfoPropertyId',
          title: messagesInfo.propertyIdLabel,
          placeholder: messagesInfo.propertyIdPlaceholder,
          width: 'half',
          maxLength: 10,
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoUnitId',
          title: messagesInfo.propertyUnitIdLabel,
          placeholder: messagesInfo.propertyUnitIdPlaceholder,
          width: 'half',
          maxLength: 6,
          required: true,
        }),
        buildSelectField({
          id: 'registerPropertyInfoPostalCode',
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
          id: 'registerPropertyInfoMunicipality',
          title: messagesInfo.municipalityLabel,
          placeholder: messagesInfo.municipalityPlaceholder,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoSize',
          title: messagesInfo.sizeLabel,
          placeholder: '',
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoNumOfRooms',
          title: messagesInfo.numOfRoomsLabel,
          placeholder: '',
          variant: 'number',
          width: 'half',
          required: true,
        }),
      ],
    }),
    buildMultiField({
      id: 'registerPropertyInfoSummary',
      title: '',
      condition: (answers) => !!answers.registerPropertyInfoAddress,
      children: [
        buildStaticTableField({
          title: messagesInfoSummary.pageTitle,
          description: messagesInfoSummary.pageDescription,
          header: [
            messagesInfoSummary.tableHeaderPropertyId,
            messagesInfoSummary.tableHeaderAddress,
            messagesInfoSummary.tableHeaderUnitId,
            messagesInfoSummary.tableHeaderSize,
            messagesInfoSummary.tableHeaderNumOfRooms,
          ],
          rows({ answers }) {
            return [
              [
                answers.registerPropertyInfoPropertyId
                  ? `F${answers.registerPropertyInfoPropertyId}`
                  : '',
                answers.registerPropertyInfoAddress
                  ? `${answers.registerPropertyInfoAddress.toString()}, ${answers.registerPropertyInfoMunicipality.toString()}`
                  : '',
                answers.registerPropertyInfoUnitId
                  ? `${answers.registerPropertyInfoUnitId.toString()}`
                  : '',
                answers.registerPropertyInfoSize
                  ? `${answers.registerPropertyInfoSize.toString()} m²`
                  : '',
                answers.registerPropertyInfoNumOfRooms
                  ? `${answers.registerPropertyInfoNumOfRooms.toString()}`
                  : '',
              ],
            ]
          },
        }),
      ],
    }),
    buildMultiField({
      id: 'registerPropertyCategory',
      title: messagesCategory.pageTitle,
      description: messagesCategory.pageDescription,
      children: [
        buildDescriptionField({
          id: 'registerPropertyCategoryTitle',
          title: messagesCategory.typeTitle,
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'registerPropertyCategoryType',
          title: messagesCategory.typeTitle,
          description: messagesCategory.typeDescription,
          options: getPropertyCategoryTypeOptions(),
          defaultValue: rentalHousingCategoryTypes.ENTIRE_HOME,
          required: true,
        }),
        buildRadioField({
          id: 'registerPropertyCategoryClass',
          title: messagesCategory.classTitle,
          description: messagesCategory.classDescription,
          options: getPropertyCategoryClassOptions(),
          defaultValue: rentalHousingCategoryClass.GENERAL_MARKET,
          required: true,
          width: 'half',
          space: 5,
        }),
        buildSelectField({
          id: 'registerPropertyCategoryClassGroup',
          title: messagesCategory.classGroupLabel,
          placeholder: messagesCategory.classGroupPlaceholder,
          condition: (answers) => {
            const { propertyCategoryClassOptions } =
              getApplicationAnswers(answers)
            return (
              propertyCategoryClassOptions ===
              rentalHousingCategoryClass.SPECIAL_GROUPS
            )
          },
          options: getPropertyCategoryClassGroupOptions(),
        }),
      ],
    }),
  ],
})
