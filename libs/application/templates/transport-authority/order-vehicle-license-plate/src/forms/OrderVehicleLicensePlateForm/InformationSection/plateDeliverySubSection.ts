import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  buildCheckboxField,
  YES,
  NO,
  getValueViaPath,
  buildSelectField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { ChargeItemCode } from '@island.is/shared/constants'
import { information } from '../../../lib/messages'
import { DeliveryStation } from '../../../shared'

export const plateDeliverySubSection = buildSubSection({
  id: 'plateDelivery',
  title: information.labels.plateDelivery.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateDeliveryMultiField',
      title: information.labels.plateDelivery.title,
      description: information.general.description,
      children: [
        buildAlertMessageField({
          id: 'alertWarningLostPlate',
          title: information.labels.plateDelivery.warningLostPlateTitle,
          alertType: 'warning',
          message: information.labels.plateDelivery.warningLostPlateSubTitle,
        }),
        buildDescriptionField({
          id: 'plateDelivery.subTitle',
          title: information.labels.plateDelivery.subTitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'plateDelivery.deliveryMethodIsDeliveryStation',
          options: [
            {
              value: NO,
              label:
                information.labels.plateDelivery.transportAuthorityOptionTitle,
            },
            {
              value: YES,
              label:
                information.labels.plateDelivery.deliveryStationOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildSelectField({
          id: 'plateDelivery.deliveryStationTypeCode',
          title: information.labels.plateDelivery.deliveryStationTitle,
          placeholder:
            information.labels.plateDelivery.deliveryStationPlaceholder,
          required: true,
          condition: (formValue) => {
            const deliveryMethodIsDeliveryStation = getValueViaPath(
              formValue,
              'plateDelivery.deliveryMethodIsDeliveryStation',
              '',
            ) as string
            return deliveryMethodIsDeliveryStation === YES
          },
          options: (application) => {
            const deliveryStationList = getValueViaPath(
              application.externalData,
              'deliveryStationList.data',
              [],
            ) as DeliveryStation[]

            return deliveryStationList.map(({ name, value }) => ({
              value: value,
              label: name || '',
            }))
          },
        }),
        buildDescriptionField({
          id: 'plateDelivery.includeRushFeeSubTitle',
          title: information.labels.plateDelivery.includeRushFeeSubTitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildCheckboxField({
          id: 'plateDelivery.includeRushFee',
          large: true,
          backgroundColor: 'white',
          defaultValue: [],
          options: (application) => {
            const paymentItems = application?.externalData?.payment?.data as
              | [
                  {
                    priceAmount: number
                    chargeItemCode: string
                  },
                ]
              | undefined
            const rushFeePaymentItem = paymentItems?.find(
              ({ chargeItemCode }) =>
                chargeItemCode ===
                ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_LICENSE_PLATE_RUSH_FEE.toString(),
            )

            return [
              {
                value: YES,
                label:
                  information.labels.plateDelivery.includeRushFeeCheckboxTitle,
                subLabel: `${rushFeePaymentItem?.priceAmount} kr.`,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
