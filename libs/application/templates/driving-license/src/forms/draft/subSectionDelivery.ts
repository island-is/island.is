import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { hasNoDrivingLicenseInOtherCountry } from '../../lib/utils/formUtils'

import { Jurisdiction } from '@island.is/clients/driving-license'
import { Pickup } from '../../lib/constants'

export const subSectionDelivery = buildSubSection({
  id: 'user',
  title: m.informationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'info',
      title: m.pickupLocationTitle,
      description: m.pickupLocationDescription,
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
          options: ({
            externalData: {
              jurisdictions: { data },
            },
          }) => {
            return (data as Jurisdiction[]).map(({ id, name, zip }) => ({
              value: `${id}`,
              label: name,
              tooltip: `Póstnúmer ${zip}`,
            }))
          },
        }),
      ],
    }),
  ],
})
