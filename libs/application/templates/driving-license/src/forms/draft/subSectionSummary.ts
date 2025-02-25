import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildDividerField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, StaticText } from '@island.is/application/types'
import { NationalRegistryUser, TeacherV4 } from '../../types/schema'
import { m } from '../../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { StudentAssessment } from '@island.is/api/schema'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
} from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  isApplicationForCondition,
  needsHealthCertificateCondition,
} from '../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { Pickup } from '../../lib/types'

export const subSectionSummary = buildSubSection({
  id: 'overview',
  title: m.overviewMultiFieldTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewMultiFieldTitle,
      space: 2,
      description: m.overviewMultiFieldDescription,
      children: [
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.orderDrivingLicense,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
        buildKeyValueField({
          label: m.overviewSubType,
          value: ({ answers: { applicationFor } }) =>
            applicationFor === B_TEMP
              ? m.applicationForTempLicenseTitle
              : applicationFor === BE
              ? m.applicationForBELicenseTitle
              : applicationFor === B_FULL_RENEWAL_65
              ? m.applicationForRenewalLicenseTitle
              : m.applicationForFullLicenseTitle,
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.overviewName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: m.overviewNationalId,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            formatKennitala(
              (nationalRegistry.data as NationalRegistryUser).nationalId,
            ),
        }),
        buildKeyValueField({
          label: m.overviewPhoneNumber,
          width: 'half',
          condition: (answers) => !!answers?.phone,
          value: ({ answers: { phone } }) =>
            formatPhoneNumber(
              (phone as string).replace(/(^00354|^\+354|\D)/g, ''),
            ),
        }),
        buildKeyValueField({
          label: m.overviewEmail,
          width: 'half',
          condition: (answers) => !!answers?.email,
          value: ({ answers: { email } }) => email as string,
        }),
        buildKeyValueField({
          label: m.overviewStreetAddress,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).address
              ?.streetAddress +
            ', ' +
            (nationalRegistry.data as NationalRegistryUser).address
              ?.postalCode +
            ' ' +
            (nationalRegistry.data as NationalRegistryUser).address?.city,
        }),
        buildDividerField({
          condition: isApplicationForCondition(B_TEMP),
        }),
        buildKeyValueField({
          label: m.overviewTeacher,
          width: 'half',
          condition: isApplicationForCondition(B_TEMP),
          value: ({
            externalData: {
              drivingAssessment,
              teachers: { data },
            },
            answers,
          }) => {
            if (answers.applicationFor === B_TEMP) {
              const teacher = (data as TeacherV4[]).find(
                ({ nationalId }) =>
                  getValueViaPath(answers, 'drivingInstructor') === nationalId,
              )
              return teacher?.name
            }
            return (drivingAssessment.data as StudentAssessment).teacherName
          },
        }),
        buildDividerField({
          condition: needsHealthCertificateCondition(YES),
        }),
        buildDescriptionField({
          id: 'bringalong',
          title: m.overviewBringAlongTitle,
          titleVariant: 'h4',
          description: '',
          condition: needsHealthCertificateCondition(YES),
        }),
        buildCheckboxField({
          id: 'certificate',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.overviewBringCertificateData,
            },
          ],
          condition: needsHealthCertificateCondition(YES),
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.pickupLocationTitle,
          value: ({ answers }) => {
            return answers.pickup === Pickup.POST
              ? m.overviewPickupPost
              : m.overviewPickupDistrict
          },
          width: 'full',
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.overviewPaymentCharge,
          value: (application) => {
            const items = application.externalData.payment.data as {
              priceAmount: number
              chargeItemCode: string
            }[]

            const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]

            const targetCode =
              typeof application.answers.applicationFor === 'string'
                ? CHARGE_ITEM_CODES[application.answers.applicationFor]
                  ? CHARGE_ITEM_CODES[application.answers.applicationFor]
                  : DEFAULT_ITEM_CODE
                : DEFAULT_ITEM_CODE

            let pickupItem = null

            if (application.answers.pickup === Pickup.POST) {
              pickupItem = items.find(
                ({ chargeItemCode }) =>
                  chargeItemCode === CHARGE_ITEM_CODES[DELIVERY_FEE],
              )
            }

            const item = items.find(
              ({ chargeItemCode }) => chargeItemCode === targetCode,
            )

            const price = item?.priceAmount ?? 0
            const deliveryPrice = pickupItem?.priceAmount ?? 0

            const total = deliveryPrice + price

            return (total?.toLocaleString('is-IS') + ' kr.') as StaticText
          },
          width: 'full',
        }),
      ],
    }),
  ],
})
