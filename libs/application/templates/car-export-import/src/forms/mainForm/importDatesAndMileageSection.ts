import {
  buildDateField,
  buildFieldsRepeaterField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { VehicleWithMileage } from '../../lib/types'
import { RegistrationType } from '../../utils/constants'

const getSelectedVehicles = (application: Application) => {
  const selectedPermnos =
    getValueViaPath<string[]>(application.answers, 'selectedImportVehicles') ??
    []
  const vehicles =
    getValueViaPath<VehicleWithMileage[]>(
      application.externalData,
      'getCurrentVehicles.data',
    ) ?? []
  return vehicles.filter((v) => v.permno && selectedPermnos.includes(v.permno))
}

export const importDatesAndMileageSection = buildSection({
  condition: (answers) => {
    const registrationTypeValue = getValueViaPath<string>(
      answers,
      'registrationType',
    )

    return registrationTypeValue === RegistrationType.IMPORT
  },
  id: 'importDatesAndMileageSection',
  title: m.commonDatesAndMileageMessages.sectionTitle,
  children: [
    buildSubSection({
      id: 'importDatesSubSection',
      title: m.commonDatesAndMileageMessages.sectionTitle,
      children: [
        buildMultiField({
          id: 'importDatesMultiField',
          title: m.commonDatesAndMileageMessages.title,
          description: m.importDatesAndMileage.description,
          children: [
            buildDateField({
              id: 'importDate',
              title: m.importDatesAndMileage.returnDateLabel,
              required: true,
              defaultValue: '',
              width: 'half',
            }),
            buildFieldsRepeaterField({
              id: 'importVehicleMileage',
              title: '',
              hideAddButton: true,
              hideRemoveButton: true,
              minRows: (answers: FormValue) => {
                const selectedPermnos =
                  getValueViaPath<string[]>(
                    answers,
                    'selectedImportVehicles',
                  ) ?? []
                return selectedPermnos.length
              },
              maxRows: (answers: FormValue) => {
                const selectedPermnos =
                  getValueViaPath<string[]>(
                    answers,
                    'selectedImportVehicles',
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
                  label: m.importDatesAndMileage.mileageLabel,
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
            buildFileUploadField({
              id: 'importVehicleMileageFile',
              title: m.importDatesAndMileage.mileageFileLabel,
              maxSize: 10 * 1024 * 1024, // 10MB
              uploadAccept: '.pdf',
              uploadMultiple: true,
              doesNotRequireAnswer: false,
              uploadHeader: m.importDatesAndMileage.uploadDocsHeader,
              uploadDescription: m.importDatesAndMileage.uploadDocsDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
