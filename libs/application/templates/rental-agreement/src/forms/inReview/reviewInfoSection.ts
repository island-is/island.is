import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { applicationAnswers } from '../../shared'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
import { NextStepInReviewOptions } from '../../utils/enums'
import { application, inReview } from '../../lib/messages'
import { getNextStepInReviewOptions } from '../../utils/options'

export const ReviewInfoSection = buildSection({
  id: 'inReview',
  title: inReview.reviewInfo.sectionName,
  children: [
    buildMultiField({
      id: 'reviewInfo',
      title: inReview.reviewInfo.sectionName,
      description: inReview.reviewInfo.pageDescription,
      children: [
        buildStaticTableField({
          title: inReview.reviewInfo.tableTitle,
          marginTop: 3,
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

            const signees = [
              ...(landlords.filter((landlord) => !landlord.isRepresentative) ??
                []),
              ...(tenants ?? []),
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
        buildDescriptionField({
          id: 'reviewInfo.applicationReview.info',
          title: inReview.reviewInfo.infoHeading,
          description: inReview.reviewInfo.infoBullets,
          titleVariant: 'h3',
          space: 6,
        }),
        buildRadioField({
          id: 'reviewInfo.applicationReview.nextStepOptions',
          options: getNextStepInReviewOptions(),
          defaultValue: NextStepInReviewOptions.GO_TO_SIGNING,
          space: 2,
          marginTop: 6,
        }),
        buildSubmitField({
          id: 'reviewInfo.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: application.backToOverviewButton,
              type: 'subtle',
            },
          ],
          condition: (answers) => {
            const { nextStepInReviewOptions } = applicationAnswers(answers)
            return (
              nextStepInReviewOptions ===
              NextStepInReviewOptions.EDIT_APPLICATION
            )
          },
        }),
      ],
    }),
  ],
})
