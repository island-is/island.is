import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { TRUE } from '../../lib/constants'
import { signatureInfo } from '../../lib/messages'

export const SignatureInfo = buildSection({
  id: 'signature',
  title: signatureInfo.sectionName,
  children: [
    buildMultiField({
      id: 'signatureInfo',
      title: signatureInfo.sectionName,
      description: signatureInfo.pageDescription,
      nextButtonText: '',
      children: [
        buildDescriptionField({
          id: 'signatureInfo.info',
          title: signatureInfo.infoHeading,
          description: signatureInfo.infoBullets,
          titleVariant: 'h3',
          space: 0,
        }),
        buildStaticTableField({
          title: signatureInfo.tableTitle,
          marginTop: 6,
          header: [
            signatureInfo.tableHeaderName,
            signatureInfo.tableHeaderId,
            signatureInfo.tableHeaderPhone,
            signatureInfo.tableHeaderEmail,
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
        buildCheckboxField({
          id: 'signatureInfo.statement',
          title: '',
          required: true,
          options: [
            {
              value: TRUE,
              label: signatureInfo.statementLabel,
            },
          ],
          large: true,
          marginTop: 9,
        }),
        buildSubmitField({
          id: 'signatureInfo.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: signatureInfo.submitButtonText,
              type: 'sign',
            },
            {
              event: DefaultEvents.EDIT,
              name: 'Til baka í yfirlit',
              type: 'subtle',
            },
          ],
        }),
      ],
    }),
  ],
})
