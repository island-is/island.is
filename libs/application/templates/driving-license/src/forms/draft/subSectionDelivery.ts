import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
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
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      children: [
        buildDescriptionField({
          id: 'pickupHeader',
          title: 'Hvernig vilt þú fá plastökuskírteini þitt afhent?',
          titleVariant: 'h4',
        }),
        buildRadioField({
          id: 'pickup',
          title: '',
          defaultValue: Pickup.POST,
          options: [
            { value: Pickup.POST, label: m.overviewPickupPost },
            { value: Pickup.DISTRICT, label: m.overviewPickupDistrict },
          ],
        }),
        buildSelectField({
          id: 'jurisdiction',
          title: 'Veldu afhendingarstað',
          required: true,
          placeholder: m.districtCommissionerPickupPlaceholder,
          condition: (answers) => answers.pickup === Pickup.DISTRICT,
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
