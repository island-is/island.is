import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

import { Jurisdiction } from '@island.is/clients/driving-license'
import { Pickup } from '../../../utils'

export const sectionDelivery = buildSection({
  id: 'user',
  title: m.informationSectionTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.pickupLocationTitle,
      children: [
        buildDescriptionField({
          id: 'pickupHeader',
          title: m.deliveryMethodHeader,
          titleVariant: 'h4',
        }),
        buildRadioField({
          id: 'delivery.deliveryMethod',
          defaultValue: Pickup.POST,
          width: 'half',
          options: [
            { value: Pickup.POST, label: m.overviewPickupPost },
            { value: Pickup.DISTRICT, label: m.overviewPickupDistrict },
          ],
        }),
        buildSelectField({
          id: 'delivery.jurisdiction',
          title: m.selectDistrictCommissionerPickup,
          required: true,
          placeholder: m.districtCommissionerPickupPlaceholder,
          condition: (answers) =>
            getValueViaPath(answers, 'delivery.deliveryMethod') ===
            Pickup.DISTRICT,
          options: ({ externalData }) => {
            const jurisdictions =
              getValueViaPath<Jurisdiction[]>(
                externalData,
                'jurisdictions.data',
              ) ?? []
            return jurisdictions.map(({ id, name, zip }) => ({
              value: `${id}`,
              label: name,
              tooltip: { ...m.pickupPostalCodeTooltip, values: { zip } },
            }))
          },
        }),
      ],
    }),
  ],
})
