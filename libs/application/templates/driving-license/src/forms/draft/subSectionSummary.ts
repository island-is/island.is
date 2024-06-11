import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildDividerField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, StaticText } from '@island.is/application/types'
import { NationalRegistryUser, TeacherV4 } from '../../types/schema'
import { m } from '../../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { StudentAssessment } from '@island.is/api/schema'
import { B_TEMP, BE, YES } from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  isApplicationForCondition,
  needsHealthCertificateCondition,
} from '../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const subSectionSummary = buildSubSection({
  id: 'overview',
  title: m.overviewSectionTitle,
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
          title: '',
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
          label: m.overviewPaymentCharge,
          value: ({ externalData, answers }) => {
            const items = externalData.payment.data as {
              priceAmount: number
              chargeItemCode: string
            }[]
            const targetCode =
              answers.applicationFor === B_TEMP
                ? 'AY114'
                : answers.applicationFor === BE
                ? 'AY115'
                : 'AY110'

            const item = items.find(
              ({ chargeItemCode }) => chargeItemCode === targetCode,
            )
            return (item?.priceAmount?.toLocaleString('is-IS') +
              ' kr.') as StaticText
          },
          width: 'full',
        }),
      ],
    }),
  ],
})
