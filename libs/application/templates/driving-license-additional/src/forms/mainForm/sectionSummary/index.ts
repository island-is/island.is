import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSubmitField,
  buildDividerField,
  getValueViaPath,
  buildSection,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  StaticText,
} from '@island.is/application/types'
import { NationalRegistryUser } from '@island.is/api/schema'
import { Jurisdiction } from '@island.is/clients/driving-license'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  advancedLicenseMap,
  B_ADVANCED,
  BE,
  Pickup,
} from '../../../lib/constants'
import { getCodes } from '../../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'

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
          value: ({ externalData: { nationalRegistry } }) => {
            const address = (nationalRegistry.data as NationalRegistryUser)
              .address
            if (!address) return ''
            return `${address.streetAddress}, ${address.postalCode} ${address.city}`
          },
        }),

        // Health cert section — uploaded-file display.
        // BE: gated on health-declaration triggering the upload.
        // Redesigned 65+: always shown (cert is mandatory regardless of
        // health questions, which 65+ doesn't have).
        buildDividerField({}),
        buildKeyValueField({
          label: m.overviewHealthCertificateUploaded,
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
          value: ({ answers, externalData }) => {
            if (
              getValueViaPath(answers, 'delivery.deliveryMethod') ===
              Pickup.POST
            ) {
              return m.overviewPickupPost
            }

            const jurisdictionId = getValueViaPath(
              answers,
              'delivery.jurisdiction',
            )
            const jurisdiction = getValueViaPath<Jurisdiction[]>(
              externalData,
              'jurisdictions.data',
            )?.find(({ id }) => `${id}` === `${jurisdictionId}`)

            return {
              ...m.overviewPickupDistrictWithLocation,
              values: { location: jurisdiction?.name ?? '' },
            }
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
            // getCodes throws when applicationFor is unset; guard so a partial/
            // corrupt answer state degrades to a blank price instead of crashing
            // the whole summary render.
            if (!getValueViaPath(answers, 'applicationFor')) {
              return '' as StaticText
            }

            const items =
              getValueViaPath<
                { priceAmount: number; chargeItemCode: string }[]
              >(externalData, 'payment.data') ?? []

            // Derive the total from the same charge codes that are actually
            // billed (getCodes), so the displayed price can't drift from it.
            const total = getCodes({
              answers,
              externalData,
            } as Application).reduce(
              (sum, { code }) =>
                sum +
                (items.find(({ chargeItemCode }) => chargeItemCode === code)
                  ?.priceAmount ?? 0),
              0,
            )

            return (total.toLocaleString('is-IS') + ' kr.') as StaticText
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
