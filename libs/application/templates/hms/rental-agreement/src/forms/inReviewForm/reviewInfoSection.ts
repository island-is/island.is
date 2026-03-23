import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { ApplicantsInfo, applicationAnswers } from '../../shared'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
import { NextStepInReviewOptions } from '../../utils/enums'
import { getNextStepInReviewOptions } from '../../utils/options'
import * as m from '../../lib/messages'
import { applicantIsCompany } from '../../utils/conditions'

export const ReviewInfoSection = buildSection({
  id: 'inReview',
  title: m.inReview.reviewInfo.sectionName,
  children: [
    buildMultiField({
      id: 'reviewInfo',
      title: m.inReview.reviewInfo.sectionName,
      description: m.inReview.reviewInfo.pageDescription,
      children: [
        buildStaticTableField({
          title: m.inReview.reviewInfo.tableTitle,
          marginTop: 3,
          header: [
            m.misc.fullName,
            m.misc.nationalId,
            m.misc.phoneNumber,
            m.misc.email,
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
        buildStaticTableField({
          title: m.overview.signatoryHeader,
          marginTop: 3,
          header: [
            m.misc.fullName,
            m.misc.nationalId,
            m.misc.phoneNumber,
            m.misc.email,
          ],
          condition: applicantIsCompany,
          rows: (application) => {
            const signatory = getValueViaPath<ApplicantsInfo>(
              application.answers,
              'parties.signatory',
            )
            return [
              [
                signatory?.nationalIdWithName.name ?? '',
                formatNationalId(
                  signatory?.nationalIdWithName.nationalId || '',
                ) ?? '',
                formatPhoneNumber(signatory?.phone || '') ?? '',
                signatory?.email ?? '',
              ],
            ]
          },
        }),
        buildDescriptionField({
          id: 'reviewInfo.applicationReview.info',
          title: m.inReview.reviewInfo.infoHeading,
          description: m.inReview.reviewInfo.infoBullets,
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
              name: m.application.backToOverviewButton,
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
