import {
  buildAlertMessageField,
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

export const exportVehiclesSection = buildSection({
  condition: (answers) => {
    const registrationTypeValue = getValueViaPath<string>(
      answers,
      'registrationType',
    )

    return registrationTypeValue === RegistrationType.EXPORT
  },
  id: 'exportVehiclesSection',
  title: m.exportVehicles.title,
  children: [
    buildMultiField({
      id: 'exportVehiclesMultiField',
      title: m.exportVehicles.title,
      children: [
        buildDescriptionField({
          id: 'exportVehiclesDescription',
          description: m.exportVehicles.description,
        }),
        buildAlertMessageField({
          id: 'exportVehiclesAlert',
          alertType: 'info',
          title: m.exportVehicles.alertTitle,
          message: m.exportVehicles.alertMessage,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'selectedExportVehicles',
          title: m.exportVehicles.checkboxLabel,
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
          id: 'selectedExportVehicles',
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
              label: m.exportVehicles.tableHeaderPermno,
            },
            {
              key: 'type',
              label: m.exportVehicles.tableHeaderType,
            },
            {
              key: 'mileage',
              label: m.exportVehicles.tableHeaderMileage,
            },
          ],
          searchLabel: m.exportVehicles.searchLabel,
          searchPlaceholder: m.exportVehicles.searchPlaceholder,
          emptyState: m.exportVehicles.emptyState,
          searchKeys: ['permno', 'type'],
          pageSize: VEHICLE_TABLE_THRESHOLD,
        }),
      ],
    }),
  ],
})
