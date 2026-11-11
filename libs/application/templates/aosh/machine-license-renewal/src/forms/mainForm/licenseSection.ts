import {
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { license } from '../../lib/messages'
import { isOtherAddress, wantsPlasticCard } from '../../utils/conditions'
import { DeliveryMethod } from '../../utils/constants'
import { getLegalDomicile } from '../../utils/address'

export const licenseSection = buildSection({
  id: 'licenseSection',
  title: license.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'license',
      title: license.general.title,
      description: license.general.description,
      children: [
        buildRadioField({
          id: 'license.plasticCard',
          title: license.labels.plasticCard,
          width: 'half',
          required: true,
          clearOnChange: [
            'license.deliveryMethod',
            'license.address',
            'license.postalCodeAndCity',
            'license.recipient',
          ],
          options: [
            { value: YES, label: coreMessages.radioYes },
            { value: NO, label: coreMessages.radioNo },
          ],
        }),
        buildRadioField({
          id: 'license.deliveryMethod',
          title: license.labels.deliveryMethod,
          marginTop: 4,
          required: true,
          condition: wantsPlasticCard,
          clearOnChange: [
            'license.address',
            'license.postalCodeAndCity',
            'license.recipient',
          ],
          options: (application) => [
            {
              value: DeliveryMethod.LEGAL_DOMICILE,
              label: {
                ...license.labels.legalDomicile,
                values: { address: getLegalDomicile(application.externalData) },
              },
            },
            {
              value: DeliveryMethod.OTHER_ADDRESS,
              label: license.labels.otherAddress,
            },
          ],
        }),
        buildTextField({
          id: 'license.address',
          title: license.labels.address,
          width: 'half',
          required: true,
          condition: isOtherAddress,
        }),
        buildTextField({
          id: 'license.postalCodeAndCity',
          title: license.labels.postalCodeAndCity,
          width: 'half',
          required: true,
          condition: isOtherAddress,
        }),
        buildTextField({
          id: 'license.recipient',
          title: license.labels.recipient,
          condition: isOtherAddress,
        }),
      ],
    }),
  ],
})
