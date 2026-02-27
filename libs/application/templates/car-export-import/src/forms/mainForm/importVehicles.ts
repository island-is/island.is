import {
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
