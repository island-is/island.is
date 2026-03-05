import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildPaginatedSearchableTableField,
  buildSection,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { VehicleWithMileage } from '../../lib/types'
import { RegistrationType } from '../../utils/constants'

const VEHICLE_TABLE_THRESHOLD = 5

const getVehicles = (externalData: ExternalData): VehicleWithMileage[] =>
  getValueViaPath<VehicleWithMileage[]>(
    externalData,
    'getCurrentVehicles.data',
  ) ?? []

export const importVehiclesSection = buildSection({
  condition: (answers) => {
    const registrationTypeValue = getValueViaPath<string>(
      answers,
      'registrationType',
    )

    return registrationTypeValue === RegistrationType.IMPORT
  },
  id: 'importVehiclesSection',
  title: m.importVehicles.title,
  children: [
    buildMultiField({
      id: 'importVehiclesMultiField',
      title: m.importVehicles.title,
      children: [
        buildDescriptionField({
          id: 'importVehiclesDescription',
          description: m.importVehicles.description,
        }),
        buildCheckboxField({
          id: 'selectedImportVehicles',
          title: m.importVehicles.checkboxLabel,
          required: true,
          condition: (_formValue, externalData) => {
            const vehicles = getVehicles(externalData)
            return vehicles.filter((v) => v.permno).length <= VEHICLE_TABLE_THRESHOLD
          },
          options: (application: Application) => {
            const vehicles = getVehicles(application.externalData)

            return vehicles
              .filter((v) => v.permno)
              .map((v) => ({
                label: {
                  ...m.commonVehicleMessages.vehicleCheckboxLabel,
                  values: {
                    permno: v.permno,
                    type: v.type ? ` - ${v.type}` : '',
                  },
                },
                subLabel: {
                  ...m.commonVehicleMessages.vehicleCheckboxSubLabel,
                  values: {
                    mileage: `<b>${v.milage?.toLocaleString('is-IS') ?? '—'}</b>`,
                  },
                },
                value: v.permno as string,
              }))
          },
        }),
        buildPaginatedSearchableTableField({
          id: 'selectedImportVehicles',
          doesNotRequireAnswer: true,
          condition: (_formValue, externalData) => {
            const vehicles = getVehicles(externalData)
            return vehicles.length > VEHICLE_TABLE_THRESHOLD
          },
          rowIdKey: 'permno',
          rows: (application) => {
            const vehicles = getVehicles(application.externalData)

            return vehicles
              .filter((v) => v.permno)
              .map((v) => ({
                permno: v.permno as string,
                type: v.type ?? '',
                mileage: v.milage ? `${v.milage.toLocaleString('is-IS')} km` : '—',
              }))
          },
          headers: [
            {
              key: 'permno',
              label: m.importVehicles.tableHeaderPermno,
            },
            {
              key: 'type',
              label: m.importVehicles.tableHeaderType,
            },
            {
              key: 'mileage',
              label: m.importVehicles.tableHeaderMileage,
            },
          ],
          searchLabel: m.importVehicles.searchLabel,
          searchPlaceholder: m.importVehicles.searchPlaceholder,
          emptyState: m.importVehicles.emptyState,
          searchKeys: ['permno', 'type'],
          pageSize: VEHICLE_TABLE_THRESHOLD,
        }),
      ],
    }),
  ],
})
