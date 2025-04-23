import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import {
  formatNationalId,
  formatPhoneNumber,
  getApplicationAnswers,
} from '../../utils/utils'
import { application, inReview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

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
        buildDescriptionField({
          id: 'reviewInfo.applicationReview.info',
          title: inReview.reviewInfo.infoHeading,
          description: inReview.reviewInfo.infoBullets,
          titleVariant: 'h3',
          space: 6,
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
            // TODO: Fix this, need to have a way to go to pre-signing page
            // {
            //   event: 'goToPreSigning',
            //   name: application.goToPreSigningButton,
            //   type: 'primary',
            // },
          ],
        }),
      ],
    }),
  ],
})
