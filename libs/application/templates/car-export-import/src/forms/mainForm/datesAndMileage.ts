import {
  buildDateField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { VehicleWithMileage } from '../../lib/types'

const getSelectedVehicles = (application: Application) => {
  const selectedPermnos =
    getValueViaPath<string[]>(application.answers, 'selectedExportVehicles') ??
    []
  const vehicles =
    getValueViaPath<VehicleWithMileage[]>(
      application.externalData,
      'getCurrentVehicles.data',
    ) ?? []
  return vehicles.filter((v) => v.permno && selectedPermnos.includes(v.permno))
}

export const datesAndMileageSection = buildSection({
  id: 'datesAndMileageSection',
  title: m.datesAndMileage.sectionTitle,
  children: [
    buildSubSection({
      id: 'datesSubSection',
      title: m.datesAndMileage.sectionTitle,
      children: [
        buildMultiField({
          id: 'datesMultiField',
          title: m.datesAndMileage.title,
          description: m.datesAndMileage.description,
          children: [
            buildDateField({
              id: 'departureDate',
              title: m.datesAndMileage.departureDateLabel,
              required: true,
              defaultValue: '',
              width: 'half',
            }),
            buildDateField({
              id: 'returnDate',
              title: m.datesAndMileage.returnDateLabel,
              width: 'half',
            }),
            buildFieldsRepeaterField({
              id: 'vehicleMileage',
              title: '',
              hideAddButton: true,
              hideRemoveButton: true,
              minRows: (answers: FormValue) => {
                const selectedPermnos =
                  getValueViaPath<string[]>(
                    answers,
                    'selectedExportVehicles',
                  ) ?? []
                return selectedPermnos.length
              },
              maxRows: (answers: FormValue) => {
                const selectedPermnos =
                  getValueViaPath<string[]>(
                    answers,
                    'selectedExportVehicles',
                  ) ?? []
                return selectedPermnos.length
              },
              formTitle: (index: number, application: Application) => {
                const selected = getSelectedVehicles(application)
                const vehicle = selected[index]
                if (!vehicle) return ''
                const mileageStr =
                  vehicle.milage?.toLocaleString('is-IS') ?? '—'
                return `${vehicle.permno} — Síðasta skráða km staða: ${mileageStr} km`
              },
              formTitleVariant: 'h4',
              formTitleNumbering: 'none',
              fields: {
                mileage: {
                  component: 'input',
                  label: m.datesAndMileage.mileageLabel,
                  type: 'number',
                  suffix: ' km',
                  required: true,
                  min: 0,
                },
                lastMileage: {
                  component: 'hiddenInput',
                  defaultValue: (
                    application: Application,
                    _activeField: Record<string, string> | undefined,
                    index: number,
                  ) => {
                    const selected = getSelectedVehicles(application)
                    const vehicle = selected[index]
                    return vehicle?.milage?.toString() ?? '0'
                  },
                },
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
