import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
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
      nextButtonText: '',
      children: [
        buildCustomField({
          id: 'reviewInfo.shareApplicationUrl',
          title: 'Deila samningsdrögum',
          component: 'CopyApplicationLink',
        }),
        buildDescriptionField({
          id: 'reviewInfo.applicationReview.info',
          title: inReview.reviewInfo.infoHeading,
          description: inReview.reviewInfo.infoBullets,
          titleVariant: 'h3',
          space: 6,
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
        }),
      ],
    }),
  ],
})
