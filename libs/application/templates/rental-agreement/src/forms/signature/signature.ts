import {
  buildActionCardListField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'
import { signature } from '../../lib/messages'
import { RentalAgreement } from '../../lib/dataSchema'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'

export const Signature = buildSection({
  id: 'signature',
  title: signature.sectionName,
  children: [
    buildMultiField({
      id: 'signature',
      title: signature.sectionName,
      description: signature.pageDescription,
      nextButtonText: '',
      children: [
        buildDescriptionField({
          id: 'signature.info',
          title: signature.infoHeading,
          description: signature.infoBullets,
          titleVariant: 'h3',
          space: 0,
        }),
        buildStaticTableField({
          title: signature.tableTitle,
          marginTop: 6,
          header: [
            signature.tableHeaderName,
            signature.tableHeaderId,
            signature.tableHeaderPhone,
            signature.tableHeaderEmail,
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
              formatNationalId(person.nationalIdWithName.nationalId) ?? '',
              formatPhoneNumber(person.phone as string) ?? '',
              person.email ?? '',
            ])
          },
        }),
        buildActionCardListField({
          id: 'actionCardList',
          title: 'Action cards with buttons',
          marginTop: 12,
          items: () => {
            return [
              {
                backgroundColor: 'blue',
                heading: 'Undirrita leigusamning',
                headingVariant: 'h3',
                buttonType: 'primary',
                cta: {
                  label: 'Senda í undirritun',
                  variant: 'primary',
                  icon: 'pencil',
                  onClick: () => {
                    // TODO: Create function to open modal with button to Taktikal signing
                    console.log('Should open modal with signing button')
                  },
                },
              },
            ]
          },
        }),
      ],
    }),
  ],
})
