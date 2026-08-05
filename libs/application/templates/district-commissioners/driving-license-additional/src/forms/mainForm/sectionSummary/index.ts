import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
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
  formatRegisteredAddress,
  getCodes,
  Pickup,
} from '../../../utils'
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
        buildOverviewField({
          id: 'overviewApplicant',
          items: (answers, externalData) => [
            {
              width: 'half',
              keyText: m.overviewName,
              valueText:
                getValueViaPath<string>(
                  externalData,
                  'nationalRegistry.data.fullName',
                ) ?? '',
            },
            {
              width: 'half',
              keyText: m.overviewNationalId,
              valueText: formatNationalId(
                getValueViaPath<string>(
                  externalData,
                  'nationalRegistry.data.nationalId',
                ) ?? '',
              ),
            },
            {
              width: 'half',
              keyText: m.overviewPhoneNumber,
              hideIfEmpty: true,
              valueText: (() => {
                const phone = getValueViaPath<string>(
                  answers,
                  'applicant.phoneNumber',
                )
                return phone
                  ? formatPhoneNumber(phone.replace(/(^00354|^\+354|\D)/g, ''))
                  : ''
              })(),
            },
            {
              width: 'half',
              keyText: m.overviewEmail,
              hideIfEmpty: true,
              valueText:
                getValueViaPath<string>(answers, 'applicant.email') ?? '',
            },
            {
              width: 'half',
              keyText: m.overviewStreetAddress,
              valueText: formatRegisteredAddress(
                getValueViaPath<NationalRegistryUser['address']>(
                  externalData,
                  'nationalRegistry.data.address',
                ),
              ),
            },
          ],
        }),
        // Health cert — uploaded-file display. BE: gated on health-declaration
        // triggering the upload. Redesigned 65+: always present (cert mandatory
        // regardless of health questions, which 65+ doesn't have).
        buildOverviewField({
          id: 'overviewHealthCertificate',
          items: (answers) => {
            const files =
              getValueViaPath<Array<{ name: string }>>(
                answers,
                'healthCertificate',
              ) ?? []
            return [
              {
                width: 'full',
                keyText: m.overviewHealthCertificateUploaded,
                valueText: files.map((file) => file.name).join(', '),
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overviewPickup',
          items: (answers, externalData) => {
            if (
              getValueViaPath(answers, 'delivery.deliveryMethod') ===
              Pickup.POST
            ) {
              return [
                {
                  width: 'full',
                  keyText: m.pickupLocationTitle,
                  valueText: m.overviewPickupPost,
                },
              ]
            }

            const jurisdictionId = getValueViaPath(
              answers,
              'delivery.jurisdiction',
            )
            const jurisdiction = getValueViaPath<Jurisdiction[]>(
              externalData,
              'jurisdictions.data',
            )?.find(({ id }) => `${id}` === `${jurisdictionId}`)

            return [
              {
                width: 'full',
                keyText: m.pickupLocationTitle,
                valueText: {
                  ...m.overviewPickupDistrictWithLocation,
                  values: { location: jurisdiction?.name ?? '' },
                },
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overviewPayment',
          items: (answers, externalData) => {
            const label =
              getValueViaPath(answers, 'delivery.deliveryMethod') ===
              Pickup.POST
                ? m.overviewPaymentChargeWithDelivery
                : m.overviewPaymentCharge

            // getCodes throws when applicationFor is unset; guard so a partial/
            // corrupt answer state degrades to a blank price instead of crashing
            // the whole summary render.
            if (!getValueViaPath(answers, 'applicationFor')) {
              return [{ width: 'full', keyText: label, valueText: '' }]
            }

            const priceItems =
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
                (priceItems.find(({ chargeItemCode }) => chargeItemCode === code)
                  ?.priceAmount ?? 0),
              0,
            )

            return [
              {
                width: 'full',
                keyText: label,
                valueText: total.toLocaleString('is-IS') + ' kr.',
              },
            ]
          },
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
