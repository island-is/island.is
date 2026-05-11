import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { FormValue, ExternalData } from '@island.is/application/types'
import { overview } from '../../lib/messages'
import { information } from '../../lib/messages'
import { getSelectedVehicle } from '../../utils'
import { DeliveryStation } from '../../shared'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildOverviewField({
          id: 'overview.vehicle',
          title: overview.labels.vehicle,
          backId: 'pickVehicleMultiField',
          items: (answers: FormValue, externalData: ExternalData) => {
            const vehicle = getSelectedVehicle(externalData, answers)
            return [
              {
                width: 'full' as const,
                valueText: [
                  vehicle?.make ?? '',
                  `${vehicle?.color ?? ''} - ${vehicle?.permno ?? ''}`,
                ],
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overview.plateType',
          title: overview.labels.plateType,
          backId: 'plateTypeMultiField',
          items: (answers: FormValue) => {
            const selectedPlateTypeName = getValueViaPath<string>(
              answers,
              'plateType.selectedPlateTypeName',
            )

            return [
              {
                width: 'full' as const,
                valueText: selectedPlateTypeName ?? '',
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overview.plateSize',
          title: overview.labels.plateSize,
          backId: 'plateSizeMultiField',
          items: (answers: FormValue) => {
            const frontPlateSizeName = getValueViaPath<string>(
              answers,
              'plateSize.frontPlateSizeName',
            )
            const rearPlateSizeName = getValueViaPath<string>(
              answers,
              'plateSize.rearPlateSizeName',
            )

            const items = []

            if (frontPlateSizeName) {
              items.push({
                width: 'full' as const,
                keyText: overview.labels.frontPlateSize,
                inlineKeyText: true,
                valueText: frontPlateSizeName,
              })
            }

            if (rearPlateSizeName) {
              items.push({
                width: 'full' as const,
                keyText: overview.labels.rearPlateSize,
                inlineKeyText: true,
                valueText: rearPlateSizeName,
              })
            }

            return items
          },
        }),
        buildOverviewField({
          id: 'overview.plateDelivery',
          title: overview.labels.plateDelivery,
          backId: 'plateDeliveryMultiField',
          items: (answers: FormValue, externalData: ExternalData) => {
            const deliveryMethodIsDeliveryStation = getValueViaPath<string>(
              answers,
              'plateDelivery.deliveryMethodIsDeliveryStation',
            )
            const includeRushFee =
              getValueViaPath<string[]>(
                answers,
                'plateDelivery.includeRushFee',
              ) ?? []
            const hasRushFee = includeRushFee.includes(YES)

            const items = []

            if (deliveryMethodIsDeliveryStation === YES) {
              const deliveryStationCode = getValueViaPath<string>(
                answers,
                'plateDelivery.deliveryStationTypeCode',
              )
              const deliveryStationList = getValueViaPath<DeliveryStation[]>(
                externalData,
                'deliveryStationList.data',
              )
              const selectedStation = deliveryStationList?.find(
                (s) => s.value === deliveryStationCode,
              )
              items.push({
                width: 'full' as const,
                keyText:
                  information.labels.plateDelivery.deliveryStationOptionTitle,
                inlineKeyText: true,
                valueText: selectedStation?.name ?? '',
              })
            } else {
              items.push({
                width: 'full' as const,
                valueText:
                  information.labels.plateDelivery
                    .transportAuthorityOptionTitle,
              })
            }

            items.push({
              width: 'full' as const,
              keyText: overview.labels.rushFee,
              inlineKeyText: true,
              valueText: hasRushFee
                ? overview.labels.rushFeeYes
                : overview.labels.rushFeeNo,
            })

            return items
          },
        }),
      ],
    }),
  ],
})
