import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildStaticTableField,
  buildDividerField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { InheritanceReportExternalData } from '../../types'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'

export const signatoryStatusSection = buildSection({
  id: 'signatoryStatus',
  title: m.signingTitle,
  children: [
    buildMultiField({
      id: 'signatoryStatusMultiField',
      title: m.signingTitle,
      description: m.signingDescription,
      children: [
        buildStaticTableField({
          title: m.signingTableTitle,
          marginTop: 3,
          header: [
            m.inReviewSignatoriesNameLabel,
            m.inReviewSignatoriesNationalIdLabel,
            m.inReviewSignatoriesStatusLabel,
          ],
          rows: (application) => {
            const externalData = application.externalData as InheritanceReportExternalData
            const signatories = externalData?.getSignatories?.data?.signatories || []

            return signatories.map((signatory) => [
              signatory.name || '',
              formatNationalId(signatory.nationalId || ''),
              signatory.signed
                ? m.inReviewStatusSigned.defaultMessage
                : m.inReviewStatusPending.defaultMessage,
            ])
          },
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'signatoryStatus.info',
          title: m.signingActionsInfoTitle,
          description: m.signingActionsInfoDescription,
          titleVariant: 'h3',
          space: 6,
          marginTop: 7,
        }),
        buildSubmitField({
          id: 'reviewActions.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.inReviewActionsBackToEdit.defaultMessage,
              type: 'subtle',
            },
            {
              event: DefaultEvents.SUBMIT,
              name: m.inReviewActionsComplete.defaultMessage,
              type: 'primary',
              condition: (answers, externalData) => {
                // Only show complete button when all signatories have signed
                const typedExternalData = externalData as InheritanceReportExternalData
                const signatories =
                  typedExternalData?.getSignatories?.data?.signatories || []
                return signatories.every((s) => s.signed)
              },
            },
          ],
        }),
      ],
    }),
  ],
})

