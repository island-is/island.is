import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildCheckboxField,
  buildSelectField,
  YES,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { information } from '../../../lib/messages'
import { getSelectedVehicle, isSendToOtherAddress } from '../../../utils'

const showOtherAddress = (formValue: FormValue) =>
  isSendToOtherAddress(formValue)

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.pageTitle,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: information.labels.vehicle.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'vehicleInfo.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'vehicleInfo.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.make
          },
        }),
        buildCustomField({
          id: 'mainOwner',
          component: 'MainOwner',
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role !== 'Eigandi'
          },
        }),
        buildDescriptionField({
          id: 'owner.title',
          title: information.labels.owner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
        }),
        buildDescriptionField({
          id: 'coOwner.title',
          title: information.labels.coOwner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role !== 'Eigandi'
          },
        }),
        buildTextField({
          id: 'owner.name',
          title: information.labels.owner.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.name,
        }),
        buildTextField({
          id: 'owner.nationalId',
          title: information.labels.owner.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'owner.address',
          title: information.labels.owner.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.address?.streetAddress,
        }),
        buildTextField({
          id: 'owner.postalCode',
          title: information.labels.owner.postalcode,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.address?.postalCode,
        }),
        buildDescriptionField({
          id: 'sendToAddress.description',
          description: information.labels.sendToAddress.description,
          space: 3,
        }),
        buildCheckboxField({
          id: 'sendToAddress.useOtherAddress',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: information.labels.sendToAddress.checkbox,
            },
          ],
        }),
        buildTextField({
          id: 'sendToAddress.name',
          title: information.labels.sendToAddress.name,
          width: 'full',
          required: true,
          maxLength: 100,
          condition: showOtherAddress,
        }),
        buildTextField({
          id: 'sendToAddress.address1',
          title: information.labels.sendToAddress.address1,
          width: 'half',
          required: true,
          maxLength: 100,
          condition: showOtherAddress,
        }),
        buildTextField({
          id: 'sendToAddress.address2',
          title: information.labels.sendToAddress.address2,
          width: 'half',
          maxLength: 100,
          condition: showOtherAddress,
        }),
        buildTextField({
          id: 'sendToAddress.apartment',
          title: information.labels.sendToAddress.apartment,
          width: 'half',
          maxLength: 20,
          condition: showOtherAddress,
        }),
        buildTextField({
          id: 'sendToAddress.postalCode',
          title: information.labels.sendToAddress.postalCode,
          width: 'half',
          required: true,
          maxLength: 20,
          condition: showOtherAddress,
        }),
        buildTextField({
          id: 'sendToAddress.city',
          title: information.labels.sendToAddress.city,
          width: 'half',
          required: true,
          maxLength: 100,
          condition: showOtherAddress,
        }),
        buildSelectField({
          id: 'sendToAddress.country',
          title: information.labels.sendToAddress.country,
          width: 'half',
          required: true,
          defaultValue: 'IS',
          condition: showOtherAddress,
          options: (_application, _field, locale) =>
            getAllCountryCodes(locale).map((country) => ({
              value: country.code,
              label:
                locale === 'is' ? country.name_is ?? country.name : country.name,
            })),
        }),
      ],
    }),
  ],
})
