import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { SubSection } from '@island.is/application/types'

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
          variant: 'text',
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoPropertyId',
          title: messagesInfo.propertyIdLabel,
          placeholder: messagesInfo.propertyIdPlaceholder,
          variant: 'text',
          width: 'half',
          minLength: 10,
          maxLength: 10,
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoUnitId',
          title: messagesInfo.propertyUnitIdLabel,
          placeholder: messagesInfo.propertyUnitIdPlaceholder,
          variant: 'text',
          width: 'half',
          minLength: 6,
          maxLength: 6,
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoPostalCode',
          title: messagesInfo.postalCodeLabel,
          placeholder: messagesInfo.postalCodePlaceholder,
          variant: 'text',
          width: 'half',
          maxLength: 3,
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoMunicipality',
          title: messagesInfo.municipalityLabel,
          placeholder: messagesInfo.municipalityPlaceholder,
          variant: 'text',
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'registerPropertyInfoSize',
          title: messagesInfo.sizeLabel,
          placeholder: '',
          variant: 'text',
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
      condition: (answers) =>
        answers.registerPropertyInfoPropertyId !== '' &&
        answers.registerPropertyInfoUnitId !== '' &&
        answers.registerPropertyInfoAddress !== '' &&
        answers.registerPropertyInfoSize !== '' &&
        answers.propertyNumOfRooms !== '',
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
          description: messagesCategory.pageDescription,
          options: [
            {
              value: 'entireHome',
              label: messagesCategory.typeSelectLabelEntireHome,
            },
            {
              value: 'Room',
              label: messagesCategory.typeSelectLabelRoom,
            },
            {
              value: 'commercial',
              label: messagesCategory.typeSelectLabelCommercial,
            },
          ],
          defaultValue: 'entireHome',
          required: true,
        }),
        buildRadioField({
          id: 'registerPropertyCategoryClass',
          title: messagesCategory.classTitle,
          description: messagesCategory.classDescription,
          options: [
            {
              value: 'generalMarket',
              label: messagesCategory.classSelectLabelGeneralMarket,
            },
            {
              value: 'specialGroups',
              label: messagesCategory.classSelectLabelSpecialGroups,
            },
          ],
          defaultValue: 'generalMarket',
          required: true,
          width: 'half',
          space: 5,
        }),
        buildSelectField({
          id: 'registerPropertyCategoryClassGroup',
          title: messagesCategory.classGroupLabel,
          placeholder: messagesCategory.classGroupPlaceholder,
          options: [
            {
              value: 'studentHousing',
              label: messagesCategory.classGroupSelectLabelStudentHousing,
            },
            {
              value: 'seniorCitizenHousing',
              label: messagesCategory.classGroupSelectLabelSeniorCitizenHousing,
            },
            {
              value: 'commune',
              label: messagesCategory.classGroupSelectLabelCommune,
            },
            {
              value: 'halfwayHouse',
              label: messagesCategory.classGroupSelectLabelHalfwayHouse,
            },
            {
              value: 'socialHousing',
              label: messagesCategory.classGroupSelectLabelSocialHousing,
            },
            {
              value: 'incomeBasedHousing',
              label: messagesCategory.classGroupSelectLabelIncomeBasedHousing,
            },
            {
              value: 'employeeHousing',
              label: messagesCategory.classGroupSelectLabelEmployeeHousing,
            },
          ],
          condition: (answers) =>
            answers.propertyMarketType === 'specialGroups',
        }),
      ],
    }),
  ],
})
