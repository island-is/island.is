import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  formatNationalId,
  formatPhoneNumber,
  getApplicationAnswers,
} from '../../utils/utils'
import { TRUE } from '../../utils/constants'
import { inReview } from '../../lib/messages'

export const PreSignatureInfoSection = buildSection({
  id: 'preSignatureInfo',
  title: inReview.preSignatureInfo.sectionName,
  children: [
    buildMultiField({
      id: 'preSignatureInfo',
      title: inReview.preSignatureInfo.sectionName,
      description: inReview.preSignatureInfo.pageDescription,
      children: [
        buildDescriptionField({
          id: 'preSignatureInfo.info',
          title: inReview.preSignatureInfo.infoHeading,
          description: inReview.preSignatureInfo.infoBullets,
          titleVariant: 'h3',
          space: 0,
        }),
        buildStaticTableField({
          title: inReview.preSignatureInfo.tableTitle,
          marginTop: 6,
          header: [
            inReview.preSignatureInfo.tableHeaderName,
            inReview.preSignatureInfo.tableHeaderId,
            inReview.preSignatureInfo.tableHeaderPhone,
            inReview.preSignatureInfo.tableHeaderEmail,
          ],
          rows: (application) => {
            const { landlords, tenants } = getApplicationAnswers(
              application.answers,
            )

            const filterLandlords = landlords?.filter(
              (landlord) => landlord.isRepresentative?.length === 0,
            )
            const filterTenants = tenants?.filter(
              (tenant) => tenant.isRepresentative?.length === 0,
            )

            const signees = [
              ...(filterLandlords ?? []),
              ...(filterTenants ?? []),
            ]

            return signees.map((person) => [
              person.nationalIdWithName.name ?? '',
              formatNationalId(person.nationalIdWithName.nationalId || '') ??
                '',
              formatPhoneNumber(person.phone || '') ?? '',
              person.email ?? '',
            ])
          },
        }),
        buildCheckboxField({
          id: 'preSignatureInfo.statement',
          required: true,
          options: [
            {
              value: TRUE,
              label: inReview.preSignatureInfo.statementLabel,
            },
          ],
          large: true,
          marginTop: 9,
        }),
        buildSubmitField({
          id: 'preSignatureInfo.buttons',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: inReview.preSignatureInfo.submitButtonText,
              type: 'sign',
            },
          ],
        }),
      ],
    }),
  ],
})
