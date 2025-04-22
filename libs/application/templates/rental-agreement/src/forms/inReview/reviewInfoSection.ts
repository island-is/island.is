import {
  buildCopyLinkField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
import { application, inReview, summary } from '../../lib/messages'
import {
  ApplicationConfigurations,
  DefaultEvents,
} from '@island.is/application/types'

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
            const { landlordInfo, tenantInfo } =
              application.answers as RentalAgreement

            const filterLandlords = landlordInfo.table.filter(
              (landlord) => landlord.isRepresentative?.length === 0,
            )

            const filterTenants = tenantInfo.table.filter(
              (tenant) => tenant.isRepresentative?.length === 0,
            )

            const signees = [...filterLandlords, ...filterTenants]

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
        buildCopyLinkField({
          id: 'reviewInfo.copyLink',
          title: summary.shareLinkLabel,
          description: summary.shareLinkDescription,
          link: (application) => {
            return `${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`
          },
          marginTop: 8,
          marginBottom: 4,
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
            {
              event: DefaultEvents.SUBMIT,
              name: application.goToSigningButton,
              type: 'sign',
            },
          ],
        }),
      ],
    }),
  ],
})
