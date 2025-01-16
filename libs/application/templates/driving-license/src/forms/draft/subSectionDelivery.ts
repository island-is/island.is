import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  chooseDistrictCommissionerDescription,
  hasNoDrivingLicenseInOtherCountry,
} from '../../lib/utils'

import { Jurisdiction } from '@island.is/clients/driving-license'
import { B_FULL_RENEWAL_65 } from '../../lib/constants'
import { Pickup } from '../../lib/types'

export const subSectionDelivery = buildSubSection({
  id: 'user',
  title: m.informationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'info',
      title: m.pickupLocationTitle,
      children: [
        buildDescriptionField({
          id: 'jurisdictionHeader',
          description: chooseDistrictCommissionerDescription,
        }),
        buildSelectField({
          id: 'jurisdiction',
          title: m.districtCommissionerPickup,
          required: true,
          placeholder: m.districtCommissionerPickupPlaceholder,
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
        buildDescriptionField({
          id: 'pickupHeader',
          description: m.pickupLocationHeader,
          titleVariant: 'h4',
          space: 'containerGutter',
          condition: (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
        }),
        buildRadioField({
          id: 'pickup',
          defaultValue: Pickup.POST,
          condition: (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
          options: [
            { value: Pickup.POST, label: m.overviewPickupPost },
            { value: Pickup.DISTRICT, label: m.overviewPickupDistrict },
          ],
        }),
      ],
    }),
  ],
})
