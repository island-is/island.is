import {
  buildActionCardListField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { TRUE } from '../../lib/constants'
import { signature } from '../../lib/messages'

const continueToSignatureStatementIsTrue = (answers: FormValue) => {
  const continueToSignatureStatement = getValueViaPath(
    answers,
    'signature.statement',
    [],
  ) as string[]
  return (
    continueToSignatureStatement && continueToSignatureStatement.includes(TRUE)
  )
}

console.log(!!continueToSignatureStatementIsTrue)

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
        buildCheckboxField({
          id: 'signature.statement',
          title: '',
          options: [
            {
              value: TRUE,
              label:
                'Ég skil að ekki er hægt að gera breytingar á samningi eftir að búið er að senda í undirritun.',
            },
          ],
          large: true,
          marginTop: 9,
        }),
        buildActionCardListField({
          id: 'actionCardList',
          title: '',
          marginTop: 4,
          items: (application) => {
            const continueToSignatureStatement = getValueViaPath(
              application.answers,
              'signature.statement',
              [],
            ) as string[]
            const isSignatureStatementChecked =
              continueToSignatureStatementIsTrue(application.answers)
            console.log(isSignatureStatementChecked)
            return [
              {
                backgroundColor: 'blue',
                heading: 'Undirrita leigusamning',
                headingVariant: 'h3',
                buttonType: 'primary',
                cta: {
                  disabled: !isSignatureStatementChecked,
                  label: 'Senda í undirritun',
                  variant: 'primary',
                  icon: 'pencil',
                  onClick: () => {
                    // TODO: Create function to send to Taktikal signing and go to last screen (done)
                    console.log('Send to signing')
                  },
                },
              },
            ]
          },
        }),
        buildSubmitField({
          id: 'submit',
          title: 'submit',
          placement: 'footer',
          actions: [
            {
              event: 'SUBMIT',
              name: 'Senda í undirritun',
              type: 'sign',
              condition: () => {
                return false
              },
            },
          ],
        }),
      ],
    }),
  ],
})
