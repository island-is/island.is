import {
  buildMultiField,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  DefaultEvents,
  ExternalData,
  FormValue,
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
import {
  hasNoDrivingLicenseInOtherCountry,
  isApplicationForCondition,
  isRedesignedBTempOrBFull,
  needsHealthCertificateCondition,
} from '../../utils'
import { formatPhoneNumber } from '@island.is/shared/utils'
import { Pickup } from '../../types'

const isRedesigned65 = (answers: FormValue) =>
  answers.applicationFor === B_FULL_RENEWAL_65 &&
  getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true

// Legacy "bring the certificate to sýslumaður" checkbox — only for flows with
// no in-app upload (legacy B-temp / B-full and legacy 65+), and only once a
// certificate is actually required.
const showsBringAlongCertificate = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  !isRedesigned65(answers) &&
  !isRedesignedBTempOrBFull(answers) &&
  needsHealthCertificateCondition(YES)(answers, externalData)

// Uploaded-certificate row — for flows that upload in-app: redesigned 65+
// (mandatory) and redesigned B-temp / B-full when a certificate is required.
const showsUploadedCertificate = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  isRedesigned65(answers) ||
  (isRedesignedBTempOrBFull(answers) &&
    needsHealthCertificateCondition(YES)(answers, externalData))

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
        buildKeyValueField({
          label: m.overviewSubType,
          value: ({ answers: { applicationFor } }) =>
            applicationFor === B_TEMP
              ? m.applicationForTempLicenseTitle
              : applicationFor === B_FULL_RENEWAL_65
              ? m.applicationForRenewalLicenseTitle
              : m.applicationForFullLicenseTitle,
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
        buildDividerField({
          condition: isApplicationForCondition([B_TEMP]),
        }),
        buildKeyValueField({
          label: m.overviewTeacher,
          width: 'half',
          condition: isApplicationForCondition([B_TEMP]),
          value: ({ externalData, answers }) => {
            if (answers.applicationFor === B_TEMP) {
              const selectedNationalId = getValueViaPath<string>(
                answers,
                'drivingInstructor',
              )
              const teachers =
                getValueViaPath<TeacherV4[]>(
                  externalData,
                  'teachers.data',
                  [],
                ) ?? []
              const teacher = teachers.find(
                ({ nationalId }) => nationalId === selectedNationalId,
              )
              // Fall back to the kennitala if the chosen instructor isn't in
              // the (snapshot) list — e.g. an instructor registered after this
              // application was created, now selectable via the live dropdown.
              return (
                teacher?.name ??
                (selectedNationalId ? formatNationalId(selectedNationalId) : '')
              )
            }
            return (
              getValueViaPath<StudentAssessment>(
                externalData,
                'drivingAssessment.data',
              )?.teacherName ?? ''
            )
          },
        }),
        // Health cert section — legacy "bring it along" checkbox. Only for flows
        // with no in-app upload (legacy B-temp / B-full and legacy 65+).
        buildDividerField({
          condition: showsBringAlongCertificate,
        }),
        buildDescriptionField({
          id: 'bringalong',
          title: m.overviewBringAlongTitle,
          titleVariant: 'h4',
          description: '',
          condition: showsBringAlongCertificate,
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
          condition: showsBringAlongCertificate,
        }),
        // Health cert section — uploaded-file display. For flows that upload
        // in-app: redesigned 65+ (mandatory) and redesigned B-temp / B-full.
        buildDividerField({
          condition: showsUploadedCertificate,
        }),
        buildKeyValueField({
          label: m.overviewHealthCertificateUploaded,
          condition: showsUploadedCertificate,
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
              : m.overviewPickupDistrict
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
