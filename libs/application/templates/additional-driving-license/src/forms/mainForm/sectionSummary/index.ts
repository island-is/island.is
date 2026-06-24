import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildDividerField,
  getValueViaPath,
  YES,
  buildSection,
} from '@island.is/application/core'
import { DefaultEvents, StaticText } from '@island.is/application/types'
import { NationalRegistryUser } from '@island.is/api/schema'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  advancedLicenseMap,
  B_ADVANCED,
  B_FULL,
  BE,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
} from '../../../lib/constants'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { Pickup } from '../../../lib/types'

export const sectionSummary = buildSection({
  id: 'overview',
  title: m.overviewMultiFieldTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewMultiFieldTitle,
      space: 2,
      description: m.overviewMultiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'subTypeTitle',
          title: m.overviewSubType,
          titleVariant: 'h4',
          space: 0,
        }),
        buildDescriptionField({
          id: 'subType',
          space: 0,
          description: (application, _locale, formatMessage) => {
            if (typeof formatMessage !== 'function') {
              return ''
            }
            const applicationFor = getValueViaPath<string>(
              application.answers,
              'applicationFor',
            )

            if (applicationFor === BE) {
              return `- ${formatMessage(m.applicationForBELicenseTitle)}`
            }

            if (applicationFor === B_ADVANCED) {
              const selected =
                getValueViaPath<string[]>(
                  application.answers,
                  'advancedLicense',
                ) ?? []
              const messages = m as unknown as Record<string, StaticText>

              const labelFor = (code: string) =>
                formatMessage(
                  messages[`applicationForAdvancedLicenseTitle${code}`] ??
                    messages[`applicationForAdvancedLicenseLabel${code}`],
                )

              const lines: string[] = []
              advancedLicenseMap.forEach((item) => {
                const proCode = item.professional?.code
                if (selected.includes(item.code)) {
                  lines.push(`- **${labelFor(item.code)}**`)
                  if (proCode && selected.includes(proCode)) {
                    lines.push(`  - ${labelFor(proCode)}`)
                  }
                } else if (proCode && selected.includes(proCode)) {
                  lines.push(`- **${labelFor(proCode)}**`)
                }
              })

              return lines.join('\n')
            }

            return `- ${formatMessage(m.applicationForFullLicenseTitle)}`
          },
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.overviewName,
          width: 'half',
          value: ({ externalData }) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName') ??
            '',
        }),
        buildKeyValueField({
          label: m.overviewNationalId,
          width: 'half',
          value: ({ externalData }) =>
            formatNationalId(
              getValueViaPath(
                externalData,
                'nationalRegistry.data.nationalId',
              ) ?? '',
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

        // Health cert section — old "bring along" checkbox flow.
        // Renders for non-BE applicants whose health declaration triggered
        // a cert requirement. Redesigned 65+ uploads instead, so suppress
        // this block for that case to avoid double-rendering.
        buildDividerField({}),
        buildDescriptionField({
          id: 'bringalong',
          title: m.overviewBringAlongTitle,
          titleVariant: 'h4',
          description: '',
          condition: (answers, externalData) => answers.applicationFor !== BE,
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
          condition: (answers, externalData) => answers.applicationFor !== BE,
        }),
        // Health cert section — uploaded-file display.
        // BE: gated on health-declaration triggering the upload.
        // Redesigned 65+: always shown (cert is mandatory regardless of
        // health questions, which 65+ doesn't have).
        buildDividerField({
          condition: (answers, externalData) => answers.applicationFor === BE,
        }),
        buildKeyValueField({
          label: m.overviewHealthCertificateUploaded,
          condition: (answers, externalData) => answers.applicationFor === BE,
          value: ({ answers }) => {
            const files = getValueViaPath<Array<{ name: string }>>(
              answers,
              'healthCertificate',
            )
            return files?.map((f) => f.name).join(', ') ?? ''
          },
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.pickupLocationTitle,
          value: ({ answers }) => {
            return getValueViaPath(answers, 'delivery.deliveryMethod') ===
              Pickup.POST
              ? m.overviewPickupPost
              : `${m.overviewPickupDistrict} ${getValueViaPath(
                  answers,
                  'delivery.jurisdiction',
                )}`
          },
          width: 'full',
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: ({ answers }) =>
            getValueViaPath(answers, 'delivery.deliveryMethod') === Pickup.POST
              ? m.overviewPaymentChargeWithDelivery
              : m.overviewPaymentCharge,
          value: ({ answers, externalData }) => {
            const items = externalData.payment.data as {
              priceAmount: number
              chargeItemCode: string
            }[]

            const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]

            const targetCode =
              typeof answers.applicationFor === 'string'
                ? CHARGE_ITEM_CODES[answers.applicationFor]
                  ? CHARGE_ITEM_CODES[answers.applicationFor]
                  : DEFAULT_ITEM_CODE
                : DEFAULT_ITEM_CODE

            let pickupItem = null

            if (
              (answers.delivery as { deliveryMethod: string })
                .deliveryMethod === Pickup.POST
            ) {
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
      ],
    }),
  ],
})
