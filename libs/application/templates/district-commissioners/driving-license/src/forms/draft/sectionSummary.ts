import {
  buildMultiField,
  buildOverviewField,
  buildSubmitField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  DefaultEvents,
  ExternalData,
  FormValue,
  KeyValueItem,
  StaticText,
} from '@island.is/application/types'
import { NationalRegistryUser, TeacherV4 } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { StudentAssessment } from '@island.is/api/schema'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
} from '../../utils/constants'
import { hasNoDrivingLicenseInOtherCountry, needsHealthCertificateCondition } from '../../utils'
import { formatPhoneNumber } from '@island.is/shared/utils'
import { Pickup } from '../../types'

// Uploaded-certificate row. 65+ always uploads a fresh certificate; B-temp /
// B-full upload one only when a health condition requires it.
const showsUploadedCertificate = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  answers.applicationFor === B_FULL_RENEWAL_65 ||
  needsHealthCertificateCondition(YES)(answers, externalData)

const typeValue = (applicationFor: unknown): StaticText =>
  applicationFor === B_TEMP
    ? m.applicationForTempLicenseTitle
    : applicationFor === B_FULL_RENEWAL_65
    ? m.applicationForRenewalLicenseTitle
    : m.applicationForFullLicenseTitle

const teacherName = (answers: FormValue, externalData: ExternalData): string => {
  if (answers.applicationFor === B_TEMP) {
    const selectedNationalId = getValueViaPath<string>(
      answers,
      'drivingInstructor',
    )
    const teachers =
      getValueViaPath<TeacherV4[]>(externalData, 'teachers.data', []) ?? []
    const teacher = teachers.find(
      ({ nationalId }) => nationalId === selectedNationalId,
    )
    // If the chosen instructor isn't in the (snapshot) list — e.g. one
    // registered after this application was created, now selectable via the
    // live dropdown — fall back to the six-digit (DDMMYY) prefix of their
    // kennitala rather than rendering the full national ID on the overview.
    return (
      teacher?.name ??
      (selectedNationalId
        ? selectedNationalId.replace(/\D/g, '').slice(0, 6)
        : '')
    )
  }
  return (
    getValueViaPath<StudentAssessment>(externalData, 'drivingAssessment.data')
      ?.teacherName ?? ''
  )
}

const chargeTotal = (answers: FormValue, externalData: ExternalData): string => {
  const items =
    getValueViaPath<{ priceAmount: number; chargeItemCode: string }[]>(
      externalData,
      'payment.data',
    ) ?? []

  const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]
  const targetCode =
    typeof answers.applicationFor === 'string'
      ? CHARGE_ITEM_CODES[answers.applicationFor] ?? DEFAULT_ITEM_CODE
      : DEFAULT_ITEM_CODE

  const isPost =
    (answers.delivery as { deliveryMethod: string })?.deliveryMethod ===
    Pickup.POST

  const pickupItem = isPost
    ? items.find(
        ({ chargeItemCode }) =>
          chargeItemCode === CHARGE_ITEM_CODES[DELIVERY_FEE],
      )
    : null

  const item = items.find(({ chargeItemCode }) => chargeItemCode === targetCode)
  const total = (pickupItem?.priceAmount ?? 0) + (item?.priceAmount ?? 0)

  return `${total.toLocaleString('is-IS')} kr.`
}

const overviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] => {
  const isPost =
    getValueViaPath(answers, 'delivery.deliveryMethod') === Pickup.POST
  const nationalRegistry = externalData.nationalRegistry
    ?.data as NationalRegistryUser
  const address = nationalRegistry?.address

  const items: KeyValueItem[] = [
    {
      width: 'full',
      keyText: m.overviewSubType,
      valueText: typeValue(answers.applicationFor),
    },
    {
      width: 'half',
      keyText: m.overviewName,
      lineAboveKeyText: true,
      valueText:
        getValueViaPath(externalData, 'nationalRegistry.data.fullName') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewNationalId,
      valueText: formatNationalId(
        getValueViaPath(externalData, 'nationalRegistry.data.nationalId') ?? '',
      ),
    },
  ]

  if (answers.phone) {
    items.push({
      width: 'half',
      keyText: m.overviewPhoneNumber,
      valueText: formatPhoneNumber(
        (answers.phone as string).replace(/(^00354|^\+354|\D)/g, ''),
      ),
    })
  }

  if (answers.email) {
    items.push({
      width: 'half',
      keyText: m.overviewEmail,
      valueText: answers.email as string,
    })
  }

  items.push({
    width: 'half',
    keyText: m.overviewStreetAddress,
    valueText: address
      ? `${address.streetAddress}, ${address.postalCode} ${address.city}`
      : '',
  })

  if (answers.applicationFor === B_TEMP) {
    items.push({
      width: 'half',
      keyText: m.overviewTeacher,
      lineAboveKeyText: true,
      valueText: teacherName(answers, externalData),
    })
  }

  if (showsUploadedCertificate(answers, externalData)) {
    const files = getValueViaPath<Array<{ name: string }>>(
      answers,
      'healthCertificate',
    )
    items.push({
      width: 'full',
      keyText: m.overviewHealthCertificateUploaded,
      lineAboveKeyText: true,
      valueText: files?.map((f) => f.name).join(', ') ?? '',
    })
  }

  items.push(
    {
      width: 'full',
      keyText: m.pickupLocationTitle,
      lineAboveKeyText: true,
      valueText: isPost ? m.overviewPickupPost : m.overviewPickupDistrict,
    },
    {
      width: 'full',
      keyText: isPost
        ? m.overviewPaymentChargeWithDelivery
        : m.overviewPaymentCharge,
      lineAboveKeyText: true,
      valueText: chargeTotal(answers, externalData),
    },
  )

  return items
}

export const sectionSummary = buildSection({
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
        buildOverviewField({
          id: 'overviewSummary',
          bottomLine: false,
          items: (answers, externalData) =>
            overviewItems(answers, externalData),
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
