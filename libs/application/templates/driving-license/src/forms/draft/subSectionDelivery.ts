import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildSubSection,
} from '@island.is/application/core'
import { NationalRegistryUser } from '../../types/schema'
import { m } from '../../lib/messages'
import {
  chooseDistrictCommissionerDescription,
  hasNoDrivingLicenseInOtherCountry,
} from '../../lib/utils'

import { Jurisdiction } from '@island.is/clients/driving-license'

export const subSectionDelivery = buildSubSection({
  id: 'user',
  title: m.informationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'info',
      title: m.pickupLocationTitle,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'afhending',
          title: m.districtCommisionerTitle,
          titleVariant: 'h4',
          description: chooseDistrictCommissionerDescription,
        }),
        buildSelectField({
          id: 'jurisdiction',
          title: m.districtCommisionerPickup,
          disabled: false,
          required: true,
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
