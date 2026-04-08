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
import { VehicleWithMileage, VehiclesResponse } from '../../lib/types'
import { RegistrationType } from '../../utils/constants'

const getSelectedVehicles = (application: Application) => {
  const selectedPermnos =
    getValueViaPath<string[]>(application.answers, 'selectedExportVehicles') ??
    []

  const serverDetails =
    getValueViaPath<VehicleWithMileage[]>(
      application.answers,
      'selectedExportVehicleDetails',
    ) ?? []

  if (serverDetails.length > 0) {
    return serverDetails.filter(
      (v) => v.permno && selectedPermnos.includes(v.permno),
    )
  }

  const response = getValueViaPath<VehiclesResponse>(
    application.externalData,
    'getCurrentVehicles.data',
  )
  const vehicles = response?.vehicles ?? []
  return vehicles.filter((v) => v.permno && selectedPermnos.includes(v.permno))
}

export const exportDatesAndMileageSection = buildSection({
  condition: (answers) => {
    const registrationTypeValue = getValueViaPath<string>(
      answers,
      'registrationType',
    )

    return registrationTypeValue === RegistrationType.EXPORT
  },
  id: 'exportDatesAndMileageSection',
  title: m.commonDatesAndMileageMessages.sectionTitle,
  children: [
    buildSubSection({
      id: 'exportDatesSubSection',
      title: m.commonDatesAndMileageMessages.sectionTitle,
      children: [
        buildMultiField({
          id: 'exportDatesMultiField',
          title: m.commonDatesAndMileageMessages.title,
          description: m.exportDatesAndMileage.description,
          children: [
            buildDateField({
              id: 'exportDate',
              title: m.exportDatesAndMileage.returnDateLabel,
              required: true,
              defaultValue: '',
              width: 'half',
            }),
            buildFieldsRepeaterField({
              id: 'exportVehicleMileage',
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
                return {
                  ...m.commonDatesAndMileageMessages.lastRecordedMileage,
                  values: { permno: vehicle.permno, mileage: mileageStr },
                }
              },
              formTitleVariant: 'h4',
              formTitleNumbering: 'none',
              fields: {
                mileage: {
                  component: 'input',
                  label: m.exportDatesAndMileage.mileageLabel,
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
