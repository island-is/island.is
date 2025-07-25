import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { applicationAnswers } from '../../shared'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
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
            const { landlords, tenants } = applicationAnswers(
              application.answers,
            )

            const signees = [...(landlords ?? []), ...(tenants ?? [])]

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
              value: YesOrNoEnum.YES,
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
