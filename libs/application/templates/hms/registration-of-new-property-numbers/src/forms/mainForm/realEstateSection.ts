import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { realEstateMessages } from '../../lib/messages'
import { ChargeItemCode } from '@island.is/shared/constants'
import { PaymentCatalogItem } from '@island.is/application/types'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: realEstateMessages.title,
  children: [
    buildMultiField({
      id: 'realEstate',
      title: realEstateMessages.multifieldTitle,
      description: realEstateMessages.description,
      children: [
        buildSelectField({
          id: 'realEstate.realEstateName',
          title: realEstateMessages.realEstateLabel,
          options: (application) => {
            const properties = getValueViaPath<Array<Fasteign>>(
              application.externalData,
              'getProperties.data',
            )

            return properties
              ? [...properties]
                  .sort((a, b) =>
                    (a.sjalfgefidStadfang?.birting || '').localeCompare(
                      b.sjalfgefidStadfang?.birting || '',
                    ),
                  )
                  .map((property) => ({
                    label: `(${property.fasteignanumer}) ${property?.sjalfgefidStadfang?.birting}`,
                    value: property.fasteignanumer ?? '',
                  }))
              : []
          },
        }),
        buildDescriptionField({
          id: 'realEstateDescription',
          description: realEstateMessages.amountDescription,
        }),
        buildTextField({
          id: 'realEstate.realEstateAmount',
          title: realEstateMessages.amountTitle,
          variant: 'number',
          width: 'half',
          placeholder: '1-999',
          required: true,
          min: 1,
          max: 999,
          setOnChange: async (option, application) => {
            const costPerNewProperty = (
              getValueViaPath<PaymentCatalogItem[]>(
                application.externalData,
                'payment.data',
              ) || []
            ).find(
              (item) =>
                item.chargeItemCode ===
                ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
            )?.priceAmount
            const amount = Number(option)
            const value =
              !costPerNewProperty || amount > 999 || amount < 1
                ? '0'
                : String(amount * costPerNewProperty || 0)
            return [
              {
                key: `realEstate.realEstateCost`,
                value,
              },
            ]
          },
        }),
        buildTextField({
          id: 'realEstate.realEstateCost',
          title: realEstateMessages.costTitle,
          variant: 'currency',
          width: 'half',
          readOnly: true,
          defaultValue: '0',
          rightAlign: true,
        }),
        buildAlertMessageField({
          id: 'realEstateAlert',
          message: (application) => {
            const price = (
              getValueViaPath<PaymentCatalogItem[]>(
                application.externalData,
                'payment.data',
              ) || []
            ).find(
              (item) =>
                item.chargeItemCode ===
                ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
            )
            return {
              ...realEstateMessages.alert,
              values: { unitPrice: price?.priceAmount },
            }
          },
          alertType: 'info',
        }),
        buildTextField({
          id: 'realEstate.realEstateOtherComments',
          variant: 'textarea',
          rows: 7,
          maxLength: 200,
          showMaxLength: true,
          title: realEstateMessages.otherCommentsTitle,
        }),
      ],
    }),
  ],
})
