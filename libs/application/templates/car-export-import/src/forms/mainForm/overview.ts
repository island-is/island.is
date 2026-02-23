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
import { formatDate } from '../../utils/dateUtils'

interface VehicleWithMileage {
  permno: string | null
  milage: number | null
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
            const departureDate =
              getValueViaPath<string>(answers, 'departureDate') ?? ''
            const returnDate =
              getValueViaPath<string>(answers, 'returnDate') ?? ''

            return [
              {
                width: 'half' as const,
                keyText: m.overview.departureDateLabel,
                valueText: formatDate(departureDate),
              },
              {
                width: 'half' as const,
                keyText: m.overview.returnDateLabel,
                valueText: returnDate ? formatDate(returnDate) : '—',
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overviewVehicles',
          title: m.overview.vehiclesHeader,
          titleVariant: 'h4',
          bottomLine: true,
          items: (answers: FormValue, externalData: ExternalData) => {
            const selectedPermnos =
              getValueViaPath<string[]>(answers, 'selectedVehicles') ?? []
            const vehicleMileageEntries =
              getValueViaPath<Array<{ mileage?: string }>>(
                answers,
                'vehicleMileage',
              ) ?? []
            const vehicles =
              getValueViaPath<VehicleWithMileage[]>(
                externalData,
                'getCurrentVehicles.data',
              ) ?? []
            const selectedVehicles = vehicles.filter(
              (v) => v.permno && selectedPermnos.includes(v.permno),
            )

            return selectedVehicles.map((vehicle, index) => ({
              width: 'full' as const,
              keyText: vehicle.permno ?? '',
              valueText: `${m.overview.mileageAtDeparture.defaultMessage}: ${
                vehicleMileageEntries[index]?.mileage ?? '—'
              } km`,
            }))
          },
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
