import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { VehicleWithMileage } from '../../lib/types'
import { RegistrationType } from '../../utils/constants'

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
        }),
        buildCheckboxField({
          id: 'selectedExportVehicles',
          title: m.exportVehicles.checkboxLabel,
          required: true,
          options: (application: Application) => {
            const vehicles =
              getValueViaPath<VehicleWithMileage[]>(
                application.externalData,
                'getCurrentVehicles.data',
              ) ?? []

            return vehicles
              .filter((v) => v.permno)
              .map((v) => ({
                label: `${v.permno} — Síðasta km staða: ${
                  v.milage?.toLocaleString('de-DE') ?? '—'
                } km`,
                value: v.permno as string,
              }))
          },
        }),
      ],
    }),
  ],
})
