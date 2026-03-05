import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { m } from '../../lib/messages'
import { VehicleWithMileage } from '../../lib/types'
import { RegistrationType } from '../../utils/constants'
import { formatDate } from '../../utils/dateUtils'

const getVehicleOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  type: RegistrationType,
) => {
  const isExport = type === RegistrationType.EXPORT
  const selectedPermnos =
    getValueViaPath<string[]>(
      answers,
      isExport ? 'selectedExportVehicles' : 'selectedImportVehicles',
    ) ?? []
  const vehicleMileageEntries =
    getValueViaPath<Array<{ mileage?: string }>>(
      answers,
      isExport ? 'exportVehicleMileage' : 'importVehicleMileage',
    ) ?? []
  const vehicles =
    getValueViaPath<VehicleWithMileage[]>(
      externalData,
      'getCurrentVehicles.data',
    ) ?? []
  const selectedVehicles = vehicles.filter(
    (v) => v.permno && selectedPermnos.includes(v.permno),
  )
  const mileageLabel = isExport
    ? m.overview.mileageAtDeparture
    : m.overview.mileageAtArrival

  return selectedVehicles.map((vehicle, index) => ({
    width: 'full' as const,
    keyText: (vehicle.permno ?? '') + ':',
    valueText: `${mileageLabel.defaultMessage}: ${
      vehicleMileageEntries[index]?.mileage ?? '—'
    } km`,
  }))
}

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: m.overview.title,
      children: [
        buildOverviewField({
          id: 'overviewDates',
          title: m.overview.datesHeader,
          titleVariant: 'h4',
          bottomLine: true,
          items: (answers: FormValue) => {
            const registrationType = getValueViaPath<RegistrationType>(
              answers,
              'registrationType',
            )
            const departureDate =
              getValueViaPath<string | null>(answers, 'exportDate') ?? null
            const returnDate =
              getValueViaPath<string | null>(answers, 'importDate') ?? null

            const dateItems = []

            if (registrationType === RegistrationType.EXPORT && departureDate) {
              dateItems.push({
                width: 'half' as const,
                keyText: m.overview.departureDateLabel,
                valueText: formatDate(departureDate),
              })
            }

            if (registrationType === RegistrationType.IMPORT && returnDate) {
              dateItems.push({
                width: 'half' as const,
                keyText: m.overview.returnDateLabel,
                valueText: formatDate(returnDate),
              })
            }

            return dateItems
          },
        }),
        buildOverviewField({
          id: 'overviewExportVehicles',
          title: m.overview.exportVehiclesHeader,
          titleVariant: 'h4',
          bottomLine: true,
          condition: (answers: FormValue) =>
            getValueViaPath<RegistrationType>(answers, 'registrationType') ===
            RegistrationType.EXPORT,
          items: (answers: FormValue, externalData: ExternalData) =>
            getVehicleOverviewItems(
              answers,
              externalData,
              RegistrationType.EXPORT,
            ),
        }),
        buildOverviewField({
          id: 'overviewImportVehicles',
          title: m.overview.importVehiclesHeader,
          titleVariant: 'h4',
          bottomLine: true,
          condition: (answers: FormValue) =>
            getValueViaPath<RegistrationType>(answers, 'registrationType') ===
            RegistrationType.IMPORT,
          items: (answers: FormValue, externalData: ExternalData) =>
            getVehicleOverviewItems(
              answers,
              externalData,
              RegistrationType.IMPORT,
            ),
        }),
        buildSubmitField({
          id: 'overviewSubmit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
